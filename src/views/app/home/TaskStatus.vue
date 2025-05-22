<script setup>

import PieChart from "@/components/charts/PieChart.vue";
import {reactive, toRef, watch} from "vue";
import {useI18n} from "vue-i18n";
import {getThemeColor} from "@/utils/index.js";
import {useStorage} from "@vueuse/core";

const props = defineProps({
  chartData: Object
})
const {t: $t} = useI18n()

const chartOptions = reactive({
  tooltip: {
    trigger: 'item',
  },
  series: [
    {
      name: $t('home.maturity-status'),
      type: 'pie',
      radius: [15, 70],
      center: ['50%', '50%'],
      roseType: 'area',
      color: ["#009ca7", "#00d5d3","#62EFBD", "#00b624", "#18a40e"],
      label: {
        color: '#707070'
      },
      itemStyle: {
        borderRadius: 8,
      },

      data: []

    }
  ]
})

for (const chartOptionsKey in props.chartData) {
  const name = chartOptionsKey.split('_') // Split by underscores
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(' ')
  chartOptions.series[0].data.push({
    value: props.chartData[chartOptionsKey],
    name: name
  })
}

</script>

<template>
  <PieChart :chart-options="chartOptions"/>
</template>

<style scoped>

</style>