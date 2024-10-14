<template>
  <g :transform="`translate(${margin.left}, ${margin.top})`">
    <defs>
      <clipPath id="clip-genes">
        <rect :width="innerWidth" :height="innerHeight" />
      </clipPath>
    </defs>
    <text
      :transform="`translate(${-yAxisLabelOffset}, ${
        innerHeight / 2
      }) rotate(-90)`"
      class="axis-label"
    >
      Depletion Rank
    </text>
    <g ref="yAxis"></g>

    <g :transform="`translate(0, ${innerHeight})`">
      <g ref="xAxis"></g>
      <text
        :transform="`translate(${curveWidth / 2}, ${xAxisLabelOffset})`"
        class="axis-label"
      >
        Log FC
      </text>
    </g>
    <line
      :x1="xScale(0)"
      :y1="0"
      :x2="xScale(0)"
      :y2="innerHeight"
      stroke="black"
      stroke-dasharray="4 2"
      stroke-opacity="0.2"
    />
    <line
      :x1="0"
      :y1="yScale(data.threshold)"
      :x2="innerWidth"
      :y2="yScale(data.threshold)"
      stroke="red"
      stroke-dasharray="4 2"
      clip-path="url(#clip-genes)"
    />
    <text
      x="5"
      :y="yScale(data.threshold) - 10"
      fill="red"
      clip-path="url(#clip-genes)"
    >
      {{ data.thresholdLabel }}
    </text>

    <GenesSignaturesMarksCurve
      :data="filteredData"
      :width="innerWidth"
      :x-scale="xScale"
      :y-scale="yScale"
    ></GenesSignaturesMarksCurve>
    <g :transform="`translate(${curveWidth + paddingX}, 0)`">
      <GenesSignaturesMarksGenesSet
        :gene-set="filteredData.genesSet"
        :width="geneSetWidth"
        :y-scale="yScale"
        :thr="data.threshold"
      ></GenesSignaturesMarksGenesSet>
      <text
        :transform="`translate(0, ${innerHeight + xAxisLabelOffset})`"
        class="genes-set__label"
      >
        Recall: {{ selectedGenesSetRecall }}
      </text>
    </g>
  </g>
</template>

<script>
import {
  extent,
  scaleLinear,
  scaleLog,
  select,
  axisLeft,
  axisBottom,
} from 'd3';
import { ref, computed, watchEffect } from 'vue';

import { getInnerChartSizes } from '../utils.js';
import GenesSignaturesMarksCurve from '@/components/GenesSignaturesMarksCurve.vue';
import GenesSignaturesMarksGenesSet from '@/components/GenesSignaturesMarksGenesSet.vue';

export default {
  name: 'GenesSignaturesChartFocus',
  components: { GenesSignaturesMarksCurve, GenesSignaturesMarksGenesSet },
  props: {
    data: {
      type: Object,
      required: true,
    },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    yDomain: {
      type: Array,
      default: () => [],
    },
    genesSet: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const yAxis = ref(null);
    const xAxis = ref(null);

    const margin = {
      top: 20,
      right: 20,
      bottom: 40,
      left: 60,
    };

    const { innerWidth, innerHeight } = getInnerChartSizes(
      props.width,
      props.height,
      margin
    );

    const xDomain = extent(props.data.genes.map((item) => item.x));

    const curveWidth = innerWidth * 0.7;
    const paddingX = 20;
    const geneSetWidth = innerWidth - curveWidth - paddingX;

    const xScale = scaleLinear().domain(xDomain).range([0, curveWidth]);

    watchEffect(
      () => {
        select(xAxis.value).call(axisBottom(xScale));
      },
      { flush: 'post' }
    );

    const yScale = computed(() =>
      scaleLog().domain(props.yDomain).range([0, innerHeight])
    );

    watchEffect(
      () => {
        select(yAxis.value).call(axisLeft(yScale.value));
      },
      { flush: 'post' }
    );

    const selectedGenesSetRecall = computed(() => {
      const recall = props.data.genesSets[props.genesSet].score * 100;
      return `${recall.toFixed(2)}%`;
    });

    const filteredData = computed(() => {
      const genes = props.data.genes.filter(
        (gene) =>
          gene.y >= Math.min(...props.yDomain) &&
          gene.y <= Math.max(...props.yDomain)
      );
      const genesSet = props.data.genesSets[props.genesSet].set.filter(
        (gene) =>
          gene.rank >= Math.min(...props.yDomain) &&
          gene.rank <= Math.max(...props.yDomain)
      );

      return { genes, genesSet };
    });

    return {
      margin,
      xAxis,
      xScale,
      xAxisLabelOffset: 35,
      yAxis,
      yScale,
      yAxisLabelOffset: 40,
      innerWidth,
      innerHeight,
      curveWidth,
      geneSetWidth,
      paddingX,
      filteredData,
      selectedGenesSetRecall,
    };
  },
};
</script>

<style lang="postcss" scoped>
.axis-label {
  text-anchor: middle;
  font-family: sans-serif;
  font-size: 15px;
  fill: black;
}
.genes-set__label {
  font-family: sans-serif;
  font-size: 15px;
  fill: blue;
}
</style>
