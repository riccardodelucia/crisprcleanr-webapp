<template>
  <g class="marks">
    <line
      v-for="(gene, idx) in geneSet"
      :key="idx"
      :x1="0"
      :x2="width"
      :y1="yScale(gene.rank)"
      :y2="yScale(gene.rank)"
      :stroke="gene.rank <= thr ? 'blue' : 'grey'"
      :class="{
        selected: gene.gene === modelValue,
      }"
      :data-tippy-content="gene.gene"
      @mouseover="onMouseOver($event, gene)"
      @mouseleave="onMouseLeave(gene)"
    ></line
  ></g>
</template>

<script>
import { setupMarksChart } from '@/composables/genes-signatures-chart.js';

export default {
  name: 'MarksGenesSet',
  props: {
    geneSet: { type: Array, default: () => [] },
    yScale: {
      type: Function,
      default: () => {},
    },
    width: {
      type: Number,
      default: 0,
    },
    modelValue: { type: String, default: '' },
    thr: {
      type: Number,
      default: 0,
    },
  },
  setup(props, context) {
    const { onMouseOver, onMouseLeave } = setupMarksChart(context);
    return { onMouseOver, onMouseLeave };
  },
};
</script>

<style lang="scss" scoped>
.marks {
  line {
    stroke-width: 2;
    opacity: 0.2;

    &.selected {
      stroke: red;
      stroke-width: 4;
      opacity: 1;
    }
  }
}
</style>
