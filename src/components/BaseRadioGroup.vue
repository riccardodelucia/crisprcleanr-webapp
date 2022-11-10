<template>
  <div class="input-field">
    <label v-if="label" class="input-field__label">{{ label }}</label>
    <div class="radio-group">
      <label
        v-for="option in options"
        :key="option"
        class="radio-group__element"
      >
        <div
          class="radio-group__input"
          :class="{ 'radio-group__input--selected': option === modelValue }"
        ></div>
        <input
          :id="option"
          hidden
          type="radio"
          :value="option"
          @click="emit('update:modelValue', option)"
        />
        {{ option }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseRadionButtonGroup',
  props: {
    label: {
      type: String,
      default: '',
    },
    options: {
      required: true,
      type: Array,
    },
    modelValue: {
      type: String, // TODO make component compatible with any other type, like VueBaseSelect
      default: '',
    },
  },
  setup(_, { emit }) {
    return {
      emit,
    };
  },
};
</script>

<style lang="scss" scoped></style>
