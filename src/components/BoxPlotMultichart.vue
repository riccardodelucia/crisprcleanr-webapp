<template>
  <div class="controls-container">
    <div class="toggle-switch-container">
      <ht-toggle-switch
        v-if="data.raw && data.norm"
        v-model="showNormalizedData"
        name="normalization"
        :value-on="toggleSwitchValueOn"
        :value-off="toggleSwitchValueOff"
      />
    </div>
    <!-- <ht-toggle-switch
      v-if="data.raw && data.norm"
      v-model="showNormalizedData"
      :option="!showNormalizedData ? 'raw' : 'normalized'"
    /> -->
  </div>
  <svg
    ref="chart"
    class="ht-chart"
    preserveAspectRatio="xMinYMin meet"
    :viewBox="[0, 0, width, height].join(' ')"
    :width="width"
    :height="height"
  >
    <g>
      <BoxPlotChartFocus
        :data="selectedChartData"
        :width="chartFocusWidth"
        :height="height"
        :y-domain="yDomainFocus"
      />
    </g>
    <g :transform="`translate(${chartFocusWidth}, 0)`">
      <BoxPlotChartContext
        :width="chartContextWidth"
        :height="height"
        :y-domain="yDomainContext"
        @brush="brushed"
      ></BoxPlotChartContext>
    </g>
  </svg>
</template>

<script>
import BoxPlotChartFocus from '@/components/BoxPlotChartFocus.vue';
import BoxPlotChartContext from '@/components/BoxPlotChartContext.vue';

import { augmentedExtent } from '../utils.js';

import { ref, computed, watchEffect, provide } from 'vue';

const setupChart = (data) => {
  const processData = (data) => {
    return data.map((item) => {
      return {
        label: [item.info[0].type, item.info[0].order.toString()].join(' '),
        order: item.info[0].order,
        dist: { ...item.dist[0], iqr: item.dist[0].q3 - item.dist[0].q1 },
        outliers: item.outliers
          .map((item) => {
            const parts = item.sgRna.split('_');
            return {
              gene: item.gene,
              ccds: parts[1],
              exon: parts[2],
              location: parts[3],
              sgRna: parts[4],
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
  return augmentedExtent(outliers.concat(dist)).sort((a, b) => b - a);
};

export default {
  name: 'BoxPlotMultichart',
  components: { BoxPlotChartFocus, BoxPlotChartContext },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const chart = ref(null);
    provide('chart', chart);

    const { chartDataUnnormalized, chartDataNormalized } = setupChart(
      props.data
    );

    const toggleSwitchValueOn = 'normalized';
    const toggleSwitchValueOff = 'raw';

    const showNormalizedData = ref(toggleSwitchValueOn);

    const selectedChartData = computed(() =>
      showNormalizedData.value === toggleSwitchValueOn
        ? chartDataNormalized
        : chartDataUnnormalized
    );

    const yDomainFocus = ref(null);
    const yDomainContext = ref(null);

    const yDomainMaxUnnormalized =
      chartDataUnnormalized && dataExtent(chartDataUnnormalized);
    const yDomainMaxNormalized =
      chartDataNormalized && dataExtent(chartDataNormalized);

    watchEffect(() => {
      yDomainFocus.value =
        showNormalizedData.value === toggleSwitchValueOn
          ? yDomainMaxNormalized
          : yDomainMaxUnnormalized;
      yDomainContext.value =
        showNormalizedData.value === toggleSwitchValueOn
          ? yDomainMaxNormalized
          : yDomainMaxUnnormalized;
    });

    const brushed = (extent) => {
      yDomainFocus.value = extent;
    };

    const needsToggleSwitch = props.data?.norm && props.data?.raw;

    const chartFocusWidth = 900;
    const chartContextWidth = 130;
    const width = chartFocusWidth + chartContextWidth;

    return {
      width,
      height: 500,
      chartFocusWidth,
      chartContextWidth,
      toggleSwitchValueOn,
      toggleSwitchValueOff,
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

<style lang="postcss" scoped>
.controls-container {
  display: flex;
  align-items: center;
  margin-bottom: var(--size-4);
}
</style>
