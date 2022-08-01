<template>

  <div class="input-field">
    <label class="input-field__label" v-if="label">{{ label }}</label>
    <div class="file">
      <label class="button button--primary button--small">Choose a File
        <input type="file" @change.stop="updateFile" style="display: none;" />
      </label>
      <span class="file__name">{{ fileName }}</span>
    </div>
    <div class="input-field__error" v-if="error">
      <BaseIcon name="alert-circle" width="16px" height="16px"></BaseIcon><small>{{ error
      }}</small>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  name: "BaseInputFile",
  props: {
    label: { type: String, default: "" },
    modelValue: {
      type: File,
      default: null,
    },
    error: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const updateFile = (event) => {
      emit("update:modelValue", event.target.files[0]);
    };

    const fileName = computed(() => {
      return props.modelValue?.name || "";
    });
    return { updateFile, fileName };
  },
};
</script>

<style lang="scss">
</style>
