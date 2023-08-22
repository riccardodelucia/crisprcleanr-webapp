<template>
  <svg class="ht-chart" preserveAspectRatio="xMinYMin meet" :viewBox="[0, 0, width, height].join(' ')" :width="width"
    :height="height" @mouseover="onMouseOver" @mousemove="onMouseOver" @mouseleave="onMouseLeave">
    <g ref="chart" :transform="`translate(${margin.left}, ${margin.top})`">
      <g ref="yAxis"></g>
      <text :transform="`translate(${-yAxisLabelOffset}, ${innerHeight / 2
        }) rotate(-90)`" class="axis-label">
        {{ yLabel }}
      </text>
      <g :transform="`translate(0, ${innerHeight})`">
        <g ref="xAxis"></g>
        <text :transform="`translate(${innerWidth / 2}, ${xAxisLabelOffset})`" class="axis-label">
          {{ xLabel }}
        </text>
      </g>
      <slot :line-chart-props="{
        sizes: { innerHeight, innerWidth },
        scales: { xScale, yScale },
      }"></slot>
      <path :d="curve" class="chart__path" />
      <circle v-show="tooltipShow" ref="cursor" :cx="cursorPoint.x" :cy="cursorPoint.y" r="3" class="chart__point" />
    </g>
  </svg>
</template>

<script>
import {
  scaleLinear,
  extent,
  line,
  bisector,
  pointer,
  select,
  axisLeft,
  axisBottom,
} from 'd3';

import { ref, reactive, onMounted } from 'vue';
import {
  getInnerChartSizes,
  makeReactiveAxis
} from '@computational-biology-sw-web-dev-unit/ht-vue';

import tippy from 'tippy.js';

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
  bottom: 50,
  left: 60,
};

export default {
  name: 'LineChart',
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

    const chart = ref(null);
    const modal = document.body.querySelector('#modal');

    const cursor = ref(null);

    onMounted(() => {
      const instance = tippy(cursor.value);
      instance.setProps({
        appendTo: modal,
        duration: 0,
      });
    })

    const cursorPoint = reactive({ x: 0, y: 0 });
    const tooltipShow = ref(false);

    const yAxis = ref(null);
    const yScale = scaleLinear()
      .domain(extent(props.yDomain))
      .range([innerHeight, 0]);
    makeReactiveAxis(() => {
      select(yAxis.value).call(axisLeft(yScale));
    });

    const xAxis = ref(null);
    const xScale = scaleLinear().domain(props.xDomain).range([0, innerWidth]);
    makeReactiveAxis(() => {
      select(xAxis.value).call(axisBottom(xScale));
    });

    const curve = line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))(props.data);

    const onMouseOver = (event) => {
      tooltipShow.value = true;
      const datum = bisect(event, xScale, props.data, chart.value);
      cursorPoint.x = xScale(datum.x);
      cursorPoint.y = yScale(datum.y);

      cursor.value._tippy.setProps({
        content: `Threshold: ${datum.threshold}`,
      });
      cursor.value._tippy.show();
    };

    const onMouseLeave = () => {
      tooltipShow.value = false;
      cursor.value._tippy.hide();
    };

    return {
      width,
      height,
      margin,
      innerWidth,
      innerHeight,
      curve,
      xScale,
      xAxisLabelOffset: 40,
      xAxis,
      yScale,
      yAxis,
      yAxisLabelOffset: 40,
      cursorPoint,
      tooltipShow,
      chart,
      onMouseOver,
      onMouseLeave,
      cursor,
      modal,
    };
  },
};
</script>

<style lang="postcss" scoped>
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
