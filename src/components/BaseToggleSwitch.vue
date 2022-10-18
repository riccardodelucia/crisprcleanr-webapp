<template>
  <div class="input-field">
    <label class="input-field__label" v-if="label">{{ label }}</label>
    <label class="toggle">
      <div
        class="toggle__input"
        :class="{ 'toggle__input--selected': modelValue }"
      ></div>
      <input hidden type="checkbox" @click="onClick" />
      {{ option }}
    </label>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    option: {
      type: String,
      default: "",
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    onClick() {
      this.$emit("update:modelValue", !this.modelValue);
    },
  },
};
</script>

<style lang="scss">
.toggle {
  display: flex;
  gap: 0.5em;
  cursor: pointer;
  user-select: none;

  &__input {
    width: 5rem;
    height: 3rem;
    background-color: white;
    border: 2px solid var(--color-blue-lighter);
    border-radius: 3.4rem;
    position: relative;

    &:after {
      content: "";
      position: absolute;
      left: 0.5rem;
      top: 0.4rem;
      width: 1.8rem;
      height: 1.8rem;
      border-radius: 50%;
      background-color: var(--color-blue-lighter);
      transition: transform 0.2s ease;
    }

    &--selected {
      &:after {
        transform: translate(1.9rem);
      }
    }
  }
}
</style>
