<template>
  <ht-input-file
    :files="files"
    :error-message="errorMessage"
    :filenames="value"
    :label="label"
    v-bind="$attrs"
    @update:files="onUpdateFiles"
    @update:filenames="onUpdateFilenames"
  >
  </ht-input-file>
</template>

<script>
import { useField } from 'vee-validate';

export default {
  name: 'InputFile',
  props: {
    label: {
      type: String,
      default: '',
    },
    files: {
      type: [File, Array],
      default: undefined,
    },
    filenames: {
      type: [String, Array],
      default: undefined,
    },
    name: { type: String, required: true },
  },
  emits: { 'update:files': null, 'update:filenames': null },
  setup(props, { emit }) {
    const { value, errorMessage, handleChange } = useField(() => props.name);

    const onUpdateFilenames = (value) => {
      handleChange(value);
    };

    const onUpdateFiles = (value) => {
      emit('update:files', value);
    };

    return { value, errorMessage, onUpdateFilenames, onUpdateFiles };
  },
};
</script>
