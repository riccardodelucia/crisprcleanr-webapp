<template>
  <g :transform="`translate(${margin.left}, ${margin.top})`">
    <defs>
      <clipPath id="clip-segments">
        <rect :width="innerWidth" :height="innerHeight" />
      </clipPath>
    </defs>
    <D3Axis :scale="yScale" position="left" :tick-size="-innerWidth" />

    <g :transform="`translate(0, ${innerHeight})`">
      <D3Axis :scale="xScale" position="bottom" />
    </g>
    <!-- Segments are clipped through a clip path, instead of filtering data. This is
    convenient, since segments are very lightweight to manage, and the filtering algorithm would have
    to trim segment endpoints according to the current selected area. -->
    <Marks
      :points="focusData.sgRNAArray"
      :segments="data.segments"
      :x-scale="xScale"
      :y-scale="yScale"
      :point-radius="4"
      :selections="selections"
      clip-path="url(#clip-segments)"
    />
  </g>
</template>

<script>
import { scaleLinear, extent } from 'd3';
import Marks from '@/components/ccr/charts/chromosome/Marks.vue';
import D3Axis from '@/components/ccr/charts/D3Axis.vue';

import { computed } from 'vue';

import { getInnerChartSizes, augmentedExtent } from '@/composables/chart.js';

export default {
  name: 'ChromosomeChartFocus',
  components: { Marks, D3Axis },
  props: {
    data: {
      type: Object,
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
    selections: {
      type: Object,
      default: () => ({ segments: true, guides: true }),
    },
    xDomain: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const margin = {
      top: 5,
      right: 50,
      bottom: 40,
      left: 50,
    };

    const { innerWidth, innerHeight } = getInnerChartSizes(
      props.width,
      props.height,
      margin
    );

    const augmentedYExtent = augmentedExtent(
      props.data.sgRNAArray.map((d) => d.avgLogFC)
    );

    const yScale = scaleLinear()
      .domain(augmentedYExtent)
      .range([innerHeight, 0]);

    const xScale = computed(() => {
      return scaleLinear().domain(extent(props.xDomain)).range([0, innerWidth]);
    });

    const focusData = computed(() => {
      return {
        ...props.data,
        sgRNAArray: props.data.sgRNAArray.filter(
          (sgRNA) =>
            sgRNA.idx >= props.xDomain[0] && sgRNA.idx <= props.xDomain[1]
        ),
      };
    });

    return {
      innerWidth,
      innerHeight,
      margin,
      xScale,
      yScale,
      focusData,
    };
  },
};
</script>
