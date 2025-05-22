<script setup>
// import function to register Swiper custom elements
import {Swiper, SwiperSlide} from 'swiper/vue';
// Import Swiper styles
import 'swiper/css';

import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import {FreeMode, Pagination, Autoplay} from "swiper/modules";

import BaseButton from "@/components/BaseButton.vue";
// register Swiper custom elements
const modules = [FreeMode, Pagination, Autoplay]

const props = defineProps({
  frameworkList: Array
})

</script>

<template>

  <div class="h-full">

    <Swiper
        :slidesPerView="2.6"
        :spaceBetween="30"
        :centered-slides="frameworkList.length === 0"
        :autoplay="{
      delay: 2500,
      disableOnInteraction: false,
    }"
        :freeMode="true"
        :pagination="{
      clickable: true,
    }"
        :modules="modules"
        class="h-full w-full flex"
    >

      <swiper-slide v-for="framework in frameworkList">
        <div class="flex flex-col gap-4 items-center my-6">
          <img alt="active framework image" :src="framework.circle_image" class="h-40"/>
          <h6 class="text-nowrap">{{ framework.title }}</h6>
        </div>
      </swiper-slide>
    </Swiper>
  </div>
</template>

<style scoped>
.swiper {
  padding-bottom: 30px !important;
}

:deep(.swiper-pagination-bullet-active){
  background: #009ca7 !important;
}
</style>