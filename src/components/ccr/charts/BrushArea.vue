<template>
  <g>
    <slot></slot>
    <g ref="brush"></g>
  </g>
</template>
<script>
import { select, brushX, brushY } from 'd3';

import { ref, onMounted } from 'vue';

export default {
  name: 'BrushArea',
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    // the domain must be sorted according to how it has to be mapped on the screen, following the standard SVG axes orientation
    // horizontal brush: [left, right]
    // vertical brush:  [top, bottom]
    domain: {
      type: Array,
      default: () => [],
    },
    brushDirection: {
      type: String,
      default: 'vertical',
    },
    scale: {
      type: Function,
      default: () => {},
    },
  },
  emits: { brush: null },
  setup(props, { emit }) {
    const brush = ref(null);

    const brushFunction = props.brushDirection === 'vertical' ? brushY : brushX;

    const updateBrushedDomain = ({ selection }) => {
      const extent = selection
        ? selection.map(props.scale.invert)
        : props.domain;

      emit('brush', extent);
    };

    onMounted(() => {
      select(brush.value).call(
        brushFunction()
          .extent([
            [0, 0],
            [props.width, props.height],
          ])
          .on('brush end', updateBrushedDomain)
      );
    });

    return {
      brush,
    };
  },
};
</script>
