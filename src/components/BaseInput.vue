<template>
  <div class="input-field">
    <label class="input-field__label">
      {{ label }}
      <input class="input" :class="{ 'input--error': error }" :value="modelValue" v-bind="$attrs"
        @input.stop="onInput" />
    </label>
    <div class="input-field__error" v-if="error">
      <BaseIcon name="alert-circle" width="16px" height="16px"></BaseIcon><small>{{ error
      }}</small>
    </div>
  </div>
</template>

<script>

export default {
  name: "BaseInput",
  props: {
    label: {
      type: String,
      default: "",
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
    error: {
      type: String,
      default: "",
    },
  },
  setup(_, { emit }) {
    const onInput = (event) => {
      emit("update:modelValue", event.target.value);
    };
    return {
      onInput,
    };
  },
};
</script>
