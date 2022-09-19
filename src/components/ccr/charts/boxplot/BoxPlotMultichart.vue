<template>
  <div class="controls-container">
    <BaseToggleSwitch v-if="data.raw && data.norm" v-model="showNormalizedData"
      :option="!showNormalizedData ? 'raw' : 'normalized'" />
  </div>
  <svg preserveAspectRatio="xMinYMin meet" :viewBox="[0, 0, width, height].join(' ')">
    <g>
      <BoxPlotChartFocus :data="selectedChartData" :width="chartFocusWidth" :height="height" :yDomain="yDomainFocus" />
    </g>
    <g :transform="`translate(${chartFocusWidth}, 0)`">
      <BoxPlotChartContext :width="chartContextWidth" :height="height" @brush="brushed" :yDomain="yDomainContext">
      </BoxPlotChartContext>
    </g>
  </svg>
</template>

<script>
import BoxPlotChartFocus from "@/components/ccr/charts/boxplot/BoxPlotChartFocus.vue";
import BoxPlotChartContext from "@/components/ccr/charts/boxplot/BoxPlotChartContext.vue";

import { augmentedExtent } from "@/composables/chart.js";


import { ref, computed, watchEffect } from "vue";

const setupChart = (data) => {
  const processData = (data) => {
    return data.map((item) => {
      return {
        label: [item.info[0].type, item.info[0].order.toString()].join(" "),
        order: item.info[0].order,
        dist: { ...item.dist[0], iqr: item.dist[0].Q3 - item.dist[0].Q1 },
        outliers: item.outliers
          .map((item) => {
            const parts = item.sgRNA.split("_");
            return {
              gene: item.gene,
              CCDS: parts[1],
              exon: parts[2],
              location: parts[3],
              sgRNA: parts[4],
              value: item.value,
              xOffset: (Math.random() - 0.5) * 40,
            };
          })
          .sort((a, b) => b.value - a.value),
      };
    });
  };
  const chartDataUnnormalized = data?.raw && processData(data.raw);
  const chartDataNormalized = data?.norm && processData(data.norm);

  return {
    chartDataUnnormalized,
    chartDataNormalized,
  };
};

const dataExtent = (data) => {
  const dist = data.map((item) => Object.values(item.dist)).flat();
  const outliers = data
    .map((item) => item.outliers)
    .flat()
    .map((item) => item.value)
    .concat();
  return augmentedExtent(outliers.concat(dist)).sort((a, b) => b - a)
};

export default {
  name: "BoxPlotMultichart",
  components: { BoxPlotChartFocus, BoxPlotChartContext },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { chartDataUnnormalized, chartDataNormalized } = setupChart(
      props.data
    );

    const showNormalizedData = ref(Boolean(props.data?.norm));

    const selectedChartData = computed(() =>
      !showNormalizedData.value ? chartDataUnnormalized : chartDataNormalized
    );

    const yDomainFocus = ref(null);
    const yDomainContext = ref(null);

    const yDomainMaxUnnormalized =
      chartDataUnnormalized && dataExtent(chartDataUnnormalized);
    const yDomainMaxNormalized =
      chartDataNormalized && dataExtent(chartDataNormalized);

    watchEffect(() => {
      yDomainFocus.value = showNormalizedData.value
        ? yDomainMaxNormalized
        : yDomainMaxUnnormalized;
      yDomainContext.value = showNormalizedData.value
        ? yDomainMaxNormalized
        : yDomainMaxUnnormalized;
    });

    const brushed = (extent) => {
      yDomainFocus.value = extent;
    };

    const needsToggleSwitch = props.data?.norm && props.data?.raw;

    const chartFocusWidth = 900;
    const chartContextWidth = 80;
    const width = chartFocusWidth + chartContextWidth;

    return {
      width,
      height: 500,
      chartFocusWidth,
      chartContextWidth,
      showNormalizedData,
      needsToggleSwitch,
      brushed,
      yDomainFocus,
      yDomainContext,
      selectedChartData,
    };
  },
};
</script>

<style lang="scss" scoped>
.controls-container {
  display: flex;
  align-items: center;

  * {
    margin-right: 0.4em;
  }
}
</style>
