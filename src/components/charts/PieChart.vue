<script setup>
import {onBeforeUnmount, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {use, init} from 'echarts/core'
import {
  PieChart
} from 'echarts/charts'
import {
  LegendComponent,
  ToolboxComponent
} from 'echarts/components'
import {
  CanvasRenderer
} from 'echarts/renderers'

import {useMenuStore} from "@/stores/menu.js";

const props = defineProps({
  chartOptions: {
    type: Object,
    required: true
  }
})

use([
  // LegendComponent,
  ToolboxComponent,
  PieChart,
  CanvasRenderer
]);

const menu = useMenuStore()
const pieChart = ref()
let myChart = null
function dispatchCustomResize() {
  const event = new CustomEvent('custom-resize');
  window.dispatchEvent(event);
  myChart.resize();
}

onMounted(() => {
  myChart = init(pieChart.value);
  myChart.setOption(props.chartOptions);
  window.addEventListener('resize', dispatchCustomResize);

})

watch(() => menu.menuType, (value) => {
  setTimeout(() => {
    dispatchCustomResize();
  }, 300)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', dispatchCustomResize);
})

onUnmounted(() => {
  myChart.clear();
  // myChart.dispose();
  // console.log(myChart.isDisposed())
})
</script>


<template>

  <div class=" ">
    <div ref="pieChart" style="width: 100%; height: 150px;"></div>
  </div>

</template>

<style scoped>

</style>