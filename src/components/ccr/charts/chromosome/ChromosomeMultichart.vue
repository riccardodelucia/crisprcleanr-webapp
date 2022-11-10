<template>
  <div class="controls-container">
    <BaseCheckbox v-model="selections.guides" option="sgRNA log FCs" />
    <BaseCheckbox
      v-model="selections.segments"
      option="Equal logFCs segments"
    />

    <div class="controls-container__normalization">
      <BaseToggleSwitch
        v-model="showNormalizedData"
        :option="showNormalizedData ? 'post correction' : 'pre correction'"
      />
    </div>
  </div>
  <svg
    preserveAspectRatio="xMinYMin meet"
    :viewBox="[0, 0, width, height].join(' ')"
  >
    <g>
      <ChromosomeChartFocus
        :data="selectedChartData"
        :width="width"
        :height="chartFocusHeight"
        :x-domain="xDomainFocus"
        :selections="selections"
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
import ChromosomeChartFocus from "@/components/ccr/charts/chromosome/ChromosomeChartFocus.vue";
import ChromosomeChartContext from "@/components/ccr/charts/chromosome/ChromosomeChartContext.vue";

import { extent } from "d3";

import { ref, reactive, computed } from "vue";

const setupChart = (data) => {
  const chartDataUnnormalized = {
    segments: data.segments,
    sgRNAArray: data.sgRNAArray.map((sgrna) => {
      const newSgrna = {
        ...sgrna,
        avgLogFC: sgrna.avgLogFC,
      };
      return newSgrna;
    }),
  };

  const chartDataNormalized = {
    segments: data.segmentsAdj,
    sgRNAArray: data.sgRNAArray.map((sgrna) => {
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
  name: "ChromosomeMultichart",
  components: { ChromosomeChartFocus, ChromosomeChartContext },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const showNormalizedData = ref(true);

    const { chartDataUnnormalized, chartDataNormalized } = setupChart(
      props.data
    );

    const xDomainFocus = ref(extent([0, props.data.sgRNAArray.length]));
    const xDomainContext = xDomainFocus.value;

    const brushed = (extent) => {
      xDomainFocus.value = extent;
    };

    const selectedChartData = computed(() =>
      showNormalizedData.value ? chartDataNormalized : chartDataUnnormalized
    );

    return {
      height: 500,
      width: 1152,
      chartFocusHeight: 350,
      chartContextHeight: 100,
      selectedChartData,
      xDomainFocus,
      xDomainContext,
      selections: reactive({ segments: true, guides: true }),
      showNormalizedData,
      brushed,
    };
  },
};
</script>

<style lang="scss" scoped>
.controls-container {
  margin: 0 2em;
  margin-bottom: 1em;
  display: flex;
  gap: 2em;
  align-items: center;
  flex-wrap: wrap;
  align-content: center;

  &__normalization {
    margin-left: auto;
    flex: 0 0 20rem;
    display: flex;
    gap: 0.4em;
  }
}
</style>
