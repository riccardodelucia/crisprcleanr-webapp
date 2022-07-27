<template>
  <div class="input-field">
    <label class="input-field__label" v-if="label">{{ label }}</label>

    <div class="input-field__element">
      <div ref="select" class="select" :class="{ 'select--error': error }" :tabindex="tabindex" @blur="open = false"
        @focus="open = true">
        <div class="select__selection" :class="{
          'select__selection--empty': modelValue === null,
        }">
          {{ selection }}
        </div>
        <div class="select__overlay" v-if="open" @click.stop="closeSelector"></div>
        <div class="select__options" v-show="open">
          <div class="select__option" v-for="(option, index) of options" :key="index"
            @click.stop="clickedOption(option)">
            {{ option }}
          </div>
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
    error: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "Select an option",
    },
    modelValue: {
      default: "",
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

    // Initialize selected value, if default props provided
    //props.options.find(item => item === props.initialValue) && emit('update:modelValue', props.initialValue);

    const closeSelector = () => {
      open.value = false;
      select.value.blur();
    }

    const clickedOption = (option) => {
      emit('update:modelValue', option);
      closeSelector();
    };

    const showLabel = (option) => {
      return typeof option === "object" ? (option?.label ? label : JSON.stringify(option)) : option
    }

    const selection = computed(() => {
      return showLabel(props.modelValue)
    })

    return {
      open,
      selection,
      select,
      closeSelector,
      clickedOption,
      showLabel
    }
  },

  /* setup(props, { emit }) {
    const open = ref(false);
    const select = ref(null);

    const selection = ref("selection")

    const closeSelector = () => console.log("Close!")

    const clickedOption = (option) => console.log("clicked!")

    // Initialize selected value, if initialValue props is provided
    props.options.find(item => item === props.initialValue) && emit('update:modelValue', props.initialValue);

    const clickedOption = (option) => {
      debugger;
      emit('update:modelValue', option);
      closeSelector();
    };

    const showLabel = (option) => {
      return "label"
      //return typeof option === "object" ? (option?.label ? label : JSON.stringify(option)) : option
    }

    const selection = computed(() => {
      return showLabel(props.modelValue)
    })

    return {
      open,
      selection,
      select,
      closeSelector,
      clickedOption,
      showLabel
    }
  }, */
};
</script>
