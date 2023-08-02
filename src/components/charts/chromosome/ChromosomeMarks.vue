<template>
  <g>
    <g v-show="selections.guides">
      <circle
        v-for="point in points"
        :key="`point${point.idx}`"
        v-tippy="{
          content: setTooltipContent(point),
          appendTo: modal,
          duration: 0,
          allowHTML: true,
        }"
        class="chromosome__sgrna"
        :cx="xScale(point.idx)"
        :cy="yScale(point.avgLogFc)"
        :r="pointRadius"
      ></circle>
    </g>
    <g v-show="selections.segments">
      <line
        v-for="segment in segments"
        :key="`segment${segment.idxStart}`"
        v-tippy="{
          content: setTooltipContent(segment),
          appendTo: modal,
          duration: 0,
          allowHTML: true,
        }"
        class="chromosome__segment"
        :x1="xScale(segment.idxStart)"
        :x2="xScale(segment.idxEnd)"
        :y1="yScale(segment.avgLogFc)"
        :y2="yScale(segment.avgLogFc)"
      ></line>
    </g>
  </g>
</template>

<script>
import { setTooltipContent } from '../../../utils';

export default {
  name: 'ChromosomeMarks',
  props: {
    points: {
      type: Array,
      required: true,
    },
    segments: {
      type: Array,
      default: () => [],
    },
    xScale: {
      type: Function,
      default: () => {},
    },
    yScale: {
      type: Function,
      default: () => {},
    },
    pointRadius: {
      type: Number,
      default: 4,
    },
    selections: {
      type: Object,
      default: () => ({ segments: true, guides: true }),
    },
  },
  setup() {
    const modal = document.body.querySelector('#modal');

    return { setTooltipContent, modal };
  },
};
</script>

<style lang="postcss" scoped>
.chromosome {
  &__sgrna {
    fill: #1ca700;
    opacity: 0.7;

    &:hover {
      fill: red;
      opacity: 1;
    }
  }
  &__segment {
    stroke-width: 4;
    stroke: black;

    &:hover {
      stroke: red;
      stroke-width: 5;
    }
  }
}
</style>
