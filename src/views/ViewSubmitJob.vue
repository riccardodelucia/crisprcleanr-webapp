<template>
  <ht-app-layout :sidenav-object="sidenavObject">
    <template #header><the-header></the-header></template>
    <template #sidenav>
      <the-sidenav></the-sidenav>
    </template>
    <template #default>
      <FormFill
        :key="key"
        :config="$route.params.config"
        @submitted="incKey"
      ></FormFill></template
  ></ht-app-layout>
</template>

<script>
import FormFill from '@/components/FormFill.vue';
import TheHeader from '@/components/TheHeader.vue';
import TheSidenav from '@/components/TheSidenav.vue';

export default {
  title: 'Submit New Job',
  name: 'ViewCRISPRcleanRSubmitJob',
  components: {
    TheHeader,
    TheSidenav,
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

<style lang="scss" scoped></style>
