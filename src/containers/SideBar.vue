<script setup>
import {useMenuStore} from "@/stores/menu.js";
import menuJson from "@/constants/menu.js";
import {getDirection} from "@/utils/index.js";
import {computed, onMounted, ref, nextTick, toRef, onBeforeMount, onBeforeUnmount} from "vue";
import {useLocaleStore} from "@/stores/locale.js";
import {useRouter} from "vue-router";
import {useStorage} from '@vueuse/core'
import {BREAKPOINT, toNavItemsDefaultValue, topNavItemsKey} from "@/constants/config.js";
import {useFilteredMenuItems} from "@/composables/filtered-menu-items.js";

const menu = useMenuStore()
const isRtl = computed(() => useLocaleStore().isRtl)
const router = useRouter()
const menuItems = toRef(menuJson)



const topNavItems = useStorage(topNavItemsKey, toNavItemsDefaultValue)

const collapse = ref()

function closeAccordions() {
  topNavItems.value = toNavItemsDefaultValue
  const elements = collapse.value.children
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].children[0].children[2]) {
      elements[i].children[0].children[0].checked = false
    }
  }
}

function findActiveRoute() {
  if (collapse.value) {
    const elements = collapse.value.children
    let elInput = null
    let elTitle = null
    let elContent = null
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].children[0].children[2]) {
        elInput = elements[i].children[0].children[0]
        elTitle = elements[i].children[0].children[1]
        elTitle.classList.remove('text-primary')
        elContent = elements[i].children[0].children[2]
        const dropdownElements = elContent.children[0]
        for (const liElements of dropdownElements.children) {
          const routerItems = liElements.children[0]
          routerItems.children[0].children[0].classList.remove('link-underline')
          if (routerItems.classList.contains('router-link-active')) {
            elTitle.classList.add('text-primary')
            routerItems.children[0].children[0].classList.add('link-underline')
            elInput.checked = true
          }
        }
      }
    }
  }

}

function setTopNavItem(items) {
  topNavItems.value = items
}

function toggleMenu(size) {
  const {innerWidth} = size.target
  menu.menuType = innerWidth > BREAKPOINT ? 'visible' : 'hidden';

}

function menuType() {
  menu.menuType = document.getElementById('app').clientWidth > BREAKPOINT ? 'visible' : 'hidden';
}

onBeforeMount(() => {
  menuType()
})
onMounted(() => {
  findActiveRoute()
  window.addEventListener("resize", toggleMenu)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', toggleMenu);
})
// Add event listener for route change
router.afterEach((to, from) => {
  nextTick(() => {
    findActiveRoute();
  })
});

</script>

<template>
  <div class="">
    <div class="bg-base-300 shadow-lg fixed bottom-0  top-[80px] w-64 overflow-auto transition-transform duration-300"
         :class="{'translate-x-0':menu.showMenu, '-translate-x-full':!menu.showMenu && !isRtl ,  'translate-x-full':!menu.showMenu && isRtl}">
      <ul ref="collapse">
        <li v-for="menuItem in useFilteredMenuItems(menuItems)" :key="menuItem.id">
          <template v-if="menuItem.subs  && menuItem.subs.length">
            <div class="collapse collapse-arrow  rounded-lg hover:bg-base-100" :id="`container-${menuItem.id}`">
              <input type="radio" name="my-accordion-1" :id="`my-accordion-${menuItem.id}`"/>
              <div class="collapse-title  flex items-center gap-2 rounded-lg hover:bg-base-100 ">
                <router-link :to="menuItem.to" class="flex gap-2 items-center ">
                  <div v-html="menuItem.icon"/>
                  <span>{{ $t(menuItem.label) }}</span>
                </router-link>
              </div>
              <div class="collapse-content">
                <!-- First Submenu -->
                <ul>
                  <li
                      v-for="subItem in useFilteredMenuItems(menuItem.subs)" :key="subItem.id">
                    <router-link class="px-4   flex justify-between items-center gap-2 group/child-item ms-5 relative"
                                 :to="subItem.to" @click="setTopNavItem(subItem)">
                      <div class="text-sm relative text-nowrap py-2"
                      >
                         <span :class="{'item-underline-animation':!isRtl,'item-underline-animation-rtl':isRtl}">
                            {{ $t(subItem.label) }}
                         </span>
                      </div>
                      <span class="w-2 h-2 mt-0.5  border-primary rotate  rotate-45  transition duration-300"
                            :class="{'border-t-2 border-r-2 group-hover/child-item:translate-x-2 ':!isRtl,
                              'border-b-2 border-l-2 group-hover/child-item:-translate-x-2':isRtl}"></span>

                    </router-link>
                  </li>
                </ul>
              </div>

            </div>
          </template>
          <!--No Dropdown          -->
          <template v-else>
            <div class="" @click="closeAccordions">
              <router-link
                  :to="menuItem.to" class="my-1  py-4 flex gap-2 items-center   rounded-lg hover:bg-base-100">
                <div v-html="menuItem.icon" class="ps-2 ms-2"/>
                <span>{{ $t(menuItem.label) }}</span>
              </router-link>
            </div>
          </template>


        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

</style>