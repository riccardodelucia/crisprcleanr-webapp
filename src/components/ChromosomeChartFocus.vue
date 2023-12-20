<template>
  <g :transform="`translate(${margin.left}, ${margin.top})`">
    <defs>
      <clipPath id="clip-segments">
        <rect :width="innerWidth" :height="innerHeight" />
      </clipPath>
    </defs>
    <g ref="yAxis"></g>
    <g :transform="`translate(0, ${innerHeight})`">
      <g ref="xAxis"></g>
    </g>
    <!-- Segments are clipped through a clip path, instead of filtering data. This is
    convenient, since segments are very lightweight to manage, and the filtering algorithm would have
    to trim segment endpoints according to the current selected area. -->
    <ChromosomeMarks
      :points="focusData.sgRnaArray"
      :segments="data.segments"
      :x-scale="xScale"
      :y-scale="yScale"
      :point-radius="4"
      clip-path="url(#clip-segments)"
    />
  </g>
</template>

<script>
import { scaleLinear, extent, select, axisLeft, axisBottom } from 'd3';
import ChromosomeMarks from '@/components/ChromosomeMarks.vue';

import { computed, ref } from 'vue';

import {
  getInnerChartSizes,
  augmentedExtent,
  makeReactiveAxis,
} from '@computational-biology-sw-web-dev-unit/ht-vue';

export default {
  name: 'ChromosomeChartFocus',
  components: { ChromosomeMarks },
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
    xDomain: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const yAxis = ref(null);
    const xAxis = ref(null);

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
      props.data.sgRnaArray.map((d) => d.avgLogFc)
    );

    const yScale = scaleLinear()
      .domain(augmentedYExtent)
      .range([innerHeight, 0]);

    makeReactiveAxis(() => {
      select(yAxis.value).call(axisLeft(yScale).tickSize(-innerWidth));
      select(yAxis.value).select('.domain').remove();
      select(yAxis.value).selectAll('.tick').attr('stroke-opacity', 0.2);
    });

    const xScale = computed(() => {
      return scaleLinear().domain(extent(props.xDomain)).range([0, innerWidth]);
    });

    makeReactiveAxis(() => {
      select(xAxis.value).call(axisBottom(xScale.value));
    });

    const focusData = computed(() => {
      return {
        ...props.data,
        sgRnaArray: props.data.sgRnaArray.filter(
          (sgRna) =>
            sgRna.idx >= props.xDomain[0] && sgRna.idx <= props.xDomain[1]
        ),
      };
    });

    return {
      innerWidth,
      innerHeight,
      margin,
      xScale,
      xAxis,
      yAxis,
      yScale,
      focusData,
    };
  },
};
</script>
