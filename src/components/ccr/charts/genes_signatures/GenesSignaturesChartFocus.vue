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
    <D3Axis :scale="yScale" position="left" />
    <g :transform="`translate(0, ${innerHeight})`">
      <D3Axis :scale="xScale" position="bottom" />
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

    <MarksCurve
      v-model="selectedGene"
      :data="filteredData"
      :width="innerWidth"
      :x-scale="xScale"
      :y-scale="yScale"
    ></MarksCurve>
    <g :transform="`translate(${curveWidth + paddingX}, 0)`">
      <MarksGenesSet
        v-model="selectedGene"
        :gene-set="filteredData.genesSet"
        :width="geneSetWidth"
        :y-scale="yScale"
        :thr="data.threshold"
      ></MarksGenesSet>
      <text
        :transform="`translate(0, ${innerHeight + 28})`"
        class="genes-set__label"
      >
        Recall: {{ selectedGenesSetRecall }}
      </text>
    </g>
  </g>
</template>

<script>
import { extent, scaleLinear, scaleLog } from 'd3';
import { ref, computed } from 'vue';

import { getInnerChartSizes } from '@/composables/chart.js';
import D3Axis from '@/components/ccr/charts/D3Axis.vue';
import MarksCurve from '@/components/ccr/charts/genes_signatures/MarksCurve.vue';
import MarksGenesSet from '@/components/ccr/charts/genes_signatures/MarksGenesSet.vue';

export default {
  name: 'GenesSignaturesFocus',
  components: { D3Axis, MarksCurve, MarksGenesSet },
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

    const yScale = computed(() =>
      scaleLog().domain(props.yDomain).range([0, innerHeight])
    );

    const selectedGene = ref(null);

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
      xScale,
      xAxisLabelOffset: 30,
      yScale,
      yAxisLabelOffset: 35,
      innerWidth,
      innerHeight,
      curveWidth,
      geneSetWidth,
      paddingX,
      selectedGene,
      filteredData,
      selectedGenesSetRecall,
    };
  },
};
</script>

<style lang="scss" scoped>
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
