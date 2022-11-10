<template>
  <div class="tooltip" :style="tooltipPos">
    <p v-for="[key, value] in Object.entries(data)" :key="key">
      <strong>{{ key }}:</strong>
      {{ value }}
    </p>
  </div>
</template>

<script>
const MOUSE_POS_OFFSET = 8;
export default {
  name: 'ChartsTooltip',
  props: {
    tooltipCoords: {
      type: Array,
      default: () => [0, 0],
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    tooltipPos() {
      return {
        left: `${this.tooltipCoords[0] + MOUSE_POS_OFFSET}px`,
        top: `${this.tooltipCoords[1] + MOUSE_POS_OFFSET}px`,
      };
    },
  },
};
</script>

<style scoped>
.tooltip {
  box-sizing: border-box;
  position: fixed;
  padding: 8px 12px;
  font-family: sans-serif;
  font-size: 12px;
  color: rgb(37, 37, 37);
  background-color: #fff;
  border: 1px solid #333;
  border-radius: 4px;
  pointer-events: none;
  z-index: 10000;
}
.tooltip p {
  margin: 0;
}
</style>
