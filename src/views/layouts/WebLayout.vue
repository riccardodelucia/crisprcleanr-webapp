<template>
  <div class="layout layout--web">
    <div class="header-container">
      <TheHeader></TheHeader>
    </div>
    <div class="content">
      <router-view />
    </div>
    <div class="footer-container">
      <BaseFooter></BaseFooter>
    </div>
  </div>
</template>

<script>
import TheHeader from "@/components/ccr/TheHeader";


export default {
  name: "WebLayout",
  components: { TheHeader }
};
</script>


