<script setup>
import defaultAvatar from "@/assets/images/avatar.png";
import BaseButton from "@/components/BaseButton.vue";
import ProfileLoading from "@/views/app/account/ProfileLoading.vue";
import BaseCard from "@/components/BaseCard.vue";
import {useUserStore} from "@/stores/user.js";
import {logout} from "@/composables/logout.js";
import router from "@/router/index.js";
import {storeToRefs} from "pinia";

const props = defineProps({
  currentTap: {type: String, default: null},
})
const userStore = useUserStore()
const user = userStore.currentUser
const {updateProcessing} = storeToRefs(userStore);

</script>

<template>
  <div>
    <BaseCard class="border-b border-gray:50">
      <ProfileLoading v-if="updateProcessing"/>
      <div class="px-3 py-5 lg:py-0 md:py-0 xl:py-0 intro-y box" v-else>
        <div class="flex flex-col lg:flex-row border-slate-200/60">
          <div>
            <div class="flex items-center flex-1 px-3 justify-start">
              <div
                  class="relative flex-none w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 image-fit"
              >
                <img
                    alt="User Profile Image"
                    class="rounded-full"
                    :src="user.avatar!=null?user.avatar:defaultAvatar"
                />
                <div
                    class="absolute bottom-0 right-0 flex items-center justify-center p-2 mb-1 mr-1 rounded-full bg-primary text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                       stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"/>
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"/>
                  </svg>
                </div>
              </div>
              <div class="ml-5">
                <div
                    class="w-24 text-lg font-medium truncate sm:w-40 sm:whitespace-normal"
                >
                  {{ user.name }}
                </div>
                <div class="text-slate-500">{{ user.email }}</div>
              </div>
            </div>
          </div>
          <div
              class="flex-1 px-3 pt-5 mt-6 border-t border-s lg:my-0  md:my-0  xl:my-0 border-slate-200/60 lg:border-t-0 lg:py-0 md:py-0 xl:py-0"
          >
            <div class="md:flex lg:flex xl:flex">
              <div
                  class="flex flex-col justify-center items-start "
              >
                <div class="flex items-center mt-3 truncate sm:whitespace-normal">
                  <div class="min-w-20 me-1 text-sm truncate">
                    {{ $t('form.first-name') }}
                  </div>
                  <span>
                  {{ user.first_name }}
                </span>
                </div>
                <div class="flex items-center mt-3 truncate sm:whitespace-normal">
                  <div class="min-w-20 me-1 text-sm truncate">
                    {{ $t('form.last-name') }}
                  </div>
                  <span>
                  {{ user.last_name }}
                </span>
                </div>
                <div class="flex items-center mt-3 truncate sm:whitespace-normal">
                  <div class="min-w-20 me-1 text-sm  ">
                    {{ $t('form.roles') }}
                  </div>
                  <div class="max-w-96">
                     <span class="text-xs">
                        {{ (user.roles.toString()).replaceAll(',', ', ') }}
                      </span>
                  </div>
                </div>
              </div>
              <div class="relative w-full mt-10 bottom-0 items-end justify-items-center">
                <div class="absolute bottom-0 lg:end-0 flex gap-2">
                  <BaseButton class="btn-outline" :class="{'btn-primary':currentTap==='edit'}" size="xs" @click="router.push({name: 'accountEdit'})">
                    <div class="flex">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                           stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                      </svg>
                      <span class="p-1">
                        {{ $t("button.edit") }}
                     </span>
                    </div>
                  </BaseButton>
                  <BaseButton class="btn-outline" :class="{'btn-primary':currentTap==='password'}" size="xs" @click="router.push({name: 'accountPassword'})">
                    <div class="flex">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                           stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/>
                      </svg>
                      <span class="p-1">
                        {{ $t("button.password") }}
                     </span>
                    </div>
                  </BaseButton>
                  <BaseButton class="btn-outline" :class="{'btn-primary':currentTap==='log'}" size="xs" @click="router.push({name: 'accountHistory'})">
                    <div class="flex">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                           stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"/>
                      </svg>
                      <span class="p-1">
                        {{ $t("button.log") }}
                     </span>
                    </div>
                  </BaseButton>
                  <BaseButton class="btn-outline"  size="xs" @click="logout">
                    <div class="flex">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                      </svg>
                      <span class="p-1">
                        {{ $t("button.sign-out") }}
                     </span>
                    </div>
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </BaseCard>

    <router-view/>
  </div>
</template>

<style scoped>

</style>