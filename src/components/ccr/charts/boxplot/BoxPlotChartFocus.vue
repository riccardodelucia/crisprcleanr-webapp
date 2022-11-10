<template>
  <g :transform="`translate(${margin.left}, ${margin.top})`">
    <defs>
      <clipPath id="clip-boxplots">
        <rect :width="innerWidth" :height="innerHeight" />
      </clipPath>
    </defs>
    <g :transform="`translate(0, ${innerHeight})`">
      <D3Axis :scale="xScale" position="bottom" />
    </g>
    <D3Axis :scale="yScale" position="left" />

    <g
      v-for="(box, index) in filteredData"
      :key="index"
      :transform="`translate(${xScale(box.label)},0)`"
    >
      <Marks
        v-bind="$attrs"
        :x-scale="xScale"
        :y-scale="yScale"
        :data="box"
        clip-path="url(#clip-boxplots)"
      ></Marks>
    </g>
  </g>
</template>

<script>
import { scaleBand, scaleLinear } from 'd3';
import D3Axis from '@/components/ccr/charts/D3Axis.vue';

import Marks from '@/components/ccr/charts/boxplot/Marks.vue';

import { getInnerChartSizes } from '@/composables/chart.js';

import { computed } from 'vue';

export default {
  name: 'BoxPlotChartFocus',
  components: { Marks, D3Axis },
  props: {
    data: {
      type: Array,
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
    /* yDomain is used to filter data inside this component */
    yDomain: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const margin = {
      top: 20,
      right: 10,
      bottom: 30,
      left: 50,
    };
    const { innerWidth, innerHeight } = getInnerChartSizes(
      props.width,
      props.height,
      margin
    );
    const xScale = scaleBand()
      .domain(props.data.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.5);

    const yScale = computed(() => {
      return scaleLinear().domain(props.yDomain).range([0, innerHeight]);
    });
    const filteredData = computed(() => {
      return props.data.map((boxplot) => ({
        ...boxplot,
        outliers: boxplot.outliers.filter(
          (outlier) =>
            outlier.value > Math.min(...props.yDomain) &&
            outlier.value < Math.max(...props.yDomain)
        ),
      }));
    });

    return {
      margin,
      innerWidth,
      innerHeight,
      xScale,
      yScale,
      filteredData,
    };
  },
};
</script>

<style></style>
