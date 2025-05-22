<script setup>
import {getDirection} from "@/utils/index.js";
import {onBeforeMount} from "vue";
import { provide, ref } from 'vue';

onBeforeMount(() => {
  document.querySelector('html').style.direction = getDirection().direction

  if (getDirection().isRtl) {
    document.body.classList.add("rtl");
    document.body.classList.add('font-rtl')
    document.dir = "rtl";
    document.body.classList.remove("ltr");
    document.body.classList.remove("font-ltr");
  } else {
    document.body.classList.add("ltr");
    document.body.classList.add('font-ltr')
    document.dir = "ltr";
    document.body.classList.remove("rtl");
    document.body.classList.remove("font-rtl");

  }
})

const refresher = ref(Math.random());
function refreshGlobalValue() {
  refresher.value = Math.random(); // Update the refresher value
}
provide('refresher', refresher);
provide('refreshGlobalValue', refreshGlobalValue);
</script>

<template>
  <div>
    <RouterView/>
  </div>
</template>

<style scoped lang="scss">

</style>
