<template>
  <div class="linechart-container">
    <LineChart
      :data="chartData"
      :xDomain="xDomain"
      :xLabel="xLabel"
      :yDomain="yDomain"
      :yLabel="yLabel"
    >
      <template v-slot:default="{ lineChartProps }">
        <g>
          <line
            class="chart__line chart__line--dashed"
            :x1="0"
            :y1="lineChartProps.scales.yScale(metrics.precision)"
            :x2="lineChartProps.sizes.innerWidth"
            :y2="lineChartProps.scales.yScale(metrics.precision)"
          />
          <line
            class="chart__line"
            :x1="lineChartProps.scales.xScale(metrics.recall)"
            :y1="lineChartProps.sizes.innerHeight"
            :x2="lineChartProps.scales.xScale(metrics.recall)"
            :y2="0"
          />
          <line
            class="chart__line"
            :x1="0"
            :y1="lineChartProps.scales.yScale(metrics.rnd)"
            :x2="lineChartProps.sizes.innerWidth"
            :y2="lineChartProps.scales.yScale(metrics.rnd)"
          />
        </g>
      </template>
    </LineChart>
    <div>
      <ul class="metrics__list">
        <li
          class="metrics__element"
          v-for="[key, value] in Object.entries(metrics)"
          :key="key"
        >
          <b>{{ `${key}: ` }}</b
          >{{ `${value}` }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import LineChart from "@/components/ccr/charts/linechart/LineChart.vue";

export default {
  components: { LineChart },
  name: "LineChartPrRc",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    const chartData = this.data.curve
      .map((item) => ({
        x: item.recall,
        y: item.precision,
        threshold: item.threshold,
      }))
      .sort((a, b) => a.x - b.x);

    return {
      metrics: this.data.metrics[0],
      chartData,
      xLabel: "Recall",
      yLabel: "Precision",
      xDomain: [-0.05, 1.05],
      yDomain: [-0.05, 1.05],
    };
  },
};
</script>

<style lang="scss" scoped>
.linechart-container {
  display: flex;
  gap: 1em;
}

.metrics {
  &__list {
    list-style: none;
    width: 20rem;
    text-align: left;
    font-size: 1.5rem;
  }

  &__element {
    margin-bottom: 1em;
  }
}

.chart__line {
  stroke: rgb(218, 218, 218);

  &--dashed {
    stroke-dasharray: 4 2;
  }
}
</style>
