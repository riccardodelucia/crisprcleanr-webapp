<template>
  <BaseSelect label="Choose a Genes Set" :options="genesSetsOptions" v-model="genesSet">
  </BaseSelect>
  <svg preserveAspectRatio="xMinYMin meet" :viewBox="[0, 0, width, height].join(' ')">
    <GenesSignaturesChartFocus :data="chartData" :width="chartFocusWidth" :height="height" :yDomain="yDomainFocus"
      :genesSet="genesSet.genesSet"></GenesSignaturesChartFocus>
    <g :transform="`translate(${chartFocusWidth}, 0)`">
      <GenesSignaturesChartContext :data="chartData" :width="chartContextWidth" :height="height"
        :yDomain="yDomainContext" @brush="brushed"></GenesSignaturesChartContext>
    </g>
  </svg>
</template>

<script>
import { extent } from "d3";
import { ref, reactive } from "vue";

import GenesSignaturesChartFocus from "@/components/ccr/charts/genes_signatures/GenesSignaturesChartFocus.vue";
import GenesSignaturesChartContext from "@/components/ccr/charts/genes_signatures/GenesSignaturesChartContext.vue";


const setupChart = (data) => {
  const genes = data.curve
    .map((item) => ({
      x: item.logFC,
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
  name: "GeneSignatures",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  components: { GenesSignaturesChartFocus, GenesSignaturesChartContext },
  setup(props) {
    const chartData = setupChart(props.data);

    const yDomainFocus = ref(extent(chartData.genes.map((item) => item.y)));

    const yDomainContext = yDomainFocus.value;

    const brushed = (extent) => {
      yDomainFocus.value = extent;
    };

    const genesSetsOptions = reactive([{ label: "Proteasome", genesSet: "Proteasome" }, { label: "Spliceosome", genesSet: "Spliceosome" }, { label: "Ribosomal Proteins", genesSet: "RibosomalProteins" }, { label: "DNA Replication", genesSet: "DNAReplication" }, { label: "RNA Polymerase", genesSet: "RNAPolymerase" }, { label: "BAGEL Essentials", genesSet: "BAGELEssential" }, { label: "BAGEL Non Essential", genesSet: "BAGELNonEssential" }])
    const genesSet = ref(genesSetsOptions[0]);

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
      genesSetsOptions
    };
  },
};
</script>

<style lang="scss" scoped>
.chart__line {
  stroke-width: 1;

  &--dashed {
    stroke-dasharray: 4 2;
  }

  &--black {
    stroke: black;
  }

  &--red {
    stroke: red;
  }
}

.axis-label {
  text-anchor: middle;
  font-family: sans-serif;
  font-size: 15px;
  color: black;
}
</style>
