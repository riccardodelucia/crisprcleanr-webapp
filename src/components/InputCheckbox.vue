<template>
  <ht-checkbox
    :label="label"
    :name="name"
    :value="value"
    :model-value="checked ? value : null"
    :error-message="errorMessage"
    @update:model-value="onChange"
  ></ht-checkbox>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import { useField } from 'vee-validate';

export default {
  name: 'InputCheckbox',
  props: {
    label: { type: String, default: null },
    name: {
      type: String,
      default: null,
    },
    value: { type: null, required: true },
  },
  setup(props) {
    const uuid = uuidv4();
    const { checked, handleChange, errorMessage } = useField(
      () => props.name,
      undefined,
      {
        type: 'checkbox',
        checkedValue: props.value,
      }
    );

    const onChange = (value) => {
      handleChange(value);
    };

    return {
      checked, // readonly
      handleChange,
      uuid,
      errorMessage,
      onChange,
    };
  },
};
</script>

<style lang="postcss" scoped>
label,
input {
  vertical-align: middle;
}
label {
  margin-left: var(--size-1);
  cursor: pointer;
}
input:not(:first-child) {
  margin-left: var(--size-4);
}
</style>
