<template>
  <div class="linechart-container">
    <LineChart
      :data="chartData"
      :x-domain="xDomain"
      :x-label="xLabel"
      :y-domain="yDomain"
      :y-label="yLabel"
    >
      <template #default="{ lineChartProps }">
        <g>
          <line
            class="chart__line chart__line--dashed"
            :x1="0"
            :y1="lineChartProps.scales.yScale(metrics.precisionAt5Fdr)"
            :x2="lineChartProps.sizes.innerWidth"
            :y2="lineChartProps.scales.yScale(metrics.precisionAt5Fdr)"
          />
          <line
            class="chart__line"
            :x1="lineChartProps.scales.xScale(metrics.recallAt5Fdr)"
            :y1="lineChartProps.sizes.innerHeight"
            :x2="lineChartProps.scales.xScale(metrics.recallAt5Fdr)"
            :y2="0"
          />
        </g>
      </template>
    </LineChart>
    <div>
      <ul class="metrics">
        <li v-for="[key, value] in Object.entries(metrics)" :key="key">
          <b>{{
            `${key
              .split(/(?=[A-Z]+|[0-9])/)
              .join(' ')
              .toLowerCase()}: `
          }}</b
          >{{ `${value}` }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import LineChart from '@/components/LineChart.vue';

export default {
  name: 'LineChartPrRc',
  components: { LineChart },
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
      xLabel: 'Recall',
      yLabel: 'Precision',
      xDomain: [-0.05, 1.05],
      yDomain: [-0.05, 1.05],
    };
  },
};
</script>

<style lang="postcss" scoped>
.linechart-container {
  display: flex;
  gap: 1em;
}

.metrics {
  list-style: none;

  li {
    margin-bottom: var(--size-3);
  }
}

.chart__line {
  stroke: rgb(218, 218, 218);

  &--dashed {
    stroke-dasharray: 4 2;
  }
}
</style>
