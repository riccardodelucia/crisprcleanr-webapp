<template>
  <g>
    <g class="boxplot">
      <line :x1="bandwidth / 2" :x2="bandwidth / 2" :y1="yScale(data.dist.w1)" :y2="yScale(data.dist.w2)"
        class="boxplot__range" />
      <line v-tippy="{
        content: `W1: ${data.dist.w1}`,
        appendTo: modal,
        duration: 0,
        allowHTML: true,
      }" :x1="0" :x2="bandwidth" :y1="yScale(data.dist.w1)" :y2="yScale(data.dist.w1)" class="boxplot__whisker-q" />
      <line v-tippy="{
        content: `W2: ${data.dist.w2}`,
        appendTo: modal,
        duration: 0,
        allowHTML: true,
      }" :x1="0" :x2="bandwidth" :y1="yScale(data.dist.w2)" :y2="yScale(data.dist.w2)" class="boxplot__whisker-q" />
      <line v-tippy="{
        content: `Std dev 1: ${data.dist.sd1}`,
        appendTo: modal,
        duration: 0,
        allowHTML: true,
      }" :x1="0" :x2="bandwidth" :y1="yScale(data.dist.sd1)" :y2="yScale(data.dist.sd1)"
        class="boxplot__whisker-stdev" />
      <line v-tippy="{
        content: `Std dev 2: ${data.dist.sd2}`,
        appendTo: modal,
        duration: 0,
        allowHTML: true,
      }" :x1="0" :x2="bandwidth" :y1="yScale(data.dist.sd2)" :y2="yScale(data.dist.sd2)"
        class="boxplot__whisker-stdev" />
      <rect v-tippy="{
        content: `IQR: ${data.dist.q3}`,
        appendTo: modal,
        duration: 0,
        allowHTML: true,
      }" :x="0" :y="yScale(data.dist.q3)" :width="bandwidth" :height="boxHeight" class="boxplot__box" />
      <line v-tippy="{
        content: `Median: ${data.dist.median}`,
        appendTo: modal,
        duration: 0,
        allowHTML: true,
      }" :x1="0" :x2="bandwidth" :y1="yScale(data.dist.median)" :y2="yScale(data.dist.median)"
        class="boxplot__median" />
      <line v-tippy="{
        content: `Mean: ${data.dist.mean}`,
        appendTo: modal,
        duration: 0,
        allowHTML: true,
      }" :x1="0" :x2="bandwidth" :y1="yScale(data.dist.mean)" :y2="yScale(data.dist.mean)" class="boxplot__mean" />
    </g>

    <circle v-for="outlier in data.outliers" :key="outlier.location" v-tippy="{
      content: setTooltipContent(outlier),
      appendTo: modal,
      duration: 0,
      allowHTML: true,
    }" r="4" :cx="bandwidth / 2 + outlier.xOffset" :cy="yScale(outlier.value)" class="boxplot__outliers" />
  </g>
</template>

<script>
import { setTooltipContent } from '../../../utils';
import { computed } from 'vue';

export default {
  name: 'BoxPlotMarks',
  props: {
    xScale: {
      type: Function,
      default: () => { },
    },
    yScale: {
      type: Function,
      default: () => { },
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

    const modal = document.body.querySelector('#modal');

    return { setTooltipContent, bandwidth, boxHeight, modal };
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
