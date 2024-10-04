<template>
  <g class="brush-area" :transform="`translate(${margin.left}, ${margin.top})`"
    ><ht-brush-area
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
    </ht-brush-area>
    <g :transform="`translate(${innerWidth}, 0)`">
      <g ref="yAxis"></g>
    </g>
  </g>
</template>

<script>
import { getInnerChartSizes } from '../utils.js';
import { computed, ref, watchEffect } from 'vue';
import { scaleLinear, select, axisRight } from 'd3';

export default {
  name: 'BoxPlotChartContext',
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
    const yAxis = ref(null);
    const margin = {
      top: 20,
      right: 60,
      bottom: 30,
      left: 0,
    };

    const { innerWidth, innerHeight } = getInnerChartSizes(
      props.width,
      props.height,
      margin,
    );

    const yScale = computed(() => {
      return scaleLinear().domain(props.yDomain).range([0, innerHeight]);
    });

    watchEffect(
      () => {
        select(yAxis.value).call(axisRight(yScale.value));
      },
      {
        flush: 'post',
      },
    );

    return { margin, innerWidth, innerHeight, yScale, yAxis };
  },
};
</script>

<style lang="postcss" scoped>
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
