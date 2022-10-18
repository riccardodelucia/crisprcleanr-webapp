<template>
  <div class="input-field">
    <label class="input-field__label" v-if="label">{{ label }}</label>
    <div class="file">
      <label class="button button--primary button--small"
        >Choose Files
        <input
          type="file"
          multiple
          @change.stop="updateFile"
          style="display: none"
        />
      </label>
    </div>
    <div class="file__list" v-if="modelValue && modelValue.length > 0">
      <div class="file__name" v-for="(file, i) in modelValue" :key="i">
        <BaseIcon
          name="x-circle"
          width="16px"
          height="16px"
          class="file__remove"
          @click="removeFile(file)"
        >
        </BaseIcon>
        <span>{{ file.name }}</span>
      </div>
    </div>
    <div class="input-field__error" v-if="error">
      <BaseIcon name="alert-circle" width="16px" height="16px"></BaseIcon
      ><small>{{ error }}</small>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  name: "BaseInputFileMultiple",
  props: {
    label: { type: String, default: "" },
    modelValue: {
      type: Array,
      default: null,
    },
    error: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const updateFile = (event) => {
      emit("update:modelValue", [...event.target.files]);
    };

    const fileName = computed(() => {
      return props.modelValue?.name || "";
    });

    const removeFile = (selected) => {
      const files = [...props.modelValue].filter((file) => file !== selected);

      emit("update:modelValue", files.length > 0 ? files : undefined);
    };

    return { updateFile, fileName, removeFile };
  },
};
</script>

<style lang="scss"></style>
