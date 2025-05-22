<script setup>
import defaultAvatar from "@/assets/images/avatar.png";
import {getDirection} from "@/utils/index.js";
import {defaultTheme, localeOptions, themeSelectedColorStorageKey} from "@/constants/config.js";
import DropDown from "@/components/DropDown.vue";
import {useMenuStore} from "@/stores/menu.js";
import {useLocaleStore} from "@/stores/locale.js";
import router from "@/router/index.js";
import {useStorage} from "@vueuse/core";
import {useI18n} from "vue-i18n";
import {useUserStore} from "@/stores/user.js";
import {logout} from "@/composables/logout.js";
import {inject} from "vue";
import PanelSwicher from "@/containers/PanelSwicher.vue";
const refresher = inject('refresher');

const theme = useStorage(themeSelectedColorStorageKey, defaultTheme)

const userStore = useUserStore()
const user = userStore.currentUser

document.querySelector('html').setAttribute('data-theme', theme.value)

function changeTheme(va) {
  if (theme.value === defaultTheme) {
    theme.value = 'dim'
  } else {
    theme.value = defaultTheme
  }
  document.querySelector('html').setAttribute('data-theme', theme.value)

}

const menu = useMenuStore()

function toggleSideBar() {
  menu.changeMenuType()
}

const localeStore = useLocaleStore()

function changeLocale(value) {
  const {id: locale, direction} = value
  const currentDirection = getDirection().direction;
  if (direction !== currentDirection) {
    localeStore.changeDirection(direction)
  }
  localeStore.changeLang(locale)
}

const {t: $t} = useI18n()

const profileOptions = [
  {name: $t('user.profile')},
  {name: $t('user.sign-out')}
]

function selectedProfileOption(value) {
  switch (value.name) {
    case $t('user.sign-out'):
      logout();
      break
    case $t('user.profile'):
      router.push({name: "accountProfile"})
      break
  }
}

function goToNotificationList() {
  router.push({name: "accountNotification"})
}

userStore.requestNotificationCount();

</script>

<template>
  <header class="navbar fixed z-50 h-20 bg-base-300 shadow-lg">
    <div class="navbar-start">
      <button class="btn btn-square btn-ghost" @click="toggleSideBar">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
             class="inline-block w-5 h-5 stroke-current" :class="{'text-base-content/70':!menu.showMenu}">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </div>
    <div class="navbar-center">
      <a class="flex justify-center text-xl cursor-pointer" href="/">
        <img alt="DiGRC Logo" src="../assets/logos/logo.png" class="w-20 fixed top-0.5 md:hidden"/>
        <img alt="DiGRC Logo" src="../assets/logos/logo-large.png" class="w-60 fixed top-2 hidden md:inline-block "/>
      </a>
    </div>
    <div class="navbar-end gap-3">


      <PanelSwicher/>

      <div class=" relative cursor-pointer" @click="goToNotificationList()">
        <div class="bg-primary rounded-full absolute w-4 h-4 text-xs font-semibold -end-1 text-white text-center"
             v-if="userStore.notificationCount.unread">
          <span>
            {{ userStore.notificationCount.unread }}
          </span>
        </div>

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
             class="w-7 h-7">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"/>
        </svg>

      </div>

      <label class="swap swap-rotate">

        <!-- this hidden checkbox controls the state -->
        <input type="checkbox" @click="changeTheme" class="theme-controller" :value="theme" :checked="theme === 'dim'"/>

        <!-- sun icon -->
        <svg class="swap-off fill-current w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
              d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
        </svg>
        <!-- moon icon -->
        <svg class="swap-on fill-current w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
              d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
        </svg>
      </label>
      <DropDown :options="localeOptions" display-property="name" size="sm" @selected-option="changeLocale">
        {{ $i18n.locale.toUpperCase() }}
      </DropDown>
      <DropDown :options="profileOptions" class="dropdown-end pe-2 " no-padding content-width="w-52"
                display-property="name" no-btn :show-down-icon="false"
                @selected-option="selectedProfileOption">
        <div class="w-8 rounded-full">
          <img alt="User Profile Image"
               class="w-8 h-8 rounded-full"
               :src="(user.information?.avatar_params?.uri['512']!=null?user.avatar:defaultAvatar)+'?rand='+refresher"
          />
        </div>
      </DropDown>
    </div>
  </header>
</template>

<style scoped>

</style>