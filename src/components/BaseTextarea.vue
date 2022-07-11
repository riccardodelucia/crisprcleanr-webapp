<template>
  <div class="input-field">
    <label :for="uuid" class="input-field__label" v-if="label">{{ label }}</label>
    <div class="input-field__element">
      <textarea :id="uuid" class="textarea" :class="{ 'input--error': error }" :value="modelValue" v-bind="$attrs"
        @input.stop="onInput">
    </textarea>
    </div>
    <div class="input-field__error" v-if="error">
      <BaseIcon name="alert-circle" width="16px" height="16px"></BaseIcon><small>{{ error
      }}</small>
    </div>
  </div>
</template>

<script>
import UniqueID from "@/composables/uuid.js";

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
  setup(props, { emit }) {
    const uuid = UniqueID();

    const onInput = (event) => emit("update:modelValue", event.target.value);
    return {
      uuid,
      onInput,
    };
  },
};
</script>
