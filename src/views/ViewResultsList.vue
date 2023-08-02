<template>
  <AppLayout>
    <div class="app-content">
      <div class="ht-card ht-container">
        <h2>Results</h2>
        <ht-datatable :columns="columns" :rows="results" :current-page="currentPage">
          <template #default="slotProps">
            <tr>
              <td v-if="!isMobile">{{ slotProps.row.id }}</td>
              <td v-if="!isMobile">
                {{ date(slotProps.row.dateTime) }}
              </td>
              <td>{{ slotProps.row.title }}</td>
              <td>{{ slotProps.row.status }}</td>
              <td>
                <router-link class="ht-button" data-type="ghost" :to="`/jobs/${slotProps.row.id}`">
                  Show
                </router-link>
              </td>
            </tr>
          </template>
        </ht-datatable>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import { ref, watchEffect } from 'vue';
import {
  resizeListener,
  date,
} from '@computational-biology-sw-web-dev-unit/ht-vue';
import AppLayout from '@/layouts/AppLayout.vue';

import { useRoute } from 'vue-router';

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
    const route = useRoute();

    const currentPage = ref(1);

    watchEffect(() => {
      currentPage.value = parseInt(route.query?.page) || 1;
    });

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
          { width: 'min-content', label: 'Title', name: 'title' },
          { width: 'min-content', label: 'Status', name: 'status' },
          {
            width: 'min-content',
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
      currentPage,
    };
  },
};
</script>

<style lang="postcss" scoped>
h4 {
  margin-bottom: var(--size-4);
}
</style>
