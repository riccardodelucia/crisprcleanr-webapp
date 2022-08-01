<template>
  <div class="input-field">
    <label class="input-field__label" v-if="label">{{ label }}</label>
    <div ref="select" class="select" :class="{ 'select--error': error }" :tabindex="tabindex" @blur="open = false"
      @focus="open = true">
      <div class="select__selection" :class="{
        'select__selection--empty': !touched,
      }">
        {{ selection }}
      </div>
      <div class="select__overlay" v-if="open" @click.stop="closeSelector"></div>
      <div class="select__options" v-show="open">
        <div class="select__option" v-for="(option, index) of options" :key="index" @click.stop="clickedOption(option)">
          {{ showLabel(option) }}
        </div>
      </div>
    </div>
    <div class="input-field__error" v-if="error">
      <BaseIcon name="alert-circle" width="16px" height="16px"></BaseIcon><small>{{ error
      }}</small>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';

export default {
  props: {
    label: { type: String, default: "" },
    options: {
      type: Array,
      default: []
    },
    optionsLabels: {
      type: Object,
      default: null,
    },
    error: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "Select an option",
    },
    modelValue: {
      default: undefined,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const open = ref(false);
    const select = ref(null);

    const getKeyByValue = (object, value) => {
      return Object.keys(object).find(key => object[key] === value);
    }

    const closeSelector = () => {
      open.value = false;
      select.value.blur();
    }

    const clickedOption = (option) => {
      touched.value = true;
      emit('update:modelValue', option);
      closeSelector();
    };

    const showLabel = (option) => {
      if (props.optionsLabels) {
        const label = getKeyByValue(props.optionsLabels, option)
        if (label) return label
      }
      return option
    }

    const selection = computed(() => {
      if (!touched.value) return "Select an Option"
      return showLabel(props.modelValue)
    })

    const touched = ref(false)

    if (props.modelValue) touched.value = true;

    return {
      open,
      selection,
      select,
      closeSelector,
      clickedOption,
      showLabel,
      touched
    }
  },
};
</script>
