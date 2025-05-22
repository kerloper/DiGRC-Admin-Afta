<script setup>

import BaseTable from "@/components/table/BaseTable.vue";
import {ref} from "vue";
import BasePagination from "@/components/table/BasePagination.vue";
import {useI18n} from "vue-i18n";
import API from "@/services/API.js";
import {scollToTop} from "@/composables/scoll-to-top.js";
import BaseCard from "@/components/BaseCard.vue";
import {listSetting} from "@/constants/config.js";

const props = defineProps({
  showLogHistoryModalFlag: Boolean,
  currentUser: Object,
  modalId: {
    type: String,
    default: "profile_log_history_modal",
  },
});

const emit = defineEmits(['close']);
const {t: $t} = useI18n()
const userLogListProcessing = ref(false)
const userProcessing = ref(false)
const fetchError = ref(false)
const currentProfileLogList = ref([])
const tableHeaders = [
  {label: "table.user-id", key: "user_id"},
  {label: "table.name", key: "user_name"},
  {label: "table.email", key: "user_email"},
  {label: "table.state", key: "state"},
  {label: "table.operator", key: "operator"},
  {label: "table.method", key: "method"},
  {label: "table.ip", key: "ip"},
  {label: "table.created-at", key: "time_create_view"},
]
const pageOptions = ref({
  limit: listSetting.limit,
  page: 1,
  count: 0,
  totalPage: 1,
})
const {scrollToTop} = scollToTop()
const handlePageChange = (newPage) => {
  pageOptions.value.page = newPage
  listProfileLogRequest()
  scrollToTop()
};
const onLimitChange = (newLimit) => {
  pageOptions.value.page = 1
  pageOptions.value.page = newLimit
  listProfileLogRequest()
  scrollToTop()
};

function setProfileLogListProcessing(payload) {
  userLogListProcessing.value = payload
  fetchError.value = null
}

function clearFetchError() {
  fetchError.value = null
}

function setFetchError(payload) {
  fetchError.value = payload
  currentProfileLogList.value = []
  userProcessing.value = false
  userLogListProcessing.value = false
}

function setProfileLogList(payload) {
  currentProfileLogList.value = payload
  userLogListProcessing.value = false
  fetchError.value = null
}

async function listProfileLogRequest() {
  clearFetchError()
  setProfileLogListProcessing(true)
  const {data, error} = await API.profileHistoryRequest({...pageOptions.value})
  if (data.value) {
    pageOptions.value = data.value.data.paginator
    pageOptions.value.totalPage = Math.ceil(pageOptions.value.count / pageOptions.value.limit)
    setProfileLogList(data.value.data.list)
  } else if (error.value) {
    setFetchError(error.value)
  }
  setProfileLogListProcessing(false)
}

listProfileLogRequest()
</script>

<template>
  <section>
    <BaseCard>
      <div class="pt-2">
        <div class="min-h-96 overflow-auto">
          <BaseTable
              class="w-full"
              :is-loading="userLogListProcessing"
              :data="currentProfileLogList"
              :headers="tableHeaders"
          >
            <template v-slot:cell(user_name)="{data,index}">
              <div class="flex gap-2">
                {{ data.item.user_name ?? '-' }}
              </div>
            </template>
            <template v-slot:cell(user_email)="{data,index}">
              <div class="flex gap-2">
                {{ data.item.user_email ?? '-' }}
              </div>
            </template>
            <template v-slot:cell(operator)="{data,index}">
              <div class="flex gap-2">
                {{ data.item.information.operator ? data.item.information.operator.name : '-' }}
              </div>
            </template>

            <template v-slot:cell(method)="{data,index}">
              <div class="flex gap-2">
                {{ data.item.information.method ?? '-' }}
              </div>
            </template>
            <template v-slot:cell(ip)="{data,index}">
              <div class="flex gap-2">
                {{ data.item.information.ip }}
              </div>
            </template>
          </BaseTable>
        </div>
        <div class="flex ">
          <div class="w-full grid grid-cols-2">
            <div class="justify-start relative pt-4">
              <BasePagination
                  class="ms-0 w-full"
                  :size="'xs'"
                  v-if="pageOptions.totalPage>1"
                  :typeStyle="2"
                  :currentPage="pageOptions.page"
                  :totalPages="pageOptions.totalPage"
                  @page-change="handlePageChange"
              />
            </div>
          </div>
          <div class="pt-3">
          </div>
        </div>
      </div>
    </BaseCard>
  </section>
</template>

<style scoped>

</style>