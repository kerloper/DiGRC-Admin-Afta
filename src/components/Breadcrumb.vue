<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {useLocaleStore} from "@/stores/locale.js";
import {useRoute, useRouter} from "vue-router";
import {adminRoot} from "@/constants/config.js";
import {useI18n} from "vue-i18n";

const isRtl = computed(() => useLocaleStore().isRtl)
const route = useRoute()
const router = useRouter()

function getUrl(path, sub, index) {
  return "/" + path.split(sub)[0] + sub;
}

const items = ref([])

function generateItems() {
  items.value = []
  let path = route.path.substr(1);
  let rawPaths = path.split("/");

  for (const pName in route.params) {
    if (rawPaths.includes(route.params[pName])) {
      rawPaths = rawPaths.filter(x => x !== route.params[pName]);
    }
  }
  rawPaths.map((sub, index) => {
    items.value.push({
      text: sub,
      to: getUrl(path, sub, index)
    });
  });
}

function goTo(path) {
  router.push(path)
}

watch(route, (value) => {
  generateItems()
})
onMounted(() => {
  generateItems()
})
</script>

<template>
  <div class="invisible md:visible text-sm breadcrumbs overflow-hidden">
    <ul>
      <!--      <TransitionGroup name="slide-fade">-->
      <li v-for="(item,index) in items" :key="item.text"
          :class="{'breadcrumb-rtl':isRtl,'before:invisible':index === 0}">
        <span v-if="index + 1 === items.length" class="text-base-content/50">{{ $t(`menu.${item.text}`) }}</span>
        <p v-else class="transition duration-300 hover:text-primary cursor-pointer" @click="goTo(item.to)">
          {{ $t(`menu.${item.text}`) }}</p>
      </li>
      <!--      </TransitionGroup>-->
    </ul>
  </div>
</template>

<style scoped>
.breadcrumb-rtl:before {
  border-bottom: 1px solid !important;
  border-top: 0 !important;
  border-left: 1px solid !important;
  border-right: 0 !important;
}


</style>