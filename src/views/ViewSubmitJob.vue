<template>
  <AppLayout>
    <FormFill
      :key="key"
      :config="$route.params.config"
      @submitted="incKey"
    ></FormFill
  ></AppLayout>
</template>

<script>
import FormFill from '@/components/FormFill.vue';
import AppLayout from '@/layouts/AppLayout.vue';

export default {
  title: 'Submit New Job',
  name: 'ViewCRISPRcleanRSubmitJob',
  components: {
    AppLayout,
    FormFill,
  },
  data() {
    return {
      key: 1,
    };
  },
  methods: {
    // This key is used top rerender the FormFill component. The objective is to force component restart, which can
    // restart the underlying submit machine, thus cleaning its context and history states.
    incKey() {
      this.key += 1;
    },
  },
};
</script>
