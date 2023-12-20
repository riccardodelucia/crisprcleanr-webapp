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
      <GenesSignaturesMarksCurve
        :width="innerWidth"
        :data="data"
        :x-scale="xScale"
        :y-scale="yScale"
        :point-radius="2"
      ></GenesSignaturesMarksCurve>
    </ht-brush-area>

    <g :transform="`translate(${innerWidth}, 0)`">
      <g ref="yAxis"></g>
    </g>
  </g>
</template>

<script>
import {
  getInnerChartSizes,
  makeReactiveAxis,
} from '@computational-biology-sw-web-dev-unit/ht-vue';
import { select, scaleLog, extent, scaleLinear, axisRight } from 'd3';
import GenesSignaturesMarksCurve from '@/components/GenesSignaturesMarksCurve.vue';

import { ref } from 'vue';

export default {
  name: 'GenesSignaturesChartContext',
  components: { GenesSignaturesMarksCurve },
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
    const yAxis = ref(null);
    const margin = {
      top: 20,
      right: 35,
      bottom: 40,
      left: 0,
    };

    const { innerWidth, innerHeight } = getInnerChartSizes(
      props.width,
      props.height,
      margin
    );

    const yScale = scaleLog().domain(props.yDomain).range([0, innerHeight]);

    makeReactiveAxis(() => {
      select(yAxis.value).call(axisRight(yScale));
    });

    const xDomain = extent(props.data.genes.map((item) => item.x));

    const xScale = scaleLinear().domain(xDomain).range([0, innerWidth]);

    return { margin, innerWidth, innerHeight, yAxis, yScale, xScale };
  },
};
</script>

<style lang="postcss" scoped>
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
