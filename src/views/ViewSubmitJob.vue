<template>
  <FormFill :config="$route.params.config" :key="key" @submitted="incKey"></FormFill>
</template>

<script>
import FormFill from "@/components/ccr/FormFill.vue";
export default {
  title: "Submit New Job",
  name: "ViewCRISPRcleanRSubmitJob",
  components: {
    FormFill,
  },
  methods: {
    // This key is used top rerender the FormFill component. The objective is to force component restart, which can
    // restart the underlying submit machine, thus cleaning its context and history states.
    incKey() {
      this.key += 1;
    }
  },
  data() {
    return {
      key: 1
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
