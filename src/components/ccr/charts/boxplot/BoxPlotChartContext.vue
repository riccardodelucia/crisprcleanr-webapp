<template>
  <g class="brush-area" :transform="`translate(${margin.left}, ${margin.top})`"
    ><BrushArea
      :width="innerWidth"
      :height="innerHeight"
      v-bind="$attrs"
      :domain="yDomain"
      :scale="yScale"
    >
      <rect x="0" y="0" :width="innerWidth" :height="innerHeight" />
      <text
        :transform="`translate(${innerWidth / 2}, ${
          innerHeight / 2
        }) rotate(90 0 0)`"
      >
        Drag to zoom
      </text>
    </BrushArea>
    <g :transform="`translate(${innerWidth}, 0)`">
      <D3Axis :scale="yScale" position="right"></D3Axis>
    </g>
  </g>
</template>

<script>
import BrushArea from '@/components/ccr/charts/BrushArea.vue';
import { getInnerChartSizes } from '@/composables/chart.js';
import D3Axis from '@/components/ccr/charts/D3Axis.vue';
import { computed } from 'vue';
import { scaleLinear } from 'd3';

export default {
  name: 'BoxPlotChartContext',
  components: { BrushArea, D3Axis },
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    yDomain: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 0,
    };

    const { innerWidth, innerHeight } = getInnerChartSizes(
      props.width,
      props.height,
      margin
    );

    const yScale = computed(() => {
      return scaleLinear().domain(props.yDomain).range([0, innerHeight]);
    });

    return { margin, innerWidth, innerHeight, yScale };
  },
};
</script>

<style lang="scss" scoped>
.brush-area rect {
  fill: #f5f5f5;
  stroke: #b1b1b1;
  stroke-width: 2px;
  stroke-dasharray: 4 2;
}
.brush-area text {
  text-anchor: middle;
  fill: #b1b1b1;
}
.brush-area__group text {
  fill: #b1b1b1;
}
</style>
