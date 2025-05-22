<script setup>
import SideBar from "@/containers/SideBar.vue";
import TheHeader from "@/containers/TheHeader.vue";
import TheFooter from "@/containers/TheFooter.vue";
import {useMenuStore} from "@/stores/menu.js";
import {computed} from "vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import TopNav from "@/containers/TopNav.vue";
import ProfileLogHistoryModal from "@/components/log/ProfileLogHistoryModal.vue";
import {useUserStore} from "@/stores/user.js";

const menu = useMenuStore()
const userStore = useUserStore()

</script>

<template>
  <div class="min-h-screen flex flex-col">
    <TheHeader/>
    <SideBar></SideBar>
    <main class="h-full mb-4">
      <div class="transition-all mx-auto mt-20 duration-300 px-4" :class="{'ps-[17rem]':menu.showMenu,'':!menu.showMenu}">
        <TopNav/>
<!--        <ProfileLogHistoryModal v-if="userStore.showLog" />-->
        <slot></slot>
      </div>
    </main>
    <TheFooter class="mt-auto"/>
  </div>
</template>

<style scoped>

</style>