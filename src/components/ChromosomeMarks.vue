<template>
  <g>
    <g v-show="showGuides">
      <circle
        v-for="point in points"
        :key="`point${point.idx}`"
        class="chromosome__sgrna"
        :cx="xScale(point.idx)"
        :cy="yScale(point.avgLogFc)"
        :r="pointRadius"
        @mouseover="onMouseOver($event, point)"
        @mouseleave="onMouseLeave"
      >
      </circle>
    </g>
    <g v-show="showSegments">
      <line
        v-for="segment in segments"
        :key="`segment${segment.idxStart}`"
        class="chromosome__segment"
        :x1="xScale(segment.idxStart)"
        :x2="xScale(segment.idxEnd)"
        :y1="yScale(segment.avgLogFc)"
        :y2="yScale(segment.avgLogFc)"
        @mouseover="onMouseOver($event, segment)"
        @mouseleave="onMouseLeave"
      ></line>
    </g>
  </g>
</template>

<script>
import { setTooltipContent } from '@/utils.js';
import { useTooltip } from '@computational-biology-sw-web-dev-unit/ht-vue';
import { inject } from 'vue';

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
  },
  setup() {
    const showGuides = inject('showGuides');
    const showSegments = inject('showSegments');

    const modal = document.body.querySelector('#modal');

    const { showTooltip, hideTooltip } = useTooltip({
      appendTo: modal,
      duration: 0,
      allowHTML: true,
    });

    const onMouseOver = function (event, datum) {
      showTooltip(event, setTooltipContent(datum));
    };

    const onMouseLeave = function () {
      hideTooltip();
    };

    return {
      setTooltipContent,
      modal,
      onMouseOver,
      onMouseLeave,
      showGuides,
      showSegments,
    };
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
