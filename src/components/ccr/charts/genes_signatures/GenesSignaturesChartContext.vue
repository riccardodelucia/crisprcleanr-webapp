<template>
  <g class="brush-area" :transform="`translate(${margin.left}, ${margin.top})`">
    <BrushArea
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
        :xScale="xScale"
        :yScale="yScale"
        :pointRadius="2"
      ></MarksCurve>
    </BrushArea>

    <g :transform="`translate(${innerWidth}, 0)`">
      <D3Axis :scale="yScale" position="right"></D3Axis>
    </g>
  </g>
</template>

<script>
import BrushArea from "@/components/ccr/charts/BrushArea.vue";
import D3Axis from "@/components/ccr/charts/D3Axis.vue";
import { getInnerChartSizes } from "@/composables/chart.js";
import { scaleLog, extent, scaleLinear } from "d3";
import MarksCurve from "@/components/ccr/charts/genes_signatures/MarksCurve.vue";

export default {
  name: "GenesSignaturesChartContext",
  components: { BrushArea, D3Axis, MarksCurve },
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
