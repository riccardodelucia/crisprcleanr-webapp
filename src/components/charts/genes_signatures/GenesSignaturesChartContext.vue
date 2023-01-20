<template>
  <g class="brush-area" :transform="`translate(${margin.left}, ${margin.top})`">
    <ht-brush-area
      :width="innerWidth"
      :height="innerHeight"
      v-bind="$attrs"
      :domain="yDomain"
      :scale="yScale"
    >
      <rect x="0" y="0" :width="innerWidth" :height="innerHeight" />
      <line
        :x1="0"
        :y1="yScale(data.threshold)"
        :x2="innerWidth"
        :y2="yScale(data.threshold)"
        stroke="red"
        stroke-dasharray="4 2"
        clip-path="url(#clip-genes)"
      />
      <MarksCurve
        :width="innerWidth"
        :data="data"
        :x-scale="xScale"
        :y-scale="yScale"
        :point-radius="2"
      ></MarksCurve>
    </ht-brush-area>

    <g :transform="`translate(${innerWidth}, 0)`">
      <ht-chart-axis :scale="yScale" position="right"></ht-chart-axis>
    </g>
  </g>
</template>

<script>
import { getInnerChartSizes } from '@computational-biology-web-unit/ht-vue/utilities';
import { scaleLog, extent, scaleLinear } from 'd3';
import MarksCurve from '@/components/charts/genes_signatures/MarksCurve.vue';

export default {
  name: 'GenesSignaturesChartContext',
  components: { MarksCurve },
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    data: {
      type: Object,
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
      bottom: 40,
      left: 0,
    };

    const { innerWidth, innerHeight } = getInnerChartSizes(
      props.width,
      props.height,
      margin
    );

    const yScale = scaleLog().domain(props.yDomain).range([0, innerHeight]);

    const xDomain = extent(props.data.genes.map((item) => item.x));

    const xScale = scaleLinear().domain(xDomain).range([0, innerWidth]);

    return { margin, innerWidth, innerHeight, yScale, xScale };
  },
};
</script>

<style lang="scss" scoped>
.brush-area rect {
  fill: #fafafa;
  stroke: #ebebeb;
  stroke-width: 1px;
}

.brush-area text {
  text-anchor: middle;
  fill: #b1b1b1;
}

.brush-area__group text {
  fill: #b1b1b1;
}
</style>
