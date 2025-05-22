<script setup>
import {computed, defineProps, defineEmits, ref} from 'vue';
import { useLocaleStore } from "@/stores/locale.js";

const props = defineProps({
  currentPage: Number,
  totalPages: Number,
  ellipses:{
    type :String,
    default: "...",
  },
  size:{
    type :String,
    default: "sm",
  },
  maxDisplayedPages:{
    type: Number,
    default: 7,
  },
  perPageList:{
    type:Array,
    default:[10,20,50,100]
  },
  typeStyle:{
    type: Number,
    default: 1,
  }
});

const isRtl = computed(() => useLocaleStore().isRtl);
const emit = defineEmits(['page-change']);
const increaseIcon = computed(() => isRtl?"»":"«")
const decreaseIcon = computed(() => isRtl?"«":"»")
const limit = ref(10)

const displayedPages = computed(() => {
  const pages = [];
  const leftRange = [1, 2];
  const rightRange = [props.totalPages - 1, props.totalPages];
  const currentRange = [];

  if (props.totalPages <= props.maxDisplayedPages) {
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Push adjacent pages to current page
    for (let i = Math.max(1, props.currentPage - 1); i <= Math.min(props.totalPages, props.currentPage + 1); i++) {
      currentRange.push(i);
    }

    // Add ellipses only before the jump
    if (currentRange[0] > leftRange[leftRange.length - 1] + 1) {
      pages.push(...leftRange, props.ellipses);
    } else {
      pages.push(...leftRange);
    }

    pages.push(...currentRange);

    if (currentRange[currentRange.length - 1] < rightRange[0] - 1) {
      pages.push(props.ellipses, ...rightRange);
    } else {
      pages.push(...rightRange);
    }
  }

  // Remove duplicates except for ellipses
  const uniquePages = [];
  pages.forEach(page => {
    if (page === props.ellipses || !uniquePages.includes(page)) {
      uniquePages.push(page);
    }
  });

  return uniquePages;
});

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= props.totalPages && props.currentPage!==newPage) {
    emit('page-change', newPage);
  }
};

</script>

<template>
  <!-- component -->
    <div :class="{'w-full flex items-center justify-center border-t border-primary-200':typeStyle===1}" >
      <div class="join">
          <button
              class="join-item btn"
              @click="changePage(currentPage - 1)"
              :class="{
                'btn-disabled':currentPage ===1,
                'btn-xs' :size ==='xs',
                'btn-sm' :size ==='sm',
                'btn-xl' :size ==='xl',
              }"
          >
            {{ decreaseIcon }}
          </button>
          <button
              v-for="page in displayedPages" :key="page"
              class="join-item btn font-medium"
              :class="{
                'btn-disabled':page ===ellipses ,
                'btn-primary text-white':(currentPage ===page),
                'btn-btn-secondary':!(currentPage ===page),
                'btn-xs' :size ==='xs',
                'btn-sm' :size ==='sm',
                'btn-xl' :size ==='xl',
              }"
              @click="changePage(page)"
          >
            {{page}}
          </button>
          <button
              class="join-item btn"
              @click="changePage(currentPage +1)"
              :class="{
                'btn-disabled':(currentPage ===totalPages)||(totalPages<2),
                'btn-xs' :size ==='xs',
                'btn-sm' :size ==='sm',
                'btn-xl' :size ==='xl',
              }"
          >
            {{ increaseIcon }}
          </button>
        </div>
    </div>
</template>

<style scoped>
</style>