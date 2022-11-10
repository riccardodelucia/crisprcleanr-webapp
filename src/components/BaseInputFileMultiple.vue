<template>
  <div class="input-field">
    <label v-if="label" class="input-field__label">{{ label }}</label>
    <div class="file">
      <label class="button button--primary button--small"
        >Choose Files
        <input
          type="file"
          multiple
          style="display: none"
          @change.stop="updateFile"
        />
      </label>
    </div>
    <div v-if="modelValue && modelValue.length > 0" class="file__list">
      <div v-for="(file, i) in modelValue" :key="i" class="file__name">
        <div>
          <vue-feather
            type="x-circle"
            size="16px"
            class="file__remove"
            @click="removeFile(file)"
          >
          </vue-feather>
        </div>
        <span>{{ file.name }}</span>
      </div>
    </div>
    <div v-if="error" class="input-field__error">
      <vue-feather type="alert-circle" size="16px"></vue-feather
      ><small>{{ error }}</small>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'BaseInputFileMultiple',
  props: {
    label: { type: String, default: '' },
    modelValue: {
      type: Array,
      default: null,
    },
    error: {
      type: String,
      default: '',
    },
  },
  emits: { 'update:modelValue': null },
  setup(props, { emit }) {
    const updateFile = (event) => {
      emit('update:modelValue', [...event.target.files]);
    };

    const fileName = computed(() => {
      return props.modelValue?.name || '';
    });

    const removeFile = (selected) => {
      const files = [...props.modelValue].filter((file) => file !== selected);

      emit('update:modelValue', files.length > 0 ? files : undefined);
    };

    return { updateFile, fileName, removeFile };
  },
};
</script>

<style lang="scss"></style>
