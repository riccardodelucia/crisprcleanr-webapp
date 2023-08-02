<template>
  <g class="marks">
    <line
      v-for="(gene, idx) in geneSet"
      :key="idx"
      v-tippy="{
        content: gene.gene,
        duration: 0,
      }"
      :x1="0"
      :x2="width"
      :y1="yScale(gene.rank)"
      :y2="yScale(gene.rank)"
      :stroke="gene.rank <= thr ? 'blue' : 'grey'"
      :data-gene="gene.gene"
      @mouseover="onMouseOver(gene)"
      @mouseleave="onMouseLeave(gene)"
    ></line
  ></g>
</template>

<script>
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
    thr: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const onMouseOver = (gene) => {
      const sel = document.querySelector(`circle[data-gene='${gene.gene}']`);
      sel && sel.classList.add('selected');
    };

    const onMouseLeave = (gene) => {
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
