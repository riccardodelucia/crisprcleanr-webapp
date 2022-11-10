<template>
  <div class="input-field">
    <label v-if="label" class="input-field__label">{{ label }}</label>
    <div
      ref="select"
      class="select"
      :class="{ 'select--error': error }"
      :tabindex="tabindex"
      @blur="open = false"
      @focus="open = true"
    >
      <div
        class="select__selection"
        :class="{
          'select__selection--empty': selection === placeholder,
        }"
      >
        {{ selection }}
      </div>
      <div
        v-if="open"
        class="select__overlay"
        @click.stop="closeSelector"
      ></div>
      <div v-show="open" class="select__options">
        <div
          v-for="(option, index) of options"
          :key="index"
          class="select__option"
          @click.stop="clickedOption(option)"
        >
          {{ showLabel(option) }}
        </div>
      </div>
    </div>
    <div v-if="error" class="input-field__error">
      <vue-feather type="alert-circle" size="16px"></vue-feather
      ><small>{{ error }}</small>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';

export default {
  props: {
    label: { type: String, default: '' },
    options: {
      type: Array,
      default: () => [],
    },
    optionLabel: {
      type: String,
      default: 'label',
    },
    error: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Select an option',
    },
    modelValue: {
      type: [Object, null],
      required: true,
      default: undefined,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const open = ref(false);
    const select = ref(null);

    const closeSelector = () => {
      open.value = false;
      select.value.blur();
    };

    const clickedOption = (option) => {
      emit('update:modelValue', option);
      closeSelector();
    };

    const showLabel = (option) => {
      if (typeof option === 'object') {
        return option?.[props.optionLabel] || option;
      }
      return option;
    };

    const selection = computed(() => {
      if (props.options.find((elem) => elem === props.modelValue))
        return showLabel(props.modelValue);
      return props.placeholder;
    });

    return {
      open,
      selection,
      select,
      closeSelector,
      clickedOption,
      showLabel,
    };
  },
};
</script>
