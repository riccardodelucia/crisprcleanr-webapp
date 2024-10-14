<template>
  <ht-select
    :model-value="value"
    :label="label"
    :options="options"
    :error-message="errorMessage"
    v-bind="$attrs"
    @update:model-value="onUpdate"
  ></ht-select>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import { useField } from 'vee-validate';

export default {
  name: 'InputSelect',
  props: {
    label: { type: String, default: '' },
    options: {
      type: Array,
      required: true,
    },
    name: { type: String, required: true },
  },
  setup(props) {
    const uuid = uuidv4();
    const { value, errorMessage, handleChange } = useField(() => props.name);

    const onUpdate = (value) => {
      handleChange(value.value);
    };

    return {
      uuid,
      onUpdate,
      value,
      errorMessage,
    };
  },
};
</script>
