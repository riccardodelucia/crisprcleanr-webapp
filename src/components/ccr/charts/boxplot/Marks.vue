<template>
  <g>
    <g
      @mouseover="
        $emit('tooltip-mouseover', { event: $event, data: data.dist })
      "
      @mousemove="
        $emit('tooltip-mousemove', { event: $event, data: data.dist })
      "
      @mouseleave="$emit('tooltip-mouseleave')"
    >
      <line
        :x1="bandwidth / 2"
        :x2="bandwidth / 2"
        :y1="yScale(data.dist.W1)"
        :y2="yScale(data.dist.W2)"
        class="boxplot__range"
      />
      <line
        :x1="0"
        :x2="bandwidth"
        :y1="yScale(data.dist.W1)"
        :y2="yScale(data.dist.W1)"
        class="boxplot__whisker-q"
      />
      <line
        :x1="0"
        :x2="bandwidth"
        :y1="yScale(data.dist.W2)"
        :y2="yScale(data.dist.W2)"
        class="boxplot__whisker-q"
      />
      <line
        :x1="0"
        :x2="bandwidth"
        :y1="yScale(data.dist.sd1)"
        :y2="yScale(data.dist.sd1)"
        class="boxplot__whisker-stdev"
      />
      <line
        :x1="0"
        :x2="bandwidth"
        :y1="yScale(data.dist.sd2)"
        :y2="yScale(data.dist.sd2)"
        class="boxplot__whisker-stdev"
      />
      <rect
        :x="0"
        :y="yScale(data.dist.Q3)"
        :width="bandwidth"
        :height="boxHeight"
        class="boxplot__box"
      />
      <line
        :x1="0"
        :x2="bandwidth"
        :y1="yScale(data.dist.median)"
        :y2="yScale(data.dist.median)"
        class="boxplot__median"
      />
      <line
        :x1="0"
        :x2="bandwidth"
        :y1="yScale(data.dist.mean)"
        :y2="yScale(data.dist.mean)"
        class="boxplot__mean"
      />
      <line
        :x1="0"
        :x2="bandwidth"
        :y1="yScale(data.dist.median)"
        :y2="yScale(data.dist.median)"
        class="boxplot__median"
      />
    </g>

    <circle
      v-for="outlier in data.outliers"
      :key="outlier.location"
      r="4"
      :cx="bandwidth / 2 + outlier.xOffset"
      :cy="yScale(outlier.value)"
      class="boxplot__outliers"
      @mouseover="$emit('tooltip-mouseover', { event: $event, data: outlier })"
      @mousemove="$emit('tooltip-mousemove', { event: $event, data: outlier })"
      @mouseleave="$emit('tooltip-mouseleave')"
    />
  </g>
</template>

<script>
export default {
  name: "Marks",
  props: {
    xScale: {
      type: Function,
    },
    yScale: {
      type: Function,
    },
    data: {
      type: Object,
    },
  },

  computed: {
    bandwidth() {
      return this.xScale.bandwidth();
    },
    boxHeight() {
      return this.yScale(this.data.dist.Q1) - this.yScale(this.data.dist.Q3);
    },
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