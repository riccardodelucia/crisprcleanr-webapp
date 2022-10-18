<template>
  <div class="search">
    <BaseInput
      v-bind="$attrs"
      type="text"
      placeholder="Search for job"
      :modelValue="modelValue"
    ></BaseInput>
    <BaseIcon name="search" class="search__icon"></BaseIcon>
  </div>
</template>

<script>
export default {
  name: "BaseSearchBar",
  props: {
    modelValue: [String, Number],
  },
  methods: {
    updateValue(e) {
      this.$emit("search", e.target.value);
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
    top: 1.5em;
  }
}
</style>
