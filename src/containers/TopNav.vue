<script setup>

import Breadcrumb from "@/components/Breadcrumb.vue";
import {useRoute} from "vue-router";
import {onMounted, watch} from "vue";
import {useLocalStorage} from "@vueuse/core";
import {toNavItemsDefaultValue, topNavItemsKey} from "@/constants/config.js";
import {useFilteredMenuItems} from "@/composables/filtered-menu-items.js";
import menu from '@/constants/menu.js'

const menuItems = menu
const route = useRoute()

watch(route, (to, from) => {
  getTopNavItemsFromMenu()
})


const topNavItems = useLocalStorage(topNavItemsKey, {});

function routeExistsInMenu(route, items) {
  return items.some(item => item.to === route.path || (item.subs && routeExistsInMenu(route, item.subs)));
}

function getTopNavItemsFromMenu() {
  if (!routeExistsInMenu(route, menuItems)) {
    topNavItems.value = toNavItemsDefaultValue
    return;
  }
  const {matched} = route;
  const parentPath = matched[matched.length - 2]?.path;
  if (!parentPath) return;

  for (const menu of menuItems) {
    if (!menu.subs) continue;
    for (const firstSubMenu of menu.subs) {
      if (firstSubMenu.subs && firstSubMenu.to === parentPath) {
        topNavItems.value = firstSubMenu;
        return;
      }
    }
  }
}
getTopNavItemsFromMenu()

function handleClick() {
  const elem = document.activeElement;
  if (elem) {
    elem?.blur();
  }
}
</script>

<template>
  <div
      class="flex justify-between items-center z-10 sticky top-20 bg-base-300 shadow-xl rounded-b-md ps-2 mt-24 mb-4 h-[44px]">
    <Breadcrumb/>
    <Transition name="slide-fade" mode="out-in">
      <ul class="menu menu-xs hidden xl:flex menu-horizontal bg-base-200 text-base-content  rounded-b-md"
          v-if="topNavItems && topNavItems.subs && topNavItems.subs.length">
        <li v-for="item in useFilteredMenuItems(topNavItems.subs)" :key="item.id">
          <RouterLink :to="item.to">
            <span v-html="item.icon"/>
            {{ $t(item.label) }}
          </RouterLink>
        </li>


      </ul>
    </Transition>
    <Transition name="slide-fade" mode="out-in">
      <div class="dropdown  dropdown-end block xl:hidden "
           v-if="topNavItems && topNavItems.subs && topNavItems.subs.length">
        <div tabindex="0" role="button" class="flex justify-center items-center bg-base-200 h-[44px] rounded-b-md px-2">
          <span class="text-sm"> Pages </span>
        </div>
        <ul tabindex="0"
            class="dropdown-content menu p-2 shadow bg-base-200 rounded-box  ">
          <li v-for="item in useFilteredMenuItems(topNavItems.subs)" class="flex flex-row   "
              @click="handleClick">
            <router-link class="text-nowrap flex text-xs  items-center " :to="item.to">
              <span v-html="item.icon" class="  mb-5 h-1 w-5"/>
              {{ $t(item.label) }}
            </router-link>
          </li>
        </ul>
      </div>
    </Transition>
  </div>

</template>

<style scoped>

</style>