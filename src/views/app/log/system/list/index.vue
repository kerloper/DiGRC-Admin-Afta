<script setup>

import {ref} from "vue";
import BaseTable from "@/components/table/BaseTable.vue";
import {useI18n} from "vue-i18n";
import API from "@/services/API.js";
import BaseCard from "@/components/BaseCard.vue";
import PerPage from "@/components/table/PerPage.vue";
import BasePagination from "@/components/table/BasePagination.vue";
import BaseButton from "@/components/BaseButton.vue";
import Modal from "@/components/Modal.vue";
import FilterInventoryModal from "@/views/app/log/system/list/FilterInventoryModal.vue";
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import {scollToTop} from "@/composables/scoll-to-top.js";
import cleaner from "@/composables/clean-object.js";
import {listSetting} from "@/constants/config.js";

const {t: $t} = useI18n()
const inventoryListProcessing = ref(false)
const inventoryProcessing = ref(false)
const fetchError = ref(false)
const currentInventoryList = ref([])
//for handle validation error in filter inventory list
const filterInventoryModalId = 'filter_inventory_modal'
const showFilterInventoryModalFlag = ref(false)
const filterInventoryLoadingFlag = ref(false)
const showDataModalFlag = ref(false)
const currentLog = ref({})
const filterDataDefault = {
  "user_id": null,
  "identity": null,
  "name": null,
  "email": null,
  "mobile": null,
  "state": null,
  "method": null,
  "ip": null,
  "target": null,
  "module": null,
  "section": null,
  "package": null,
  "handler": null,
  "permissions": null,
  "company_id": null,
  "priority": null,
  "priority_name": null,
  "message": null,
  "data_from": null,
  "data_to": null,

}
const filterData = ref({
  "user_id": null,
  "identity": null,
  "name": null,
  "email": null,
  "mobile": null,
  "state": null,
  "method": null,
  "ip": null,
  "target": null,
  "module": null,
  "section": null,
  "package": null,
  "handler": null,
  "permissions": null,
  "company_id": null,
  "priority": null,
  "priority_name": null,
  "message": null,
  "data_from": null,
  "data_to": null,
})
const filterDataTemp = ref({
  "user_id": null,
  "identity": null,
  "name": null,
  "email": null,
  "mobile": null,
  "state": null,
  "method": null,
  "ip": null,
  "target": null,
  "module": null,
  "section": null,
  "package": null,
  "handler": null,
  "permissions": null,
  "company_id": null,
  "priority": null,
  "priority_name": null,
  "message": null,
  "data_from": null,
  "data_to": null,
})
const tableHeaders = [
  {label: "table.id", key: "id"},
  {label: "table.user-id", key: "user_id"},
  {label: "table.name", key: "user_name"},
  {label: "table.email", key: "user_email"},
  {label: "table.company", key: "company_title"},
  {label: "table.ip", key: "ip"},
  // {label: "table.priority", key: "priority_name"},
  {label: "table.level", key: "level"},
  {label: "table.message", key: "message"},
  // {label: "table.method", key: "method"},
  // {label: "table.section", key: "section"},
  // {label: "table.module", key: "module"},
  // {label: "table.package", key: "package"},
  // {label: "table.handler", key: "handler"},
  {label: "table.created-at", key: "time_create_view"},
  {label: "table.action", key: "action"},
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
  listInventoryRequest()
  scrollToTop()
};
const onLimitChange = (newLimit) => {
  pageOptions.value.page = 1
  pageOptions.value.limit = newLimit.value
  listInventoryRequest()
  scrollToTop()
};

function setInventoryListProcessing(payload) {
  inventoryListProcessing.value = payload
  fetchError.value = null
}

function clearFetchError() {
  fetchError.value = null
}

function setFetchError(payload) {
  fetchError.value = payload
  currentInventoryList.value = []
  inventoryProcessing.value = false
  inventoryListProcessing.value = false
}

function setInventoryList(payload) {
  currentInventoryList.value = payload
  inventoryListProcessing.value = false
  fetchError.value = null
}

async function listInventoryRequest() {
  clearFetchError()
  setInventoryListProcessing(true)
  const {data, error} = await API.listInventoryLogRequest({...pageOptions.value, ...cleaner(filterData.value)})
  if (data.value) {
    pageOptions.value = data.value.data.paginator
    pageOptions.value.totalPage = Math.ceil(pageOptions.value.count / pageOptions.value.limit)
    Object.assign(filterData.value, filterDataTemp.value)
    setInventoryList(data.value.data.list)
    //if list api call from filter modal
    if (showFilterInventoryModalFlag.value) {
      const modal = document.getElementById(filterInventoryModalId)
      modal.close()
    }
  } else if (error.value) {
    setFetchError(error.value)
  }
  setInventoryListProcessing(false)
  filterInventoryLoadingFlag.value = false
}

///start filter inventory list
function showFilterInventoryModal() {
  Object.assign(filterDataTemp.value, filterData.value)
  showFilterInventoryModalFlag.value = true
  const modal = document.getElementById(filterInventoryModalId);
  modal.showModal();
}

function resetFilterInventoryData() {
  showFilterInventoryModalFlag.value = false
  filterInventoryLoadingFlag.value = false
  const modal = document.getElementById(filterInventoryModalId)
  modal.close()
}

function onSubmitFilterInventory() {
  pageOptions.value.page = 1
  Object.assign(filterData.value, filterDataTemp.value)
  filterInventoryLoadingFlag.value = true
  listInventoryRequest()
}

function removeFilterData() {
  pageOptions.value.page = 1
  Object.assign(filterData.value, filterDataDefault)
  Object.assign(filterDataTemp.value, filterDataDefault)
  filterInventoryLoadingFlag.value = true
  listInventoryRequest()
}

function showDataModal(data) {
  Object.assign(currentLog.value, data)
  showDataModalFlag.value = true
  const modal = document.getElementById('log_data_modal');
  modal.showModal();
}

function resetCurrentData() {
  currentLog.value = {}
}

listInventoryRequest()

const getRowClass = (item) => {
  console.log(item.level)
  if (item.level === 'error') return 'bg-red-100';  // Light red
  if (item.level === 'warning') return 'bg-yellow-100';  // Light yellow
  if (item.level === 'notice') return 'bg-yellow-100';  // Light yellow
  return ''; // Default (no extra styling)
};
</script>

<template>
  <div>

    <!--  modal of filter framework list  -->
    <FilterInventoryModal
        :modalId="filterInventoryModalId"
        :showFilterInventoryModalFlag="showFilterInventoryModalFlag"
        :filterDataTemp="filterDataTemp"
        :filterInventoryLoadingFlag="filterInventoryLoadingFlag"
        @resetFilterInventoryData="resetFilterInventoryData"
        @onSubmitFilterInventory="onSubmitFilterInventory"
        @removeFilterData="removeFilterData"
    />

    <!--  modal of show log data  -->
    <Modal
        @close="resetCurrentData"
        :title="currentLog?currentLog.time_create_view:$t('modal.log')"
        id="log_data_modal"
        :custom-style="'max-w-2xl'"
        :close-btn="false"
        :close-backdrop="true"
        :close-icon="true"
    >

      <div>
        <div class="overflow-auto max-h-96">
          <vue-json-pretty :data="currentLog" dir="ltr"/>
        </div>
        <div class="flex justify-end mt-3 gap-2">
          <BaseButton class="btn-outline btn-primary text-white" size="xs" onclick="log_data_modal.close()"
                      type="button">
            {{ $t('button.cancel') }}
          </BaseButton>
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
          <BaseButton
              class="btn-secondary text-white"
              size="xs" @click="showFilterInventoryModal"
          >
            <div class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"/>
              </svg>
              <span class="p-1">
                {{ $t("button.filter") }}
              </span>
            </div>
          </BaseButton>
        </div>
      </div>
      <div class="min-card-height-table">
        <BaseTable
            :is-loading="inventoryListProcessing"
            :data="currentInventoryList"
            :headers="tableHeaders"
            :body-row-class="getRowClass"
        >
          <template v-slot:cell(company_title)="{ data, index }">
            <div class="flex gap-2">
              {{ data.item.company_title }}
            </div>
          </template>
          <template v-slot:cell(package_title)="{ data, index }">
            <div class="flex gap-2">
              {{ data.item.package_title }}
            </div>
          </template>
          <template v-slot:cell(message)="{ data, index }">
            <div class="flex gap-2">
              {{ data.item.message.length ? data.item.message : data.item.path }}
            </div>
          </template>
          <template v-slot:cell(action)="{ data, index }">
            <div class="flex gap-2">
              <BaseButton
                  size="xs"
                  @click="showDataModal(data.item)"
                  class="bg-gray-600 hover:bg-gray-800 text-white tooltip"
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