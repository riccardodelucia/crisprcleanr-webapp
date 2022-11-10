<template>
  <div class="accordion">
    <input
      :id="uuid"
      class="accordion__checkbox"
      type="checkbox"
      @change="isOpen = !isOpen"
    />
    <label :for="uuid" class="accordion__label">
      <vue-feather v-if="isOpen" type="plus-circle"></vue-feather>
      <vue-feather v-else type="minus-circle"></vue-feather>
      <slot name="title">Title</slot>
    </label>
    <div class="accordion__collapsible-content">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
import UniqueID from '@/composables/uuid.js';
import { ref } from 'vue';

export default {
  name: 'BaseAccordion',
  props: {
    height: {
      type: String,
      default: 'min-content',
    },
  },
  setup() {
    const uuid = UniqueID();
    const isOpen = ref(true);

    return { uuid, isOpen };
  },
};
</script>

<style lang="scss">
.accordion {
  &__checkbox {
    display: none;
  }

  &__label {
    user-select: none;
    display: flex;
    align-items: center;
    gap: 0.5em;
    cursor: pointer;
    font-weight: bold;
  }

  &__collapsible-content {
    max-height: 0px;
    overflow: hidden;
    margin-top: 3rem;
    transition: max-height 0.25s ease-in-out;
  }
}

.accordion__checkbox:checked
  + .accordion__label
  + .accordion__collapsible-content {
  overflow-y: scroll;
  max-height: v-bind(height);
}
</style>
