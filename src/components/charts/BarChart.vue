<script setup>
import {onBeforeUnmount, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {use, init} from 'echarts/core'
import {BarChart} from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
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
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);
const menu = useMenuStore()
const barChart = ref()
let myChart = null

function dispatchCustomResize() {
  const event = new CustomEvent('custom-resize');
  window.dispatchEvent(event);
  myChart.resize();
}

onMounted(() => {
  myChart = init(barChart.value);
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
})
</script>


<template>

  <div class="overflow-hidden">
    <div ref="barChart" style="width: 100%; height: 200px;"></div>
  </div>

</template>

<style scoped>

</style>