<template>
  <g :transform="`translate(${margin.left}, ${margin.top})`">
    <g :transform="`translate(0, ${innerHeight})`">
      <g ref="xAxis"></g>
      <text
        :transform="`translate(${innerWidth / 2}, ${xAxisLabelOffset})`"
        class="axis-label"
      >
        {{ xLabel }}
      </text>
    </g>
    <ht-brush-area
      :width="innerWidth"
      :height="innerHeight"
      v-bind="$attrs"
      :domain="xDomain"
      :scale="xScale"
      brush-direction="horizontal"
    >
    </ht-brush-area>
    <ChromosomeMarks
      :points="data.sgRnaArray"
      :segments="data.segments"
      :x-scale="xScale"
      :y-scale="yScale"
      :point-radius="2"
    />
    <g ref="brush"></g>
  </g>
</template>

<script>
import { scaleLinear, extent, select, brushX, axisBottom } from 'd3';
import ChromosomeMarks from '@/components/ChromosomeMarks.vue';

import {
  getInnerChartSizes,
  makeReactiveAxis,
} from '@computational-biology-sw-web-dev-unit/ht-vue';

import { ref, onMounted } from 'vue';

export default {
  name: 'ChromosomeChartContext',
  components: { ChromosomeMarks },
  props: {
    data: {
      type: Object,
      required: true,
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    xDomain: {
      type: Array,
      default: () => [],
    },
  },
  emits: { brush: null },
  setup(props, { emit }) {
    const xAxis = ref(null);

    const margin = {
      top: 20,
      right: 50,
      bottom: 20,
      left: 50,
    };

    const { innerWidth, innerHeight } = getInnerChartSizes(
      props.width,
      props.height,
      margin
    );

    const yScale = scaleLinear()
      .domain(extent(props.data.sgRnaArray.map((d) => d.avgLogFc)))
      .range([innerHeight, 0]);

    const xScale = scaleLinear()
      .domain([0, props.data.sgRnaArray.length])
      .range([0, innerWidth]);

    makeReactiveAxis(() => {
      select(xAxis.value).call(axisBottom(xScale));
    });

    const updateScale = ({ selection }) => {
      const extent = selection ? selection.map(xScale.invert) : props.xDomain;
      emit('brush', extent);
    };

    const brush = ref(null);

    onMounted(() => {
      select(brush.value).call(
        brushX()
          .extent([
            [0, 0],
            [innerWidth, innerHeight],
          ])
          .on('brush end', updateScale)
      );
    });

    return {
      innerWidth,
      innerHeight,
      margin,
      xScale,
      xAxis,
      yScale,
      brush,
      xAxisLabelOffset: 40,
      xLabel: 'Genomic Positions',
    };
  },
};
</script>

<style lang="postcss" scoped>
.axis-label {
  text-anchor: middle;
  font-family: sans-serif;
  font-size: 15px;
  color: black;
}
</style>
