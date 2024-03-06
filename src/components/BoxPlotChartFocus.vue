<template>
  <g :transform="`translate(${margin.left}, ${margin.top})`">
    <defs>
      <clipPath id="clip-boxplots">
        <rect :width="innerWidth" :height="innerHeight" />
      </clipPath>
    </defs>
    <g :transform="`translate(0, ${innerHeight})`">
      <g ref="xAxis"></g>
    </g>
    <g ref="yAxis"></g>
    <g
      v-for="(box, index) in filteredData"
      :key="index"
      :transform="`translate(${xScale(box.label)},0)`"
    >
      <BoxPlotMarks
        v-bind="$attrs"
        :x-scale="xScale"
        :y-scale="yScale"
        :data="box"
        clip-path="url(#clip-boxplots)"
      >
      </BoxPlotMarks>
    </g>
  </g>
</template>

<script>
import { scaleBand, scaleLinear, select, axisBottom, axisLeft } from 'd3';

import BoxPlotMarks from '@/components/BoxPlotMarks.vue';

import { getInnerChartSizes } from '../utils.js';

import { computed, ref, watchEffect } from 'vue';

export default {
  name: 'BoxPlotChartFocus',
  components: { BoxPlotMarks },
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
    const xAxis = ref(null);
    const yAxis = ref(null);

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

    watchEffect(
      () => {
        select(xAxis.value).call(axisBottom(xScale));
        select(xAxis.value).select('.domain').remove();
        select(xAxis.value).selectAll('.tick line').remove();
      },
      {
        flush: 'post',
      }
    );

    const yScale = computed(() => {
      return scaleLinear().domain(props.yDomain).range([0, innerHeight]);
    });

    watchEffect(
      () => {
        select(yAxis.value).call(axisLeft(yScale.value));
      },
      {
        flush: 'post',
      }
    );

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
      xAxis,
      yScale,
      yAxis,
      filteredData,
    };
  },
};
</script>

<style></style>
