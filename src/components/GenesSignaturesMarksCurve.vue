<template>
  <g class="marks">
    <circle
      v-for="(gene, idx) in data.genes"
      :key="idx"
      :cx="xScale(gene.x)"
      :cy="yScale(gene.y)"
      :r="pointRadius"
      stroke="black"
      :data-gene="gene.gene"
      @mouseover="onMouseOver($event, gene)"
      @mouseleave="onMouseLeave(gene)"
    >
    </circle>
  </g>
</template>

<script>
import { useTooltip } from '@computational-biology-sw-web-dev-unit/ht-vue';

export default {
  name: 'GenesSignaturesMarksCurve',
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
  },
  setup() {
    const { showTooltip, hideTooltip } = useTooltip();

    const onMouseOver = (event, gene) => {
      showTooltip(event, gene.gene);

      const sel = document.querySelector(`line[data-gene='${gene.gene}']`);
      sel && sel.classList.add('selected');
    };

    const onMouseLeave = (gene) => {
      hideTooltip();
      const sel = document.querySelector(`line[data-gene='${gene.gene}']`);
      sel && sel.classList.remove('selected');
    };
    return { onMouseOver, onMouseLeave };
  },
};
</script>

<style lang="postcss" scoped>
circle {
  fill: black;

  &:hover,
  &.selected {
    fill: red;
    stroke: red;
    stroke-width: 8;
  }
}
</style>
