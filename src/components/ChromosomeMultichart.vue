<template>
  <div class="controls-container">
    <div>
      <ht-checkbox
        v-model="showGuides"
        name="showGuides"
        :value="true"
        label="sgRNA log FCs"
      />
      <ht-checkbox
        v-model="showSegments"
        :value="true"
        name="showSegments"
        label="Equal logFCs segments"
      />
    </div>
    <div class="toggle-switch-container">
      <ht-toggle-switch
        v-model="showNormalizedData"
        name="correction"
        :value-on="toggleSwitchValueOn"
        :value-off="toggleSwitchValueOff"
      />
    </div>
  </div>
  <svg
    class="ht-chart"
    preserveAspectRatio="xMinYMin meet"
    :viewBox="[0, 0, width, height].join(' ')"
    :width="width"
    :height="height"
  >
    <g>
      <ChromosomeChartFocus
        :data="selectedChartData"
        :width="width"
        :height="chartFocusHeight"
        :x-domain="xDomainFocus"
      />
    </g>
    <g :transform="`translate(0, ${chartFocusHeight})`">
      <ChromosomeChartContext
        :data="selectedChartData"
        :width="width"
        :height="chartContextHeight"
        :x-domain="xDomainContext"
        @brush="brushed"
      ></ChromosomeChartContext>
    </g>
  </svg>
</template>

<script>
import ChromosomeChartFocus from '@/components/ChromosomeChartFocus.vue';
import ChromosomeChartContext from '@/components/ChromosomeChartContext.vue';

import { extent } from 'd3';

import { ref, computed, provide } from 'vue';

const setupChart = (data) => {
  const chartDataUnnormalized = {
    segments: data.segments,
    sgRnaArray: data.sgRnaArray.map((sgrna) => {
      const newSgrna = {
        ...sgrna,
        avgLogFC: sgrna.avgLogFC,
      };
      return newSgrna;
    }),
  };

  const chartDataNormalized = {
    segments: data.segmentsAdj,
    sgRnaArray: data.sgRnaArray.map((sgrna) => {
      const newSgrna = {
        ...sgrna,
        avgLogFC: sgrna.avgLogFCAdj ? sgrna.avgLogFCAdj : sgrna.avgLogFC,
      };
      return newSgrna;
    }),
  };
  return { chartDataUnnormalized, chartDataNormalized };
};

export default {
  name: 'ChromosomeMultichart',
  components: { ChromosomeChartFocus, ChromosomeChartContext },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const toggleSwitchValueOn = 'post correction';
    const toggleSwitchValueOff = 'pre correction';
    const showNormalizedData = ref(toggleSwitchValueOn);

    const { chartDataUnnormalized, chartDataNormalized } = setupChart(
      props.data
    );

    const xDomainFocus = ref(extent([0, props.data.sgRnaArray.length]));
    const xDomainContext = xDomainFocus.value;

    const brushed = (extent) => {
      xDomainFocus.value = extent;
    };

    const selectedChartData = computed(() =>
      showNormalizedData.value === toggleSwitchValueOn
        ? chartDataNormalized
        : chartDataUnnormalized
    );

    const showGuides = ref(true);
    const showSegments = ref(true);

    provide('showGuides', showGuides);
    provide('showSegments', showSegments);

    return {
      height: 500,
      width: 1152,
      chartFocusHeight: 350,
      chartContextHeight: 100,
      selectedChartData,
      xDomainFocus,
      xDomainContext,
      showNormalizedData,
      brushed,
      showGuides,
      showSegments,
      toggleSwitchValueOn,
      toggleSwitchValueOff,
    };
  },
};
</script>

<style lang="postcss" scoped>
.controls-container {
  margin-bottom: var(--size-4);
  display: flex;
  gap: 2em;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
