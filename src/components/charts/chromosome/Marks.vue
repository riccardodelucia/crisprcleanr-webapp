<template>
  <g>
    <g v-show="selections.guides">
      <circle
        v-for="point in points"
        :key="`point${point.idx}`"
        class="chromosome__sgrna"
        :cx="xScale(point.idx)"
        :cy="yScale(point.avgLogFc)"
        :r="pointRadius"
        :data-tippy-content="setTooltipContent(point)"
        @mouseover="onMouseOver"
      ></circle>
    </g>
    <g v-show="selections.segments">
      <line
        v-for="segment in segments"
        :key="`segment${segment.idxStart}`"
        class="chromosome__segment"
        :x1="xScale(segment.idxStart)"
        :x2="xScale(segment.idxEnd)"
        :y1="yScale(segment.avgLogFc)"
        :y2="yScale(segment.avgLogFc)"
        :data-tippy-content="setTooltipContent(segment)"
        @mouseover="onMouseOver"
      ></line>
    </g>
  </g>
</template>

<script>
import { setupTooltip } from '@computational-biology-web-unit/ht-vue/utilities';

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
    const { onMouseOver, setTooltipContent } = setupTooltip();

    return { setTooltipContent, onMouseOver };
  },
};
</script>

<style lang="scss" scoped>
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
