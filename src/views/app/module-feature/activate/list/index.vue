<script setup>

import {ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import API from "@/services/API.js";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import PerPage from "@/components/table/PerPage.vue";
import AddActivateModal from "./AddActivateModal.vue";
import UpdateActivateModal from "./UpdateActivateModal.vue";
import FilterActivateModal from "./FilterActivateModal.vue";
import BaseTable from "@/components/table/BaseTable.vue";
import BasePagination from "@/components/table/BasePagination.vue";
import {scollToTop} from "@/composables/scoll-to-top.js";
import cleaner from "@/composables/clean-object.js";
import {listSetting} from "@/constants/config.js";
import BaseToggleSwitch from "@/components/BaseToggleSwitch.vue";

const {t: $t} = useI18n()
const activateListProcessing = ref(false)
const activateProcessing = ref(false)
const fetchError = ref(false)
const currentActivateList = ref([])
const statusList = [
  {'key': 1, 'title': 'Active'},
  {'key': 0, 'title': 'Inactive'}
]
const currentActivate = ref({
  "id": null,
  "code": null,
  "framework": null,
  "framework_id": null,
  "stock_count": null,
})
const defaultActivate = ref({
  "id": null,
  "code": null,
  "framework": null,
  "framework_id": null,
  "stock_count": null,
})
const newActivate = ref({
  "id": null,
  "code": null,
  "framework": null,
  "framework_id": null,
  "stock_count": null,
})
//for handle validation error in filter members list
const filterActivateModalId = 'filter_activate_modal'
const showFilterActivateModalFlag = ref(false)
const filterActivateLoadingFlag = ref(false)
const filterDataDefault = {
  "code": "",
  "framework": null,
  "framework_id": null,
  "status": null
}
const filterData = ref({
  "code": "",
  "framework": null,
  "framework_id": null,
  "status": null
})
const filterDataTemp = ref({
  "code": "",
  "framework": null,
  "framework_id": null,
  "status": null
})
const tableHeaders = [
  {label: "table.id", key: "id"},
  {label: "table.code", key: "code"},
  {label: "table.stock-count", key: "stock_count"},
  {label: "table.framework", key: "framework_title"},
  {label: "table.created-at", key: "time_create_view"},
  {label: "table.updated-at", key: "time_update_view"},
  {label: "table.status", key: "status"},
  {label: "table.action", key: "action"}
]
const pageOptions = ref({
  limit: listSetting.limit,
  page: 1,
  count: 0,
  totalPage: 1,
})
const showAddActivateModalFlag = ref(false)
const addActivateModalId = 'add_activate_modal'
const addActivateLoadingFlag = ref(false)
const frameworkListProcessing = ref(true)
const frameworkList = ref([])
//for handle validation error in update activate
const showUpdateActivateModalFlag = ref(false)
const updateActivateLoadingFlag = ref(false)
const updateActivateModalId = 'update_activate_modal'
const {scrollToTop} = scollToTop()
const handlePageChange = (newPage) => {
  pageOptions.value.page = newPage
  listActivateRequest()
  scrollToTop()
};
const onLimitChange = (newLimit) => {
  pageOptions.value.page = 1
  pageOptions.value.limit = newLimit.value
  listActivateRequest()
  scrollToTop()
};

function setActivateListProcessing(payload) {
  activateListProcessing.value = payload
  fetchError.value = null
}

function clearFetchError() {
  fetchError.value = null
}

function setFetchError(payload) {
  fetchError.value = payload
  currentActivateList.value = []
  Object.assign(currentActivate.value, defaultActivate.value);
  activateProcessing.value = false
  activateListProcessing.value = false
}

function setActivateList(payload) {
  currentActivateList.value = payload
  activateListProcessing.value = false
  fetchError.value = null
}

async function listActivateRequest() {
  clearFetchError()
  setActivateListProcessing(true)
  filterData.value.framework_id = filterData.value.framework ? filterData.value.framework.map(({id}) => id) : null
  filterData.value = cleaner(filterData.value)
  const {data, error} = await API.listActivateRequest({...pageOptions.value, ...cleaner(filterData.value)})
  if (data.value) {
    pageOptions.value = data.value.data.paginator
    pageOptions.value.totalPage = Math.ceil(pageOptions.value.count / pageOptions.value.limit)
    Object.assign(filterData.value, filterDataTemp.value)
    setActivateList(data.value.data.list)
    //if list api call from filter modal
    if (showFilterActivateModalFlag.value) {
      const modal = document.getElementById(filterActivateModalId)
      modal.close()
    }
  } else if (error.value) {
    setFetchError(error.value)
  }
  setActivateListProcessing(false)
  filterActivateLoadingFlag.value = false
}

function showAddActivateModal() {
  if (frameworkListProcessing.value) {
    return
  }
  showAddActivateModalFlag.value = true
  const modal = document.getElementById(addActivateModalId);
  modal.showModal();
}

async function addActivate(activate) {
  if (activate == null) {
    resetAddActivateData();
  }
  delete activate.id;
  delete activate.framework;
  const {data, error} = await API.addActivateRequest(JSON.stringify(activate))
  if (data.value) {
    setActivateListProcessing(true)
    resetAddActivateData()
    removeFilterData()
  } else if (error.value) {
    addActivateLoadingFlag.value = false
    ///TODO:set alert for error in delete member
  }
}

function confirmUpdateStatusActivate(activate) {
  Object.assign(currentActivate.value, activate)
  const modal = document.getElementById('confirmation_update_status_activate');
  modal.showModal();
}

function cancelUpdateStatusActivate() {
  Object.assign(currentActivate.value, defaultActivate.value);
}

function updateStatusActivate() {
  setActivateListProcessing(true)
  currentActivate.value.status = 1 - currentActivate.value.status
  updateActivate({
    "id": currentActivate.value.id,
    "status": currentActivate.value.status,
  })
}

function onSubmitAddActivate() {
  if (!newActivate.value) {
    return
  } else {
    addActivateLoadingFlag.value = true
  }
  Object.assign(currentActivate.value, newActivate.value);
  currentActivate.value.status = currentActivate.value.status ? currentActivate.value.status.key : null;
  currentActivate.value.framework_id = currentActivate.value.framework ? currentActivate.value.framework.id : null;
  addActivate(currentActivate.value);
}

function resetAddActivateData() {
  //reset validation error message of form
  showAddActivateModalFlag.value = false
  addActivateLoadingFlag.value = false
  const modal = document.getElementById(addActivateModalId);
  modal.close();
}

///start update activate methods
function showUpdateActivateModal(activate) {
  if (frameworkListProcessing.value) {
    return
  }
  Object.assign(currentActivate.value, activate)
  currentActivate.value.status = statusList.find(status => status.key === activate.status)
  showUpdateActivateModalFlag.value = true
  const modal = document.getElementById(updateActivateModalId);
  modal.showModal();
}

function resetUpdateActivateData() {
  //reset validation error message of update form
  showUpdateActivateModalFlag.value = false
  updateActivateLoadingFlag.value = false
  Object.assign(currentActivate.value, defaultActivate.value);
  const modal = document.getElementById(updateActivateModalId)
  modal.close()
}

function onSubmitUpdateActivate() {
  if (!currentActivate.value) {
    return
  } else {
    updateActivateLoadingFlag.value = true
  }
  updateActivate({
    "id": currentActivate.value.id,
    "code": currentActivate.value.code,
    "stock_count": currentActivate.value.stock_count,
    "status": currentActivate.value.status.key,
  })
}

async function updateActivate(activate) {
  if (activate == null) {
    resetUpdateActivateData()
  }
  const {data, error} = await API.updateActivateRequest(JSON.stringify(activate))
  if (data.value) {
    setActivateListProcessing(true)
    resetUpdateActivateData();
    await listActivateRequest();
  } else if (error.value) {
    updateActivateLoadingFlag.value = false
    ///TODO:set error handler for update member
  }
}

///start filter members list
function showFilterActivateModal() {
  Object.assign(filterDataTemp.value, filterData.value)
  showFilterActivateModalFlag.value = true
  const modal = document.getElementById(filterActivateModalId);
  modal.showModal();
}

function resetFilterActivateData() {
  showFilterActivateModalFlag.value = false
  filterActivateLoadingFlag.value = false
  const modal = document.getElementById(filterActivateModalId)
  modal.close()
}

function onSubmitFilterActivate() {
  pageOptions.value.page = 1
  Object.assign(filterData.value, filterDataTemp.value)
  filterActivateLoadingFlag.value = true
  listActivateRequest()
}

function removeFilterData() {
  pageOptions.value.page = 1
  Object.assign(filterData.value, filterDataDefault)
  Object.assign(filterDataTemp.value, filterDataDefault)
  filterActivateLoadingFlag.value = true
  listActivateRequest()
}

async function lightListFrameworkRequest() {
  frameworkListProcessing.value = true
  const {data, error} = await API.lightListFrameworkRequest({'page': '1', 'limit': 1000})
  if (data.value) {
    frameworkList.value = data.value.data
  } else if (error.value) {
  }
  frameworkListProcessing.value = false
}

//reset form data of add activate
watch(showAddActivateModalFlag, () => {
  Object.assign(newActivate.value, defaultActivate.value)
})

//reset form data of add activate
watch(showUpdateActivateModalFlag, () => {
})

listActivateRequest()
lightListFrameworkRequest()

</script>

<template>
  <div>

    <!--  modal of filter activate list  -->
    <FilterActivateModal
        :modalId="filterActivateModalId"
        :showFilterActivateModalFlag="showFilterActivateModalFlag"
        :filterDataTemp="filterDataTemp"
        :filterActivateLoadingFlag="filterActivateLoadingFlag"
        :frameworkList="frameworkList"
        :statusList="statusList"
        @resetFilterActivateData="resetFilterActivateData"
        @onSubmitFilterActivate="onSubmitFilterActivate"
        @removeFilterData="removeFilterData"
    />

    <!--  modal of add activate  -->
    <AddActivateModal
        :modalId="addActivateModalId"
        :showAddActivateModalFlag="showAddActivateModalFlag"
        :newActivate="newActivate"
        :statusList="statusList"
        :frameworkList="frameworkList"
        :addActivateLoadingFlag="addActivateLoadingFlag"
        @resetAddActivateData="resetAddActivateData"
        @onSubmitAddActivate="onSubmitAddActivate"
    />

    <!--  modal of update activate  -->
    <UpdateActivateModal
        :modalId="updateActivateModalId"
        :showUpdateActivateModalFlag="showUpdateActivateModalFlag"
        :currentActivate="currentActivate"
        :statusList="statusList"
        :frameworkList="frameworkList"
        :updateActivateLoadingFlag="updateActivateLoadingFlag"
        @resetUpdateActivateData="resetUpdateActivateData"
        @onSubmitUpdateActivate="onSubmitUpdateActivate"
    />

    <!--  modal of update status confirmation  -->
    <ConfirmationModal
        :accept="updateStatusActivate"
        :deny="cancelUpdateStatusActivate"
        id="confirmation_update_status_activate"
    >
      {{ $t('message.update-activate-confirmation') }} {{ currentActivate ? currentActivate.title : '' }}?
    </ConfirmationModal>

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
          <BaseButton class="btn-primary text-white" size="xs" :onclick="showAddActivateModal">
            <div class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"/>
              </svg>
              <span class="p-1">
                {{ $t("button.add-activate") }}
              </span>
            </div>
          </BaseButton>
          <BaseButton class="btn-secondary text-white" size="xs" @click="showFilterActivateModal">
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
            :is-loading="activateListProcessing"
            :data="currentActivateList"
            :headers="tableHeaders"
        >
          <template v-slot:cell(status)="{data,index}">
            <BaseToggleSwitch
                :toggleActive="data.item.status===1"
                @toggleAction="confirmUpdateStatusActivate(data.item)"
            />
<!--            <BaseButton-->
<!--                class="w-20 btn-xs text-xs btn-outline"-->
<!--                size="xs"-->
<!--                :class="{'btn-success':(data.item.status===1),'':!(data.item.status===1)}"-->
<!--                @click="confirmUpdateStatusActivate(data.item)"-->
<!--            >-->
<!--               <span class="text-xs font-medium">-->
<!--                {{ data.item.status === 1 ? $t('table.active') : $t('table.inactive') }}-->
<!--               </span>-->
<!--            </BaseButton>-->
          </template>
          <template v-slot:cell(action)="{data,index}">
            <div class="flex gap-2">
              <BaseButton
                  size="xs"
                  @click="showUpdateActivateModal(data.item)"
                  class="btn-primary tooltip text-white"
                  :data-tip="$t('tooltip.edit')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
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