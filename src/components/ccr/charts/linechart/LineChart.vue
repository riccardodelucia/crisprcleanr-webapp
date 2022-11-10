<template>
  <svg
    preserveAspectRatio="xMinYMin meet"
    :viewBox="[0, 0, width, height].join(' ')"
    width="100%"
    height="100%"
    @mouseover="onMouseOver"
    @mousemove="onMouseOver"
    @mouseleave="onMouseLeave"
  >
    <g ref="chart" :transform="`translate(${margin.left}, ${margin.top})`">
      <D3Axis :scale="yScale" position="left" />
      <text
        :transform="`translate(${-yAxisLabelOffset}, ${
          innerHeight / 2
        }) rotate(-90)`"
        class="axis-label"
      >
        {{ yLabel }}
      </text>
      <g :transform="`translate(0, ${innerHeight})`">
        <D3Axis :scale="xScale" position="bottom" />
        <text
          :transform="`translate(${innerWidth / 2}, ${xAxisLabelOffset})`"
          class="axis-label"
        >
          {{ xLabel }}
        </text>
      </g>
      <slot
        :line-chart-props="{
          sizes: { innerHeight, innerWidth },
          scales: { xScale, yScale },
        }"
      ></slot>
      <path :d="curve" class="chart__path" />
      <circle
        v-show="tooltipShow"
        id="cursor"
        :cx="cursorPoint.x"
        :cy="cursorPoint.y"
        r="3"
        class="chart__point"
        :data-tippy-content="tooltipContent"
      />
    </g>
  </svg>
</template>

<script>
import { scaleLinear, extent, line, bisector, pointer } from 'd3';
import D3Axis from '@/components/ccr/charts/D3Axis.vue';

import { ref, reactive } from 'vue';
import { getInnerChartSizes } from '@/composables/chart.js';

import tippy from 'tippy.js';
import { hideAll } from 'tippy.js';

const bisectD3 = bisector((d) => d.x).left;

const bisect = (event, xScale, data, chart) => {
  const chartXSVGCoord = pointer(event, chart.value)[0];

  const x = xScale.invert(chartXSVGCoord - margin.left);
  const index = bisectD3(data, x);

  return index >= data.length ? data.at(-1) : data[index];
};

const width = 500;
const height = 500;

const margin = {
  top: 20,
  right: 0,
  bottom: 40,
  left: 50,
};

export default {
  name: 'LineChart',
  components: { D3Axis },
  props: {
    data: {
      type: Array,
      required: true,
    },
    xLabel: { type: String, default: '' },
    xDomain: { type: Array, required: true },
    yLabel: { type: String, default: '' },
    yDomain: { type: Array, required: true },
  },
  setup(props) {
    const { innerWidth, innerHeight } = getInnerChartSizes(
      width,
      height,
      margin
    );

    const xScale = scaleLinear().domain(props.xDomain).range([0, innerWidth]);

    const yScale = scaleLinear()
      .domain(extent(props.yDomain))
      .range([innerHeight, 0]);

    const curve = line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))(props.data);

    const chart = ref(null);

    const cursorPoint = reactive({ x: 0, y: 0 });
    const tooltipShow = ref(false);
    const tooltipContent = ref('');

    const onMouseOver = (event) => {
      tooltipShow.value = true;
      const datum = bisect(event, xScale, props.data, chart.value);
      cursorPoint.x = xScale(datum.x);
      cursorPoint.y = yScale(datum.y);
      tooltipContent.value = `Threshold: ${datum.threshold}`;
      hideAll({ duration: 0 });
      const instance = tippy('#cursor', { duration: 0 });
      instance[0].show();
    };

    const onMouseLeave = () => {
      tooltipShow.value = false;
      hideAll({ duration: 0 });
    };

    return {
      width,
      height,
      margin,
      innerWidth,
      innerHeight,
      curve,
      xScale,
      xAxisLabelOffset: 30,
      yScale,
      yAxisLabelOffset: 30,
      cursorPoint,
      tooltipShow,
      tooltipContent,
      chart,
      onMouseOver,
      onMouseLeave,
    };
  },
};
</script>

<style lang="scss" scoped>
.chart {
  &__path {
    stroke: blue;
    stroke-width: 2px;
    fill: none;
  }

  &__point {
    stroke: orangered;
    fill: orangered;
  }
}

.axis-label {
  text-anchor: middle;
  font-family: sans-serif;
  font-size: 15px;
  color: black;
}
</style>
