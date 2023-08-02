<template>
  <g class="marks">
    <circle
      v-for="(gene, idx) in data.genes"
      :key="idx"
      v-tippy="{
        content: gene.gene,
        duration: 0,
      }"
      :cx="xScale(gene.x)"
      :cy="yScale(gene.y)"
      :r="pointRadius"
      stroke="black"
      :data-gene="gene.gene"
      @mouseover="onMouseOver(gene)"
      @mouseleave="onMouseLeave(gene)"
    ></circle
  ></g>
</template>

<script>
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
  },
  setup() {
    const onMouseOver = (gene) => {
      const sel = document.querySelector(`line[data-gene='${gene.gene}']`);
      sel && sel.classList.add('selected');
    };

    const onMouseLeave = (gene) => {
      const sel = document.querySelector(`line[data-gene='${gene.gene}']`);
      sel && sel.classList.remove('selected');
    };
    return { onMouseOver, onMouseLeave };
  },
};
</script>

<style lang="postcss" scoped>
/* .marks {
  circle {
    fill: black;

    &:hover,
    &.selected {
      fill: red;
      stroke: red;
      stroke-width: 8;
    }
  }
} */
</style>
