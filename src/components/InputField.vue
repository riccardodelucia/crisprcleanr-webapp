<template>
  <ht-input
    v-model="value"
    v-bind="$attrs"
    :label="label"
    :error-message="errorMessage"
  ></ht-input>
</template>

<script setup>
import { useField } from 'vee-validate';

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, default: null },
});

// The `name` is returned in a function because we want to make sure it stays reactive
// If the name changes you want `useField` to be able to pick it up
const { value, errorMessage } = useField(() => props.name);
</script>
