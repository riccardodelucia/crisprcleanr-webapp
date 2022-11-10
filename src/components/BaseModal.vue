<template>
  <transition name="fade">
    <div class="modal" @click.self="$emit('modal-close')">
      <div class="modal__dialog">
        <div class="modal__header">
          <slot name="header" />
          <a class="modal__close" @click="$emit('modal-close')"></a>
        </div>
        <div class="modal__body">
          <slot name="body" />
        </div>
        <div class="modal__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BaseModal',
  props: { width: { type: String, default: '100rem' } },
  emits: { 'modal-close': null },
  mounted() {
    const body = document.querySelector('body');
    body.style.overflow = 'hidden';
  },
  unmounted() {
    const body = document.querySelector('body');
    body.style.overflow = 'auto';
  },
};
</script>

<style lang="scss" scoped>
.modal {
  overflow-y: auto;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9;
  background-color: rgba(0, 0, 0, 0.8);

  display: flex;
  justify-content: center;
  padding: 2em 1em;

  &__dialog {
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: v-bind(width);

    //flex: 1 1 120rem;
    margin-left: auto;
    margin-right: auto;
    //margin-top: 2em;
    //max-width: 120rem;
    background-color: #ffffff;
    position: relative;
    height: fit-content;
    border-radius: 5px;
    z-index: 2;
  }
  &__close {
    position: absolute;
    right: 1em;
    top: 1em;
    width: 3rem;
    height: 3rem;
    opacity: 0.3;

    &:hover {
      opacity: 1;
    }
    &:before,
    &:after {
      position: absolute;
      content: ' ';
      height: 33px;
      width: 2px;
      background-color: #333;
    }
    &:before {
      transform: rotate(45deg);
    }
    &:after {
      transform: rotate(-45deg);
    }
  }

  &__header,
  &__footer,
  &__body {
    padding: 1em 2em;
    text-align: center;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
