<template>
  <div class="input-field">
    <label class="input-field__label">
      {{ label }}
      <input
        class="input"
        :class="{ 'input--error': error }"
        :value="modelValue"
        v-bind="$attrs"
        @input.stop="onInput"
      />
    </label>
    <div v-if="error" class="input-field__error">
      <vue-feather type="alert-circle" size="16px"></vue-feather
      ><small>{{ error }}</small>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
  },
  emits: { 'update:modelValue': null },
  setup(_, { emit }) {
    const onInput = (event) => {
      emit('update:modelValue', event.target.value);
    };
    return {
      onInput,
    };
  },
};
</script>
