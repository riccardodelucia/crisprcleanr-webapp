<template>
  <TheHeader :is-web="true"></TheHeader>
  <div>
    <slot></slot>
  </div>
  <ht-footer></ht-footer>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue';
export default {
  name: 'WebLayout',
  components: { TheHeader },
};
</script>
