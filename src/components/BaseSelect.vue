<template>
  <div class="input-field">
    <label class="input-field__label" v-if="label">{{ label }}</label>
    <div ref="select" class="select" :class="{ 'select--error': error }" :tabindex="tabindex" @blur="open = false"
      @focus="open = true">
      <div class="select__selection" :class="{
        'select__selection--empty': selection === placeholder,
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
    optionLabel: {
      type: String,
      default: "label"
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
      required: true,
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

    const closeSelector = () => {
      open.value = false;
      select.value.blur();
    }

    const clickedOption = (option) => {
      emit('update:modelValue', option);
      closeSelector();
    };

    const showLabel = (option) => {
      if (typeof option === "object") {
        return option?.[props.optionLabel] || option
      }
      return option
    }

    const selection = computed(() => {
      if (props.options.find(elem => elem === props.modelValue)) return showLabel(props.modelValue)
      return props.placeholder
    })

    return {
      open,
      selection,
      select,
      closeSelector,
      clickedOption,
      showLabel,
    }
  },
};
</script>
