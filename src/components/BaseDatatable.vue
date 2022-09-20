<template>
  <div class="widget datatable">
    <div class="datatable__controls">
      <BaseSearchBar :modelValue="search" @update:modelValue="setSearch"></BaseSearchBar>
      <BaseSelect style="width:6rem" v-model="pageSize" :options="[5, 10, 20]"></BaseSelect>
    </div>

    <table class="datatable__table table">
      <thead class="table__head">
        <tr>
          <th v-for="column in columns" :key="column.name" class="table__head-item" :class="
            sortable(column)
              ? currentSortKey === column.name
                ? sortOrders[column.name] > 0
                  ? 'table__head-item--sorting-asc'
                  : 'table__head-item--sorting-desc'
                : 'table__head-item--sorting'
              : ''
          " :style="'width:' + column.width" @click="sortable(column) && sortBy(column.name)">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody class="table__body">
        <slot :row="row" v-for="(row, index) in paginatedItems" :key="index"></slot>
      </tbody>
    </table>
    <BasePagination class="datatable__pagination" :currentPage="currentPage" :numberOfPages="numberOfPages"
      @paginate="setCurrentPage">
    </BasePagination>
  </div>
</template>

<script>
import { reactive, ref, watch, computed } from "vue";

const search = ref("");
const currentPage = ref(0);
const pageSize = ref(5);

const setSearch = (value) => {
  resetPagination();
  search.value = value;
};

const setCurrentPage = (value) => {
  currentPage.value = value;
};

const resetPagination = () => {
  currentPage.value = 0;
};

const paginate = (items, pageSize, currentPage) => {
  const stopIndex = Math.min((currentPage + 1) * pageSize, items.length);
  return items.slice(currentPage * pageSize, stopIndex);
};

const sortable = (item) => {
  return item?.isSortable ?? true;
};

const filterOnSearch = (rows) => {
  return rows.filter((row) => {
    return Object.keys(row).some((key) => {
      return (
        String(row[key]).toLowerCase().indexOf(search.value.toLowerCase()) > -1
      );
    });
  });
};

const sortData = (data, columns, currentSortKey, order) => {
  const getIndex = (array, key, value) => {
    return array.findIndex((i) => i[key] === value);
  };

  return data.slice().sort((a, b) => {
    const dataColumnIndex = getIndex(columns, "name", currentSortKey);

    const valueA = a[currentSortKey];
    const valueB = b[currentSortKey];

    switch (columns[dataColumnIndex]?.type) {
      case "date": {
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);
        return (dateB.getTime() - dateA.getTime()) * order;
      }
      case "number": {
        return (+valueB - +valueA) * order;
      }

      case "string": {
        const stringA = String(valueA).toLowerCase();
        const stringB = String(valueB).toLowerCase();

        return (stringA === stringB ? 0 : stringA > stringB ? 1 : -1) * order;
      }

      default:
        return 0;
    }
  });
};

export default {
  name: "BaseDatatable",
  props: {
    columns: { type: Array },
    rows: { type: Array },
  },

  setup(props) {
    const currentSortKey = ref(
      props.columns.find((column) => {
        sortable(column);
      })?.name || ""
    );

    const sortOrders = reactive(
      props.columns.reduce((acc, column) => {
        acc[column.name] = -1;
        return acc;
      }, {})
    );

    const sortBy = (key) => {
      resetPagination();
      currentSortKey.value = key;
      sortOrders[key] = sortOrders[key] * -1;
    };

    watch(pageSize, () => {
      resetPagination();
    });

    const filteredItems = computed(() => {
      let rowsNew = props.rows;

      if (search.value) {
        rowsNew = filterOnSearch(props.rows);
      }

      if (currentSortKey.value) {
        const order = sortOrders[currentSortKey.value] || 1;
        rowsNew = sortData(rowsNew, props.columns, currentSortKey.value, order);
      }
      return rowsNew;
    });

    const filteredItemsTotal = computed(() => {
      return filteredItems.value.length;
    });
    const numberOfPages = computed(() => {
      return Math.ceil(filteredItemsTotal.value / pageSize.value);
    });
    const paginatedItems = computed(() => {
      return paginate(filteredItems.value, pageSize.value, currentPage.value);
    });

    return {
      sortable,
      sortBy,
      setSearch,
      setCurrentPage,
      resetPagination,
      sortOrders,
      currentSortKey,
      pageSize,
      currentPage,
      search,
      filteredItemsTotal,
      numberOfPages,
      paginatedItems,
    };
  },
};
</script>

<style lang="scss">
.datatable {
  display: flex;
  flex-direction: column;
  gap: 1em;

  &__controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  &__search {
    margin-right: auto;
  }

  &__select {
    min-width: 8rem;
  }

  &__table {
    overflow: scroll;
  }

  &__pagination {
    align-self: flex-end;
  }
}

.table {
  border-collapse: collapse;
  width: 100%;
  overflow: hidden;
  table-layout: fixed;

  &__head {
    text-align: left;
  }

  &__head-item {
    padding: 0.5em;
    color: var(--color-grey-medium);
    font-size: 1.5rem;

    cursor: pointer;

    &--sorting,
    &--sorting-asc,
    &--sorting-desc {
      padding-right: 18px;
      position: relative;
    }

    &--sorting:before,
    &--sorting:after,
    &--sorting-asc:before,
    &--sorting-asc:after,
    &--sorting-desc:before,
    &--sorting-desc:after {
      border: 4px solid transparent;
      content: "";
      display: block;
      height: 0;
      right: 5px;
      top: 50%;
      position: absolute;
      width: 0;
    }

    &--sorting:before {
      border-bottom-color: var(--color-grey-medium);
      margin-top: -9px;
    }

    &--sorting:after {
      border-top-color: var(--color-grey-medium);
      margin-top: 1px;
    }

    &--sorting-asc:before {
      border-bottom-color: var(--color-grey-medium);
      margin-top: -9px;
    }

    &--sorting-desc:after {
      border-top-color: var(--color-grey-medium);
      margin-top: 1px;
    }
  }

  &__body {
    &>tr>td {
      padding: 0.3em 0.5em;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  &__body>tr>td,
  &__head-item {
    border-bottom: 1px solid var(--color-grey-light);
  }

  &__n-items-selector {
    background-color: var(--color-grey-light);
    border: 1px solid var(--color-grey-medium);
    border-radius: 8px;
    padding: 0.2em 0.3em;
    font-size: 1.5rem;

    &:focus {
      outline: none;
    }
  }
}
</style>
