<template>
  <div class="input-field">
    <label v-if="label" class="input-field__label">{{ label }}</label>
    <label class="checkbox">
      <div
        class="checkbox__input"
        :class="{ 'checkbox__input--checked': modelValue }"
      ></div>
      <input hidden type="checkbox" @click="onClick" />
      {{ option }}
    </label>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    option: {
      type: String,
      default: '',
    },
    modelValue: { type: Boolean, required: true },
  },
  emits: { 'update:modelValue': null },
  setup(props, { emit }) {
    const onClick = () => {
      emit('update:modelValue', !props.modelValue);
    };
    return { onClick };
  },
};
</script>

<style lang="scss"></style>
