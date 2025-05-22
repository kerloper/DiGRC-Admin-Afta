<script setup>

import BarChart from "@/components/charts/BarChart.vue";
import {graphic} from 'echarts/core';
import {reactive} from "vue";

const props = defineProps({
  chartData: Object
})


const chartOptions = reactive({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisLabel: {
        interval: 0,
      },
      axisTick: {
        alignWithLabel: true
      }
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Risk',
      type: 'bar',
      barWidth: '60%',
      data: [],
      itemStyle: {
        // color: graphic.LinearGradient(0, 0, 0, 1, [
        //   {offset: 0, color: 'rgba(0,161,160,0.5)'},
        //   {offset: 0.5, color: '#009ca7'},
        //   {offset: 1, color: '#00d5d3'}
        // ]),
        color: '#009ca7',
        shadowBlur: 10,
        shadowColor: 'rgba(5,5,5,0.5)',
        shadowOffsetY: 5,
      },
    }
  ]
});

for (const data of props.chartData) {
  chartOptions.xAxis[0].data.push(data.title)
  chartOptions.series[0].data.push(data.value)
}

</script>


<template>
  <BarChart :chart-options="chartOptions"/>
</template>

<style scoped>

</style>