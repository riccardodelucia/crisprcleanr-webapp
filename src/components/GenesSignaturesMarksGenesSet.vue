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
      :data-gene="gene.gene"
      @mouseover="onMouseOver($event, gene)"
      @mouseleave="onMouseLeave(gene)"
    ></line>
  </g>
</template>

<script>
import { useTooltip } from '@nf-data-iu3/ht-vue';

export default {
  name: 'GenesSignaturesMarksGenesSet',
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
    thr: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const { showTooltip, hideTooltip } = useTooltip();

    const onMouseOver = (event, gene) => {
      showTooltip(event, gene.gene);

      const sel = document.querySelector(`circle[data-gene='${gene.gene}']`);
      sel && sel.classList.add('selected');
    };

    const onMouseLeave = (gene) => {
      hideTooltip();

      const sel = document.querySelector(`circle[data-gene='${gene.gene}']`);
      sel && sel.classList.remove('selected');
    };
    return { onMouseOver, onMouseLeave };
  },
};
</script>

<style lang="postcss" scoped>
.marks {
  line {
    stroke-width: 2;
    opacity: 0.2;

    &:hover,
    &.selected {
      stroke: red;
      stroke-width: 4;
      opacity: 1;
    }
  }
}
</style>
