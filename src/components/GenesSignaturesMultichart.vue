<template>
  <div class="chart-select">
    <ht-select
      v-model="genesSet"
      label="Reference Genes Set"
      :options="genesSetsOptions"
    >
    </ht-select>
  </div>

  <svg
    class="ht-chart"
    preserveAspectRatio="xMinYMin meet"
    :viewBox="[0, 0, width, height].join(' ')"
  >
    <GenesSignaturesChartFocus
      :data="chartData"
      :width="chartFocusWidth"
      :height="height"
      :y-domain="yDomainFocus"
      :genes-set="genesSet"
    ></GenesSignaturesChartFocus>
    <g :transform="`translate(${chartFocusWidth}, 0)`">
      <GenesSignaturesChartContext
        :data="chartData"
        :width="chartContextWidth"
        :height="height"
        :y-domain="yDomainContext"
        @brush="brushed"
      ></GenesSignaturesChartContext>
    </g>
  </svg>
</template>

<script>
import { extent } from 'd3';
import { ref, reactive } from 'vue';

import GenesSignaturesChartFocus from '@/components/GenesSignaturesChartFocus.vue';
import GenesSignaturesChartContext from '@/components/GenesSignaturesChartContext.vue';

const setupChart = (data) => {
  const genes = data.curve
    .map((item) => ({
      x: item.logFc,
      y: item.rank,
      gene: item.gene,
    }))
    .sort((a, b) => a.x - b.x);

  const xDomain = extent(genes.map((item) => item.x));
  const xInterval = xDomain[0] - xDomain[1];
  const xThreshold = data.metrics[0].threshold * xInterval;
  const { idx: thresholdCandidateIdx } = genes
    .map((item, idx) => ({
      dist: Math.abs(item.x - xThreshold),
      idx,
    }))
    .sort((a, b) => a.dist - b.dist)[0];

  const threshold = genes[thresholdCandidateIdx].y;

  const genesSets = Object.entries(data.geneSetArray).reduce(
    (acc, [key, value]) => {
      acc[key] = {
        set: value.genes,
        score: value.score[0],
      };
      return acc;
    },
    {}
  );

  return {
    genes,
    threshold,
    thresholdLabel: `FDR: ${data.metrics[0].threshold * 100}%`,
    genesSets,
  };
};

export default {
  name: 'GenesSignaturesMultichart',
  components: { GenesSignaturesChartFocus, GenesSignaturesChartContext },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const chartData = setupChart(props.data);

    const yDomainFocus = ref(extent(chartData.genes.map((item) => item.y)));

    const yDomainContext = yDomainFocus.value;

    const brushed = (extent) => {
      yDomainFocus.value = extent;
    };

    const genesSetsOptions = reactive([
      { label: 'Proteasome', value: 'proteasome' },
      { label: 'Spliceosome', value: 'spliceosome' },
      { label: 'Ribosomal Proteins', value: 'ribosomalProteins' },
      { label: 'DNA Replication', value: 'dnaReplication' },
      { label: 'RNA Polymerase', value: 'rnaPolymerase' },
      { label: 'BAGEL Essentials', value: 'bagelEssential' },
      { label: 'BAGEL Non Essential', value: 'bagelNonEssential' },
    ]);

    const genesSet = ref(genesSetsOptions[0].value);

    const chartFocusWidth = 450;
    const chartContextWidth = 70;
    const width = chartFocusWidth + chartContextWidth;

    return {
      width,
      height: 700,
      chartFocusWidth,
      chartContextWidth,
      chartData,
      yDomainFocus,
      yDomainContext,
      brushed,
      genesSet,
      genesSetsOptions,
    };
  },
};
</script>

<style lang="postcss" scoped>
.chart-select {
  margin-bottom: var(--size-3);
  display: grid;
  grid-row-gap: var(--size-2);

  :deep(label) {
    font-weight: var(--font-weight-6);
  }
}
</style>
