<template>
  <div class="input-field">
    <label v-if="label" class="input-field__label">
      {{ label }}
      <textarea
        class="textarea"
        :class="{ 'input--error': error }"
        :value="modelValue"
        v-bind="$attrs"
        @input.stop="onInput"
      >
      </textarea>
    </label>
    <div v-if="error" class="input-field__error">
      <vue-feather type="alert-circle" size="16px"></vue-feather
      ><small>{{ error }}</small>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseTextArea',
  props: {
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(_, { emit }) {
    const onInput = (event) => emit('update:modelValue', event.target.value);
    return {
      onInput,
    };
  },
};
</script>
