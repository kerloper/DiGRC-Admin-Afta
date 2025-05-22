<script setup>

import {ref, watch} from "vue";
import BaseTable from "@/components/table/BaseTable.vue";
import {useI18n} from "vue-i18n";
import API from "@/services/API.js";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import PerPage from "@/components/table/PerPage.vue";
import BasePagination from "@/components/table/BasePagination.vue";
import AddControlModal from "./AddControlModal.vue";
import UpdateControlModal from "./UpdateControlModal.vue";
import FilterControlModal from "./FilterControlModal.vue";
import {scollToTop} from "@/composables/scoll-to-top.js";
import cleaner from "@/composables/clean-object.js";
import {listSetting} from "@/constants/config.js";
import BaseToggleSwitch from "@/components/BaseToggleSwitch.vue";

const {t: $t} = useI18n()
const controlListProcessing = ref(false)
const controlProcessing = ref(false)
const fetchError = ref(false)
const currentControlList = ref([])
const statusList = [
  {'status': 1, 'title': 'Active'},
  {'status': 0, 'title': 'Inactive'}
]
const currentControl = ref({
  "id": null,
  "title": null,
  "framework": null,
  "framework_id": null,
  "domain": null,
  "domain_id": null,
  "status": null,
  "number": null,
  "description": null,
  "quick_win": null,
})
const defaultControl = ref({
  "id": null,
  "title": null,
  "framework": null,
  "framework_id": null,
  "domain": null,
  "domain_id": null,
  "status": null,
  "number": null,
  "description": null,
  "quick_win": null
})
const newControl = ref({
  "id": null,
  "title": null,
  "framework": null,
  "framework_id": null,
  "domain": null,
  "domain_id": null,
  "status": null,
  "number": null,
  "description": null,
  "quick_win": null
})
const tempControl =  {
  "id": null,
  "title": null,
  "framework": null,
  "framework_id": null,
  "domain": null,
  "domain_id": null,
  "status": null,
  "number": null,
  "description": null,
  "quick_win": null
}
//for handle validation error in filter members list
const filterControlModalId = 'filter_control_modal'
const showFilterControlModalFlag = ref(false)
const filterControlLoadingFlag = ref(false)
const filterDataDefault = {
  "title": "",
  "framework": null,
  "framework_id": null,
  "domain_id": null,
  "domain": null,
  "status": null
}
const filterData = ref({
  "title": "",
  "framework": null,
  "framework_id": null,
  "domain_id": null,
  "domain": null,
  "status": null
})
const filterDataTemp = ref({
  "title": "",
  "framework": null,
  "framework_id": null,
  "domain_id": null,
  "domain": null,
  "status": null
})
const tableHeaders = [
  {label: "table.id", key: "id"},
  {label: "table.title", key: "title"},
  {label: "table.domain", key: "domain_title"},
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
const showAddControlModalFlag = ref(false)
const addControlModalId = 'add_control_modal'
const addControlLoadingFlag = ref(false)
const frameworkListProcessing = ref(true)
const frameworkList = ref([])
const domainListProcessing = ref(true)
const domainList = ref([])
//for handle validation error in update control
const showUpdateControlModalFlag = ref(false)
const updateControlLoadingFlag = ref(false)
const updateControlModalId = 'update_control_modal'
const {scrollToTop} = scollToTop()
const handlePageChange = (newPage) => {
  pageOptions.value.page = newPage
  listControlRequest()
  scrollToTop()
};
const onLimitChange = (newLimit) => {
  pageOptions.value.page = 1
  pageOptions.value.limit = newLimit.value
  listControlRequest()
  scrollToTop()
};

function setControlListProcessing(payload) {
  controlListProcessing.value = payload
  fetchError.value = null
}

function clearFetchError() {
  fetchError.value = null
}

function setFetchError(payload) {
  fetchError.value = payload
  currentControlList.value = []
  Object.assign(currentControl.value, defaultControl.value);
  controlProcessing.value = false
  controlListProcessing.value = false
}

function setControlList(payload) {
  currentControlList.value = payload
  controlListProcessing.value = false
  fetchError.value = null
}

async function listControlRequest() {
  clearFetchError()
  setControlListProcessing(true)
  filterData.value.status = filterData.value.status ? filterData.value.status.status : null
  filterData.value.framework_id = filterData.value.framework ? filterData.value.framework.map(({id}) => id) : null
  filterData.value.domain_id = filterData.value.domain ? filterData.value.domain.map(({id}) => id) : null
  delete filterData.value.domain
  delete filterData.value.framework
  const {data, error} = await API.listControlRequest({...pageOptions.value, ...cleaner(filterData.value)})
  if (data.value) {
    pageOptions.value = data.value.data.paginator
    pageOptions.value.totalPage = Math.ceil(pageOptions.value.count / pageOptions.value.limit)
    Object.assign(filterData.value, filterDataTemp.value)
    setControlList(data.value.data.list)
    //if list api call from filter modal
    if (showFilterControlModalFlag.value) {
      const modal = document.getElementById(filterControlModalId)
      modal.close()
    }
  } else if (error.value) {
    setFetchError(error.value)
  }
  setControlListProcessing(false)
  filterControlLoadingFlag.value = false
}

function showAddControlModal() {
  if (frameworkListProcessing.value || domainListProcessing.value) {
    return
  }
  showAddControlModalFlag.value = true
  setTimeout(function () {
    const modal = document.getElementById(addControlModalId)
    modal.showModal()
  }, 100)
}

async function addControl(control) {
  if (control == null) {
    resetAddControlData();
  }
  const {data, error} = await API.addControlRequest(cleaner(control))
  if (data.value) {
    setControlListProcessing(true)
    resetAddControlData()
    removeFilterData()
  } else if (error.value) {
    addControlLoadingFlag.value = false
    ///TODO:set alert for error in delete member
  }
}

function confirmUpdateStatusControl(control) {
  Object.assign(currentControl.value, control)
  const modal = document.getElementById('confirmation_update_status_control');
  modal.showModal();
}

function cancelUpdateStatusControl() {
  Object.assign(currentControl.value, defaultControl.value);
}

function updateStatusControl() {
  setControlListProcessing(true)
  currentControl.value.status = 1 - currentControl.value.status
  updateControl({
    "id": currentControl.value.id,
    "status": currentControl.value.status,
  })
}

function onSubmitAddControl() {
  if (!newControl.value) {
    return
  } else {
    addControlLoadingFlag.value = true
  }

  Object.assign(tempControl, newControl.value);
  tempControl.status = newControl.value.status ? newControl.value.status.status : null;
  tempControl.framework_id = newControl.value.framework ? newControl.value.framework.id : null;
  tempControl.domain_id = newControl.value.domain ? newControl.value.domain.id : null;
  delete tempControl.id
  delete tempControl.domain
  delete tempControl.framework
  addControl(tempControl);


}

function resetAddControlData() {
  //reset validation error message of form
  showAddControlModalFlag.value = false
  addControlLoadingFlag.value = false
  const modal = document.getElementById(addControlModalId);
  modal.close();
  Object.assign(newControl.value, defaultControl.value);
}

///start update control methods
function showUpdateControlModal(control) {
  if (frameworkListProcessing.value || domainListProcessing.value) {
    return
  }
  Object.assign(currentControl.value, control)

  currentControl.value.status = statusList.find(status => status.status === control.status)
  currentControl.value.framework = frameworkList.value.find(framework => framework.id === control.framework_id)
  currentControl.value.domain = domainList.value.find(domain => domain.id === control.domain_id)
  currentControl.value = {...currentControl.value, ...currentControl.value.information}
  showUpdateControlModalFlag.value = true
  setTimeout(function () {
    const modal = document.getElementById(updateControlModalId)
    modal.showModal()
  }, 100)
}

function resetUpdateControlData() {
  //reset validation error message of update form
  showUpdateControlModalFlag.value = false
  updateControlLoadingFlag.value = false
  Object.assign(currentControl.value, defaultControl.value);
  if(showUpdateControlModalFlag.value){
    const modal = document.getElementById(updateControlModalId)
    modal.close()
  }
}

function onSubmitUpdateControl() {
  if (!currentControl.value) {
    return
  } else {
    updateControlLoadingFlag.value = true
  }
  delete currentControl.value.domain
  delete currentControl.value.framework
  delete currentControl.value.information
  Object.assign(tempControl,currentControl.value)
  tempControl.status = currentControl.value.status ? currentControl.value.status.status : null;
  tempControl.framework_id = currentControl.value.framework ? currentControl.value.framework.id : null;
  tempControl.domain_id = currentControl.value.domain ? currentControl.value.domain.id : null;
  updateControl(tempControl);
}

async function updateControl(control) {
  if (control == null) {
    resetUpdateControlData()
  }
  const {data, error} = await API.updateControlRequest(cleaner(control))
  if (data.value) {
    setControlListProcessing(true)
    resetUpdateControlData();
    await listControlRequest();
  } else if (error.value) {
    updateControlLoadingFlag.value = false
    ///TODO:set error handler for update member
  }
}

///start filter members list
function showFilterControlModal() {
  Object.assign(filterDataTemp.value, filterData.value)
  showFilterControlModalFlag.value = true
  const modal = document.getElementById(filterControlModalId);
  modal.showModal();
}

function resetFilterControlData() {
  showFilterControlModalFlag.value = false
  filterControlLoadingFlag.value = false
  const modal = document.getElementById(filterControlModalId)
  modal.close()
}

function onSubmitFilterControl() {
  pageOptions.value.page = 1
  Object.assign(filterData.value, filterDataTemp.value)
  filterControlLoadingFlag.value = true
  listControlRequest()
}

function removeFilterData() {
  pageOptions.value.page = 1
  Object.assign(filterData.value, filterDataDefault)
  Object.assign(filterDataTemp.value, filterDataDefault)
  filterControlLoadingFlag.value = true
  listControlRequest()
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

async function lightListDomainRequest() {
  domainListProcessing.value = true
  const {data, error} = await API.lightListDomainRequest({'page': '1', 'limit': 1000})
  if (data.value) {
    domainList.value = data.value.data
  } else if (error.value) {
  }
  domainListProcessing.value = false
}

//reset form data of add control
watch(showAddControlModalFlag, () => {
  Object.assign(newControl.value, defaultControl.value)
})

//reset form data of add control
watch(showUpdateControlModalFlag, () => {
})

listControlRequest()
lightListFrameworkRequest()
lightListDomainRequest()

</script>

<template>
  <div>

    <!--  modal of filter control list  -->
    <FilterControlModal
        :modalId="filterControlModalId"
        :showFilterControlModalFlag="showFilterControlModalFlag"
        :filterDataTemp="filterDataTemp"
        :filterControlLoadingFlag="filterControlLoadingFlag"
        :frameworkList="frameworkList"
        :domainList="domainList"
        :statusList="statusList"
        @resetFilterControlData="resetFilterControlData"
        @onSubmitFilterControl="onSubmitFilterControl"
        @removeFilterData="removeFilterData"
    />

    <!--  modal of add control  -->
    <div v-if="showAddControlModalFlag">
      <AddControlModal
          :modalId="addControlModalId"
          :showAddControlModalFlag="showAddControlModalFlag"
          :newControl="newControl"
          :statusList="statusList"
          :frameworkList="frameworkList"
          :domainList="domainList"
          :addControlLoadingFlag="addControlLoadingFlag"
          @resetAddControlData="resetAddControlData"
          @onSubmitAddControl="onSubmitAddControl"
      />
    </div>
    <!--  modal of update control  -->
    <div v-if="showUpdateControlModalFlag">
      <UpdateControlModal
          :modalId="updateControlModalId"
          :showUpdateControlModalFlag="showUpdateControlModalFlag"
          :currentControl="currentControl"
          :statusList="statusList"
          :frameworkList="frameworkList"
          :domainList="domainList"
          :updateControlLoadingFlag="updateControlLoadingFlag"
          @resetUpdateControlData="resetUpdateControlData"
          @onSubmitUpdateControl="onSubmitUpdateControl"
      />
    </div>

    <!--  modal of update status confirmation  -->
    <ConfirmationModal
        :accept="updateStatusControl"
        :deny="cancelUpdateStatusControl"
        id="confirmation_update_status_control"
    >
      {{ $t('message.update-control-confirmation') }} {{ currentControl ? currentControl.title : '' }}?
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
          <BaseButton class="btn-primary text-white" size="xs" :onclick="showAddControlModal">
            <div class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/>
              </svg>
              <span class="p-1">
                {{ $t("button.add-control") }}
              </span>
            </div>
          </BaseButton>
          <BaseButton class="btn-secondary text-white" size="xs" @click="showFilterControlModal">
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
            :is-loading="controlListProcessing"
            :data="currentControlList"
            :headers="tableHeaders"
        >
          <template v-slot:cell(status)="{data,index}">
            <BaseToggleSwitch
                :toggleActive="data.item.status===1"
                @toggleAction="confirmUpdateStatusControl(data.item)"
            />
          </template>
          <template v-slot:cell(action)="{data,index}">
            <div class="flex gap-2">
              <BaseButton
                  size="xs"
                  @click="showUpdateControlModal(data.item)"
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