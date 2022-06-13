<template>
  <label class="input__label" v-if="label">{{ label }}</label>
  <div ref="select" class="select" :tabindex="tabindex" @blur="open = false" @focus="open = true">
    <div class="select__selection" :class="{
      'select__selection--open': open,
      'select__selection--empty': Object.keys(modelValue).length === 0,
    }">
      {{ selection }}
    </div>
    <div class="select__overlay" v-if="open" @click="closeSelector"></div>
    <div class="select__options" v-show="open">
      <div v-for="option of Object.entries(options)" :key="option[0]" @click="clickedOption(option[1])">
        {{ option[0] }}
      </div>
    </div>
  </div>
  <small class="input__error" v-if="error">{{ error }}</small>
</template>

<script>
import { computed, ref } from 'vue';

export default {
  props: {
    label: { type: String, default: "" },
    options: {
      type: Object,
      required: true,
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
    selected: {
      type: ["Object", "String", "Number"],
      required: false
    },
    default: {
      type: String,
      default: ""
    }
  },
  setup(props, { emit }) {
    const entries = Object.entries(props.options);
    const open = ref(false);
    const select = ref(null);

    // Check value type to decide whether to use Map (primitive) or WeakMap (references)
    const types = new Set();
    entries.forEach(([_, value]) => {
      types.add(typeof value);
    });
    if (types.size > 1) throw new TypeError("Selector value types must be consistent");

    const [type] = types;

    // WeakMaps only work with non primitive key values
    const map = ["boolean", "number", "bigint", "string", "undefined"].includes(type) ? new Map() : new WeakMap()

    entries.forEach(([key, value]) => {
      map.set(value, key);
    });

    // Initialize selected value, if default props provided
    props.options?.[props.default] && emit('update:modelValue', props.options?.[props.default]);

    const selection = computed(() => map.get(props.modelValue) || props.placeholder)

    const closeSelector = () => {
      open.value = false;
      select.value.blur();
    }

    const clickedOption = (optionValue) => {
      emit('update:modelValue', optionValue);
      closeSelector();
    };

    return {
      map,
      open,
      selection,
      select,
      closeSelector,
      clickedOption
    }
  },
};
</script>
