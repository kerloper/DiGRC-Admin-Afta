<script setup>

import {ref, watch} from "vue";
import BaseTable from "@/components/table/BaseTable.vue";
import {useI18n} from "vue-i18n";
import API from "@/services/API.js";
import BaseCard from "@/components/BaseCard.vue";
import BasePagination from "@/components/table/BasePagination.vue";
import BaseButton from "@/components/BaseButton.vue";
import PerPage from "@/components/table/PerPage.vue";
import {scollToTop} from "@/composables/scoll-to-top.js";
import Modal from "@/components/Modal.vue";
import {useUserStore} from "@/stores/user.js";
import {listSetting} from "@/constants/config.js";

const {t: $t} = useI18n()
const notificationListProcessing = ref(false)
const notificationProcessing = ref(false)
const fetchError = ref(false)
const currentNotificationList = ref([])
const limit = ref(10)
const page = ref(1)
const currentNotification = ref({})
const defaultNotification = {}
const tableHeaders = [
  {label: "table.#", key: "counter"},
  {label: "table.title", key: "title"},
  {label: "table.body", key: "body"},
  {label: "table.time-created", key: "time_create_view"},
  {label: "table.module", key: "module"},
  {label: "table.section", key: "section"},
  {label: "table.view", key: "viewed"},
  {label: "table.action",
    key: "action"}
]
const pageOptions = ref({
  limit: listSetting.limit,
  page: 1,
  count: 0,
  totalPage: 1,
})
const updateNotificationLoadingFlag = ref(false)
const showNotificationFlag = ref(false)
const {scrollToTop} = scollToTop()
const handlePageChange = (newPage) => {
  pageOptions.value.page = newPage
  listNotificationRequest()
  scrollToTop()
};
const onLimitChange = (newLimit) => {
  pageOptions.value.page = 1
  pageOptions.value.limit  = newLimit.value
  listNotificationRequest()
  scrollToTop()
}

const user = useUserStore()

function setNotificationListProcessing(payload) {
  notificationListProcessing.value = payload
  fetchError.value = null
}

function clearFetchError() {
  fetchError.value = null
}

function setFetchError(payload) {
  fetchError.value = payload
  currentNotificationList.value = []
  Object.assign(currentNotification.value, defaultNotification);
  notificationProcessing.value = false
  notificationListProcessing.value = false
}

function setNotificationList(payload) {
  currentNotificationList.value = payload
  notificationListProcessing.value = false
  fetchError.value = null
}

async function listNotificationRequest() {
  clearFetchError()
  setNotificationListProcessing(true)
  const {data, error} = await API.listNotificationRequest({...pageOptions.value})
  if (data.value) {
    await user.requestNotificationCount();
    pageOptions.value = data.value.data.paginator
    pageOptions.value.totalPage = Math.ceil(pageOptions.value.count / pageOptions.value.limit)
    setNotificationList(data.value.data.list)
  } else if (error.value) {
    setFetchError(error.value)
  }
  setNotificationListProcessing(false)
}

async function updateStatusNotificationRequest() {
  if (currentNotification.value == null) {
    return
  }
  setNotificationListProcessing(true)
  const {data, error} = await API.updateNotificationRequest({id: currentNotification.value.id,viewed:1})
  if (data.value) {
    await listNotificationRequest();
  } else if (error.value) {
    ///TODO:set alert for error in delete notification
    await listNotificationRequest();
  }
}

function showNotificationDialog(notification) {
  Object.assign(currentNotification.value, notification);
  showNotificationFlag.value = true
  const modal = document.getElementById('show_notification_modal');
  modal.showModal();
}

function closeViewModal() {
  showNotificationFlag.value = false
  const modal = document.getElementById('show_notification_modal');
  modal.close();
}

listNotificationRequest()

watch(showNotificationFlag, (value) => {
  if (!value) {
    updateStatusNotificationRequest()
  }
})

</script>

<template>
  <div>

    <!--  modal of show show notification  -->
    <Modal
        :title="`${currentNotification?currentNotification.title??'':''}`"
        id="show_notification_modal"
        v-if="currentNotification"
        @close="closeViewModal"
    >
      <div class="gap-2">
        <p class="font-normal">
          {{ currentNotification.body }}
        </p>

        <div class="py-[6px]" v-if="updateNotificationLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-between mt-3" v-else>
          <div class="flex gap-2">

          </div>
          <div class="flex gap-2">
            <BaseButton class="btn-outline btn-primary" size="xs" @click="closeViewModal" type="button">
              {{ $t('button.close') }}
            </BaseButton>
          </div>
        </div>

      </div>
    </Modal>

    <BaseCard>
      <div class="flex justify-between border-b-2 pb-2">
        <div>
          <PerPage
              class="w-64"
              :totalCount="pageOptions.count"
              :currentPage="pageOptions.page"
              :totalPages="pageOptions.totalPage"
              @limit-change="onLimitChange"
          />
        </div>
        <div class="flex gap-2">
        </div>
      </div>
      <div class="min-card-height-table">
        <BaseTable
            :data="currentNotificationList"
            :is-loading="notificationListProcessing"
            :headers="tableHeaders"
        >
          <template v-slot:cell(counter)="{data}">
            <div class="flex gap-2">
              {{ (data.index + 1) + ((page - 1) * limit) }}
            </div>
          </template>
          <template v-slot:cell(module)="{data,index}">
            <div class="flex gap-2">
              {{ data.item.source?.module }}
            </div>
          </template>
          <template v-slot:cell(section)="{data,index}">
            <div class="flex gap-2">
              {{ data.item.source?.section }}
            </div>
          </template>
          <template v-slot:cell(viewed)="{data,index}">
            <BaseButton
                class="w-20 btn-xs text-xs btn-outline"
                size="xs"
                :class="{'btn-success':!(data.item.viewed===1),'':(data.item.viewed===1)}"
            >
               <span class="text-xs font-medium">
                {{ data.item.viewed === 1 ? $t('table.seen') : $t('table.unseen') }}
               </span>
            </BaseButton>
          </template>
          <template v-slot:cell(action)="{data,index}">
            <div class="flex gap-2">
              <BaseButton
                  size="xs"
                  class="bg-gray-600 hover:bg-gray-800 text-white tooltip"
                  @click="showNotificationDialog(data.item)"
                  :data-tip="$t('tooltip.view')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                </svg>
              </BaseButton>
            </div>
          </template>
        </BaseTable>
      </div>
      <template v-slot:actions>
        <BasePagination
            class="w-full md:max-w-[100%] lg:max-w-[100%] py-6"
            :currentPage="pageOptions.page"
            :totalPages="pageOptions.totalPage"
            @page-change="handlePageChange"
        />
      </template>

    </BaseCard>


  </div>
</template>

<style scoped>

</style>