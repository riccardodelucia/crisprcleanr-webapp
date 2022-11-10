<template>
  <div class="search">
    <BaseInput
      v-bind="$attrs"
      type="text"
      placeholder="Search for job"
      :model-value="modelValue"
    ></BaseInput>
    <div class="search__icon"><vue-feather type="search"></vue-feather></div>
  </div>
</template>

<script>
export default {
  name: 'BaseSearchBar',
  props: {
    modelValue: { type: [String, Number], default: undefined },
  },
  emits: ['search'],
  methods: {
    updateValue(e) {
      this.$emit('search', e.target.value);
    },
  },
};
</script>

<style lang="scss">
.search {
  position: relative;

  input {
    padding-right: 5rem;
  }

  &__icon {
    color: var(--color-grey-dark);
    position: absolute;
    right: 1em;
    top: 0.85em;
  }
}
</style>
