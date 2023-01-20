<template>
  <g>
    <g class="boxplot" @mouseover="onMouseOver">
      <line
        :x1="bandwidth / 2"
        :x2="bandwidth / 2"
        :y1="yScale(data.dist.w1)"
        :y2="yScale(data.dist.w2)"
        class="boxplot__range"
      />
      <line
        :x1="0"
        :x2="bandwidth"
        :y1="yScale(data.dist.w1)"
        :y2="yScale(data.dist.w1)"
        class="boxplot__whisker-q"
        :data-tippy-content="`W1: ${data.dist.w1}`"
        @mouseover="onMouseOver"
      />
      <line
        :x1="0"
        :x2="bandwidth"
        :y1="yScale(data.dist.w2)"
        :y2="yScale(data.dist.w2)"
        class="boxplot__whisker-q"
        :data-tippy-content="`W2: ${data.dist.w2}`"
        @mouseover="onMouseOver"
      />
      <line
        :x1="0"
        :x2="bandwidth"
        :y1="yScale(data.dist.sd1)"
        :y2="yScale(data.dist.sd1)"
        class="boxplot__whisker-stdev"
        :data-tippy-content="`Std dev 1: ${data.dist.sd1}`"
        @mouseover="onMouseOver"
      />
      <line
        :x1="0"
        :x2="bandwidth"
        :y1="yScale(data.dist.sd2)"
        :y2="yScale(data.dist.sd2)"
        class="boxplot__whisker-stdev"
        :data-tippy-content="`Std dev 2: ${data.dist.sd2}`"
        @mouseover="onMouseOver"
      />
      <rect
        :x="0"
        :y="yScale(data.dist.q3)"
        :width="bandwidth"
        :height="boxHeight"
        class="boxplot__box"
        :data-tippy-content="`IQR: ${data.dist.q3}`"
        @mouseover="onMouseOver"
      />
      <line
        :x1="0"
        :x2="bandwidth"
        :y1="yScale(data.dist.median)"
        :y2="yScale(data.dist.median)"
        class="boxplot__median"
        :data-tippy-content="`Median: ${data.dist.median}`"
        @mouseover="onMouseOver"
      />
      <line
        :x1="0"
        :x2="bandwidth"
        :y1="yScale(data.dist.mean)"
        :y2="yScale(data.dist.mean)"
        class="boxplot__mean"
        :data-tippy-content="`Mean: ${data.dist.mean}`"
        @mouseover="onMouseOver"
      />
    </g>

    <circle
      v-for="outlier in data.outliers"
      :key="outlier.location"
      r="4"
      :cx="bandwidth / 2 + outlier.xOffset"
      :cy="yScale(outlier.value)"
      class="boxplot__outliers"
      :data-tippy-content="setTooltipContent(outlier)"
      @mouseover="onMouseOver"
    />
  </g>
</template>

<script>
import { setupTooltip } from '@computational-biology-web-unit/ht-vue/utilities';
import { computed } from 'vue';

export default {
  name: 'BoxPlotMarks',
  props: {
    xScale: {
      type: Function,
      default: () => {},
    },
    yScale: {
      type: Function,
      default: () => {},
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const bandwidth = computed(() => {
      return props.xScale.bandwidth();
    });
    const boxHeight = computed(() => {
      return (
        props.yScale(props.data.dist.q1) - props.yScale(props.data.dist.q3)
      );
    });
    const { onMouseOver, setTooltipContent } = setupTooltip();

    return { setTooltipContent, bandwidth, boxHeight, onMouseOver };
  },
};
</script>

<style scoped>
.boxplot__range {
  stroke: #5c5c5c;
  stroke-width: 1;
  stroke-dasharray: 4;
}
.boxplot__whisker-q {
  stroke: #5c5c5c;
  stroke-width: 2;
}
.boxplot__whisker-stdev {
  stroke: blue;
  stroke-width: 2;
}
.boxplot__box {
  fill: white;
  stroke: black;
}
.boxplot__median {
  stroke: red;
  stroke-width: 2;
}
.boxplot__mean {
  stroke: black;
  stroke-width: 2;
}
.boxplot__outliers {
  fill: white;
  stroke: black;
}
.boxplot__outliers:hover {
  fill: black;
  stroke: black;
}
</style>
