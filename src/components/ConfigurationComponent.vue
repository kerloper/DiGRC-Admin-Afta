<script setup>

import {useUserStore} from "@/stores/user.js";
import {computed} from "vue";
import {useI18n} from "vue-i18n";

const {t: $t} = useI18n()
const userStore = useUserStore()
const security = (computed(() => userStore.currentSecurityInformation))
const log = (computed(() => userStore.currentLogInformation))

function closeSecurityAlert(checking) {
  console.log(checking)
  security.value[checking?.table].seen = true
}

function closeLogAlert(checking) {
  log.value.seen = true
}
</script>

<template>
  <div class="grid grid-cols-1 ">

    <!-- manage log repository section   -->
    <div v-if="log.data">
      <div class="px-4 py-3 text-sm mb-2 rounded relative min-h-16" role="alert"
           v-if="!log.seen "
           :class="{
               'skeleton-border skeleton bg-base-500 border border-base-700':log.isFetching ,
               'bg-red-50 text-gray-700 border border-red-300':!log.isFetching&&log.data.alert ==='danger',
               'bg-yellow-50 text-gray-700 border border-yellow-300':!log.isFetching && log.data.alert ==='warning',
               'bg-green-50 text-gray-700 border border-green-300':!log.isFetching && log.data.alert ==='success'
             }"
      >
        <div v-if="log.isFetching">
          <strong class="font-bold">
          </strong>
          <div class="block sm:inline">
              <span>
            {{ $t("log-storage.title") }}
              </span>
          </div>
        </div>
        <div v-else>
          <strong class="font-bold">
            {{ $t("log-storage.title") }}
          </strong>
          <div class="block sm:inline">
            <div>
              {{
                $t(`log-storage.${log.data.alert}`, {
                  percentage: log.data.percentage,
                  rowsToDelete: log.data.rows_to_delete
                })
              }}
            </div>
          </div>
        </div>

        <span class="absolute top-0 bottom-0 end-0 px-4 py-3" @click="closeLogAlert(log)" v-if="!log.isFetching">
            <svg class="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path
                  d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
      </div>

    </div>

    <!-- security sections   -->
    <div v-for="checking in security" :key="checking.table">
      <div class="px-4 py-3 mb-2 text-sm rounded relative min-h-16" role="alert"
           v-if="!checking.seen "
           :class="{
               'skeleton-border skeleton bg-base-500 border border-base-700':checking.isFetching ,
               'bg-red-50 text-gray-700 border border-red-300':!checking?.isFetching&&checking?.unverified >0 ,
               'bg-green-50 text-gray-700 border border-green-300':!checking?.isFetching && checking.unverified ===0
             }"
      >
        <div v-if="checking.isFetching">
          <strong class="font-bold">
          </strong>
          <div class="block sm:inline">
              <span>
                {{ $t("message.security-status") }} {{ checking.table }}</span>
          </div>
        </div>
        <div v-else>
          <strong class="font-bold">
            {{ checking.table }}
          </strong>
          <div class="block sm:inline" v-if="checking.unverified >0 ">
            <div>
              {{
                $t(`message.security-unauthorized`, {
                  total: checking.total,
                  verified: checking.verified,
                  unverified: checking.unverified,
                })
              }}
            </div>
            <details class="collapse cursor-pointer">
              <summary class="p-1">
                {{ $t("title.more") }} ...
              </summary>
              <div class="collapse-content">
                <div class="w-full overflow-ellipsis truncate">
                  {{ checking.list.join(', ') }}
                </div>
              </div>
            </details>
          </div>
          <div class="block sm:inline" v-else>
            <div>
              {{
                $t(`message.security-secure`, {
                  total: checking.total,
                })
              }}
            </div>
          </div>
        </div>
        <span class="absolute top-0 bottom-0 end-0 px-4 py-3" @click="closeSecurityAlert(checking)"
              v-if="!checking.isFetching">
            <svg class="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path
                  d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>