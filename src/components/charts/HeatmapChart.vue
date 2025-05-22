<script setup>
import {onBeforeUnmount, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {use, init} from 'echarts/core'
import {HeatmapChart} from "echarts/charts";
import {
  TooltipComponent,
  GridComponent, VisualMapComponent
} from 'echarts/components';
import {LabelLayout, UniversalTransition} from 'echarts/features';

// Import the Canvas renderer
// Note that including the CanvasRenderer or SVGRenderer is a required step
import {CanvasRenderer} from 'echarts/renderers';
import {useMenuStore} from "@/stores/menu.js";

const props = defineProps({
  chartOptions: {
    type: Object,
    required: true
  }
})

use([
  TooltipComponent,
  GridComponent,
  VisualMapComponent,
  HeatmapChart,
  CanvasRenderer
]);
const menu = useMenuStore()
const heatmapChart = ref()
let myChart = null

function dispatchCustomResize() {
  const event = new CustomEvent('custom-resize');
  window.dispatchEvent(event);
  myChart.resize();
}

onMounted(() => {
  myChart = init(heatmapChart.value);
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

  <div >
    <div ref="heatmapChart" style="width: 100%; height: 350px;"></div>
  </div>

</template>

<style scoped>

</style>