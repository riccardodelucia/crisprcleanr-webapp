<template>
  <div class="input-field">
    <label class="input-field__label" v-if="label">
      {{ label }}
      <textarea class="textarea" :class="{ 'input--error': error }" :value="modelValue" v-bind="$attrs"
        @input.stop="onInput">
      </textarea>
    </label>
    <div class="input-field__error" v-if="error">
      <BaseIcon name="alert-circle" width="16px" height="16px"></BaseIcon><small>{{ error
      }}</small>
    </div>
  </div>
</template>

<script>

export default {
  name: "BaseTextArea",
  props: {
    label: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String,
      default: "",
    },
    error: {
      type: String,
      default: "",
    },
  },
  setup(_, { emit }) {
    const onInput = (event) => emit("update:modelValue", event.target.value);
    return {
      onInput,
    };
  },
};
</script>
