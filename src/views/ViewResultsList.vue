<template>
  <AppLayout>
    <div class="app-content">
      <div class="ht-card ht-container">
        <h2>Results</h2>
        <p v-if="results.length === 0">loading...</p>
        <ht-datatable
          v-else
          :columns="columns"
          :rows="results"
          :current-page="currentPage"
        >
          <template #default="slotProps">
            <tr>
              <td>{{ slotProps.row.id }}</td>
              <td>
                {{ date(slotProps.row.dateTime) }}
              </td>
              <td>{{ slotProps.row.title }}</td>
              <td>{{ slotProps.row.status }}</td>
              <td>
                <router-link
                  class="ht-button"
                  data-type="ghost"
                  :to="`/jobs/${slotProps.row.id}`"
                >
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
import { onMounted, ref, watchEffect } from 'vue';
import { date } from '@computational-biology-sw-web-dev-unit/ht-vue';
import AppLayout from '@/layouts/AppLayout.vue';

import { useRoute } from 'vue-router';

import CcrAPI from '@/api/ccr.js';

export default {
  title: 'Jobs Results',
  name: 'ViewCRISPRcleanRResultsList',
  components: { AppLayout },

  setup() {
    const route = useRoute();

    const currentPage = ref(1);

    watchEffect(() => {
      currentPage.value = parseInt(route.query?.page) || 1;
    });

    const results = ref([]);

    onMounted(() => {
      return CcrAPI.getResultsList().then((response) => {
        results.value = response.data;
      });
    });

    const columns = [
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

    return {
      columns,
      date,
      currentPage,
      results,
    };
  },
};
</script>

<style lang="postcss" scoped>
h4 {
  margin-bottom: var(--size-4);
}

.ht-card {
  overflow-x: scroll;
}
</style>
