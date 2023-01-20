<template>
  <g class="marks">
    <circle
      v-for="(gene, idx) in data.genes"
      :key="idx"
      :class="{
        selected: gene.gene === modelValue,
      }"
      :cx="xScale(gene.x)"
      :cy="yScale(gene.y)"
      :r="pointRadius"
      stroke="black"
      :data-tippy-content="gene.gene"
      @mouseover="onMouseOver($event, gene)"
      @mouseleave="onMouseLeave(gene)"
    ></circle
  ></g>
</template>

<script>
import { setupMarksChart } from './genes-signatures-chart.js';

export default {
  name: 'MarksCurve',
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    pointRadius: {
      type: Number,
      default: 4,
    },
    xScale: {
      type: Function,
      default: () => {},
    },
    yScale: {
      type: Function,
      default: () => {},
    },
    width: {
      type: Number,
      default: 0,
    },
    modelValue: { type: String, default: '' },
  },
  setup(props, context) {
    const { onMouseOver, onMouseLeave } = setupMarksChart(context);
    return { onMouseOver, onMouseLeave };
  },
};
</script>

<style lang="scss" scoped>
.marks {
  circle {
    fill: black;

    &.selected {
      fill: red;
      stroke: red;
      stroke-width: 8;
    }
  }
}
</style>
