<template>
  <g>
    <g class="boxplot">
      <line :x1="bandwidth / 2" :x2="bandwidth / 2" :y1="yScale(data.dist.w1)" :y2="yScale(data.dist.w2)"
        class="boxplot__range" />
      <line :x1="0" :x2="bandwidth" :y1="yScale(data.dist.w1)" :y2="yScale(data.dist.w1)" class="boxplot__whisker-q"
        @mouseover="onMouseOver($event, `W1: ${data.dist.w1}`)" @mouseleave="onMouseLeave" />
      <line :x1="0" :x2="bandwidth" :y1="yScale(data.dist.w2)" :y2="yScale(data.dist.w2)" class="boxplot__whisker-q"
        @mouseover="onMouseOver($event, `W2: ${data.dist.w2}`)" @mouseleave="onMouseLeave" />
      <line :x1="0" :x2="bandwidth" :y1="yScale(data.dist.sd1)" :y2="yScale(data.dist.sd1)" class="boxplot__whisker-stdev"
        @mouseover="onMouseOver($event, `Std dev 1: ${data.dist.sd1}`)" @mouseleave="onMouseLeave" />
      <line :x1="0" :x2="bandwidth" :y1="yScale(data.dist.sd2)" :y2="yScale(data.dist.sd2)" class="boxplot__whisker-stdev"
        @mouseover="onMouseOver($event, `Std dev 2: ${data.dist.sd2}`)" @mouseleave="onMouseLeave" />
      <rect :x="0" :y="yScale(data.dist.q3)" :width="bandwidth" :height="boxHeight" class="boxplot__box"
        @mouseover="onMouseOver($event, `IQR: ${data.dist.q3}`)" @mouseleave="onMouseLeave" />
      <line :x1="0" :x2="bandwidth" :y1="yScale(data.dist.median)" :y2="yScale(data.dist.median)" class="boxplot__median"
        @mouseover="onMouseOver($event, `Median: ${data.dist.median}`)" @mouseleave="onMouseLeave" />
      <line :x1="0" :x2="bandwidth" :y1="yScale(data.dist.mean)" :y2="yScale(data.dist.mean)" class="boxplot__mean"
        @mouseover="onMouseOver($event, `Mean: ${data.dist.mean}`)" @mouseleave="onMouseLeave" />
    </g>

    <circle v-for="outlier in data.outliers" :key="outlier.location" r="4" :cx="bandwidth / 2 + outlier.xOffset"
      :cy="yScale(outlier.value)" class="boxplot__outliers" @mouseover="onMouseOver($event, outlier)"
      @mouseleave="onMouseLeave" />
  </g>
</template>

<script>
import { setTooltipContent } from '@/utils.js';

import { useTooltip } from '@nf-daha-iu3/ht-vue';

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

    const modal = document.body.querySelector('#modal');

    const { showTooltip, hideTooltip } = useTooltip({
      appendTo: modal,
      duration: 0,
      allowHTML: true,
    });

    const onMouseOver = function (event, datum) {
      if (typeof datum === "object")
        showTooltip(event, setTooltipContent(datum));
      else
        showTooltip(event, datum);
    }

    const onMouseLeave = function () {
      hideTooltip();
    }

    const bandwidth = computed(() => {
      return props.xScale.bandwidth();
    });
    const boxHeight = computed(() => {
      return (
        props.yScale(props.data.dist.q1) - props.yScale(props.data.dist.q3)
      );
    });



    return { setTooltipContent, bandwidth, boxHeight, modal, onMouseOver, onMouseLeave };
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
