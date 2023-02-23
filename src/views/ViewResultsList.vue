<template>
  <AppLayout>
    <div class="app-content card">
      <h2>Results</h2>
      <ht-datatable :columns="columns" :rows="results">
        <template #default="slotProps">
          <tr>
            <td v-if="!isMobile">{{ slotProps.row.id }}</td>
            <td v-if="!isMobile">
              {{ date(slotProps.row.dateTime) }}
            </td>
            <td>{{ slotProps.row.title }}</td>
            <td>{{ slotProps.row.status }}</td>
            <td>
              <button
                class="btn btn--ghost"
                @click="$router.push(`/jobs/${slotProps.row.id}`)"
              >
                Show
              </button>
            </td>
          </tr>
        </template>
      </ht-datatable>
    </div>
  </AppLayout>
</template>

<script>
import { date } from '@computational-biology-web-unit/ht-vue/utilities';
import { ref, watchEffect } from 'vue';
import { resizeListener } from '@computational-biology-web-unit/ht-vue';
import AppLayout from '@/layouts/AppLayout.vue';

export default {
  title: 'Jobs Results',
  name: 'ViewCRISPRcleanRResultsList',
  components: { AppLayout },
  props: {
    results: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const isMobile = ref(false);

    resizeListener(() => (isMobile.value = window.innerWidth < 770));

    const columns = ref(null);

    watchEffect(() => {
      if (!isMobile.value) {
        columns.value = [
          { width: '30%', label: 'Job ID', name: 'id', type: 'string' },
          {
            width: '20%',
            label: 'Submission Date',
            name: 'dateTime',
            type: 'date',
          },
          { width: '30%', label: 'Title', name: 'title', type: 'string' },
          { width: '10%', label: 'Status', name: 'status', type: 'string' },

          {
            width: '10%',
            label: 'Actions',
            name: 'actions',
            isSortable: false,
          },
        ];
      } else {
        columns.value = [
          { width: '30%', label: 'Title', name: 'title' },
          { width: '30%', label: 'Status', name: 'status' },
          {
            width: '40%',
            label: 'Actions',
            name: 'actions',
            isSortable: false,
          },
        ];
      }
    });

    return {
      columns,
      date,
      isMobile,
    };
  },
};
</script>

<style lang="scss">
.app-content {
  max-width: 150rem;
  margin: var(--space-md);
}
</style>
