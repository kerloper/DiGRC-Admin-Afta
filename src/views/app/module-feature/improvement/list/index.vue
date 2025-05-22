<script setup>

import {onMounted, ref, watch} from "vue";
import BaseTable from "@/components/table/BaseTable.vue";
import {useI18n} from "vue-i18n";
import API from "@/services/API.js";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import PerPage from "@/components/table/PerPage.vue";
import BasePagination from "@/components/table/BasePagination.vue";
import AddImprovementModal from "./AddImprovementModal.vue";
import UpdateImprovementModal from "./UpdateImprovementModal.vue";
import FilterImprovementModal from "./FilterImprovementModal.vue";
import {scollToTop} from "@/composables/scoll-to-top.js";
import cleaner from "@/composables/clean-object.js";
import {listSetting} from "@/constants/config.js";
import BaseToggleSwitch from "@/components/BaseToggleSwitch.vue";

const {t: $t} = useI18n()
const improvementListProcessing = ref(false)
const improvementProcessing = ref(false)
const fetchError = ref(false)
const improvementList = ref([])
const statusList = [
  {'status': 1, 'title': 'Active'},
  {'status': 0, 'title': 'Inactive'}
]
const currentImprovement = ref({
  "id": null,
  "title": null,
  "framework": null,
  "framework_id": null,
  "domain": null,
  "domain_id": null,
  "control": null,
  "control_id": null,
  "status": null,
  "remediation_tasks": null,
})
const defaultImprovement = ref({
  "id": null,
  "title": null,
  "framework": null,
  "framework_id": null,
  "domain": null,
  "domain_id": null,
  "control": null,
  "control_id": null,
  "status": null,
  "remediation_tasks": null,
})
const newImprovement = ref({
  "id": null,
  "title": null,
  "framework": null,
  "framework_id": null,
  "domain": null,
  "domain_id": null,
  "control": null,
  "control_id": null,
  "status": null,
  "remediation_tasks": null,
})
//for handle validation error in filter members list
const filterImprovementModalId = 'filter_improvement_modal'
const showFilterImprovementModalFlag = ref(false)
const filterImprovementLoadingFlag = ref(false)
const filterDataDefault = {
  "title": "",
  "framework": null,
  "framework_id": null,
  "domain_id": null,
  "domain": null,
  "control": null,
  "control_id": null,
  "status": null
}
const filterData = ref({
  "title": "",
  "framework": null,
  "framework_id": null,
  "domain_id": null,
  "domain": null,
  "control": null,
  "control_id": null,
  "status": null
})
const filterDataTemp = ref({
  "title": "",
  "framework": null,
  "framework_id": null,
  "domain_id": null,
  "domain": null,
  "control": null,
  "control_id": null,
  "status": null
})
const tableHeaders = [
  {label: "table.id", key: "id"},
  {label: "table.title", key: "title"},
  {label: "table.control", key: "control_title"},
  {label: "table.domain", key: "domain_title"},
  {label: "table.framework", key: "framework_title"},
  {label: "table.status", key: "status"},
  {label: "table.action", key: "action"}
]
const pageOptions = ref({
  limit: listSetting.limit,
  page: 1,
  count: 0,
  totalPage: 1,
})
const showAddImprovementModalFlag = ref(false)
const addImprovementModalId = 'add_improvement_modal'
const addImprovementLoadingFlag = ref(false)
const frameworkListProcessing = ref(true)
const frameworkList = ref([])
const domainListProcessing = ref(true)
const domainList = ref([])
const controlListProcessing = ref(true)
const controlList = ref([])
//for handle validation error in update improvement
const showUpdateImprovementModalFlag = ref(false)
const updateImprovementLoadingFlag = ref(false)
const updateImprovementModalId = 'update_improvement_modal'
const {scrollToTop} = scollToTop()
const handlePageChange = (newPage) => {
  pageOptions.value.page = newPage
  fetchData()
  scrollToTop()
};
const onLimitChange = (newLimit) => {
  pageOptions.value.page = 1
  pageOptions.value.limit = newLimit.value
  fetchData()
  scrollToTop()
};

function setImprovementListProcessing(payload) {
  improvementListProcessing.value = payload
  fetchError.value = null
}

function clearFetchError() {
  fetchError.value = null
}

function setFetchError(payload) {
  fetchError.value = payload
  improvementList.value = []
  Object.assign(currentImprovement.value, defaultImprovement.value);
  improvementProcessing.value = false
  improvementListProcessing.value = false
}

function setImprovementList(payload) {
  improvementList.value = payload
  improvementListProcessing.value = false
  fetchError.value = null
}

async function listImprovementRequest() {
  let response = []
  improvementList.value = []
  clearFetchError()
  setImprovementListProcessing(true)
  filterData.value.status = filterData.value.status ? filterData.value.status.status : null
  filterData.value.framework_id = filterData.value.framework ? filterData.value.framework.map(({id}) => id) : null
  filterData.value.domain_id = filterData.value.domain ? filterData.value.domain.map(({id}) => id) : null
  filterData.value.control_id = filterData.value.control ? filterData.value.control.map(({id}) => id) : null
  delete filterData.value.domain
  delete filterData.value.framework
  delete filterData.value.control
  const {data, error} = await API.listImprovementRequest({...pageOptions.value, ...cleaner(filterData.value)})
  if (data.value) {
    pageOptions.value = data.value.data.paginator
    pageOptions.value.totalPage = Math.ceil(pageOptions.value.count / pageOptions.value.limit)
    Object.assign(filterData.value, filterDataTemp.value)
    response = data.value.data.list
    //if list api call from filter modal
    if (showFilterImprovementModalFlag.value) {
      const modal = document.getElementById(filterImprovementModalId)
      modal.close()
    }
  } else if (error.value) {
    setFetchError(error.value)
  }
  setImprovementListProcessing(false)
  filterImprovementLoadingFlag.value = false
  return response;
}

function showAddImprovementModal() {
  if (frameworkListProcessing.value || domainListProcessing.value) {
    return
  }
  showAddImprovementModalFlag.value = true
  setTimeout(function () {
    const modal = document.getElementById(addImprovementModalId)
    modal.showModal()
  }, 100)
}

async function addImprovement(improvement) {
  if (improvement == null) {
    resetAddImprovementData();
  }
  const {data, error} = await API.addImprovementRequest(cleaner(improvement))
  if (data.value) {
    setImprovementListProcessing(true)
    resetAddImprovementData()
    removeFilterData()
  } else if (error.value) {
    addImprovementLoadingFlag.value = false
    ///TODO:set alert for error in delete member
  }
}

function confirmUpdateStatusImprovement(improvement) {
  Object.assign(currentImprovement.value, improvement)
  const modal = document.getElementById('confirmation_update_status_improvement');
  modal.showModal();
}

function cancelUpdateStatusImprovement() {
  Object.assign(currentImprovement.value, defaultImprovement.value);
}

function updateStatusImprovement() {
  setImprovementListProcessing(true)
  currentImprovement.value.status = 1 - currentImprovement.value.status
  updateImprovement({
    "id": currentImprovement.value.id,
    "status": currentImprovement.value.status,
  })
}

function onSubmitAddImprovement() {
  if (!newImprovement.value) {
    return
  } else {
    addImprovementLoadingFlag.value = true
  }

  Object.assign(currentImprovement.value, newImprovement.value);
  currentImprovement.value.status = currentImprovement.value.status ? currentImprovement.value.status.status : null;
  currentImprovement.value.framework_id = currentImprovement.value.framework ? currentImprovement.value.framework.id : null;
  currentImprovement.value.domain_id = currentImprovement.value.domain ? currentImprovement.value.domain.id : null;
  currentImprovement.value.control_id = currentImprovement.value.control ? currentImprovement.value.control.id : null;

  delete currentImprovement.value.id
  delete currentImprovement.value.domain
  delete currentImprovement.value.framework
  delete currentImprovement.value.control

  addImprovement(currentImprovement.value);
}

function resetAddImprovementData() {
  //reset validation error message of form
  showAddImprovementModalFlag.value = false
  addImprovementLoadingFlag.value = false
  const modal = document.getElementById(addImprovementModalId);
  modal.close();
  Object.assign(newImprovement.value, defaultImprovement.value);
}

///start update improvement methods
function showUpdateImprovementModal(improvement) {
  Object.assign(currentImprovement.value, improvement)
  currentImprovement.value.status = statusList.find(status => status.status === improvement.status)
  currentImprovement.value.framework = frameworkList.value.find(framework => framework.id === improvement.framework_id)
  currentImprovement.value.domain = domainList.value.find(domain => domain.id === improvement.domain_id)
  currentImprovement.value.control = controlList.value.find(control => control.id === improvement.control_id)
  currentImprovement.value = {...currentImprovement.value, ...currentImprovement.value.information}
  showUpdateImprovementModalFlag.value = true
  setTimeout(function () {
    const modal = document.getElementById(updateImprovementModalId)
    modal.showModal()
  }, 100)
}

function resetUpdateImprovementData() {
  //reset validation error message of update form
  showUpdateImprovementModalFlag.value = false
  updateImprovementLoadingFlag.value = false
  Object.assign(currentImprovement.value, defaultImprovement.value);
  if (showUpdateImprovementModalFlag.value) {
    const modal = document.getElementById(updateImprovementModalId)
    modal.close()
  }
}

function onSubmitUpdateImprovement() {
  if (!currentImprovement.value) {
    return
  } else {
    updateImprovementLoadingFlag.value = true
  }
  updateImprovement({
    id: currentImprovement.value.id,
    title:currentImprovement.value.title,
    framework_id:currentImprovement.value.framework_id,
    domain_id:currentImprovement.value.domain_id,
    control_id:currentImprovement.value.control_id,
  });
}

async function updateImprovement(improvement) {
  if (improvement == null) {
    resetUpdateImprovementData()
  }
  const {data, error} = await API.updateImprovementRequest(cleaner(improvement))
  if (data.value) {
    setImprovementListProcessing(true)
    resetUpdateImprovementData();
   await fetchData()
  } else if (error.value) {
    updateImprovementLoadingFlag.value = false
    ///TODO:set error handler for update member
  }
}

///start filter members list
function showFilterImprovementModal() {
  Object.assign(filterDataTemp.value, filterData.value)
  showFilterImprovementModalFlag.value = true
  const modal = document.getElementById(filterImprovementModalId);
  modal.showModal();
}

function resetFilterImprovementData() {
  showFilterImprovementModalFlag.value = false
  filterImprovementLoadingFlag.value = false
  const modal = document.getElementById(filterImprovementModalId)
  modal.close()
}

function onSubmitFilterImprovement() {
  pageOptions.value.page = 1
  Object.assign(filterData.value, filterDataTemp.value)
  filterImprovementLoadingFlag.value = true
  fetchData()
}

function removeFilterData() {
  pageOptions.value.page = 1
  Object.assign(filterData.value, filterDataDefault)
  Object.assign(filterDataTemp.value, filterDataDefault)
  filterImprovementLoadingFlag.value = true
  fetchData()
}

async function lightListFrameworkRequest() {
  let response = []
  frameworkListProcessing.value = true
  const {data, error} = await API.lightListFrameworkRequest({'page': '1', 'limit': 1000})
  if (data.value) {
    response = data.value.data
  } else if (error.value) {
  }
  frameworkListProcessing.value = false
  return response
}

async function lightListDomainRequest() {
  let response = []
  domainListProcessing.value = true
  const {data, error} = await API.lightListDomainRequest({'page': '1', 'limit': 1000})
  if (data.value) {
    response = data.value.data
  } else if (error.value) {
  }
  domainListProcessing.value = false
  return response
}

async function lightListControlRequest() {
  let response = []
  controlListProcessing.value = true
  const {data, error} = await API.lightListControlRequest({'page': '1', 'limit': 1000})
  if (data.value) {
    response = data.value.data
  } else if (error.value) {
  }
  controlListProcessing.value = false
  return response
}

//reset form data of add improvement
watch(showAddImprovementModalFlag, () => {
  Object.assign(newImprovement.value, defaultImprovement.value)
})

const fetchData = async () => {
  try {
    const [improvementData, frameworkData, domainData, controlData] = await Promise.all([
      listImprovementRequest(),
      lightListFrameworkRequest(),
      lightListDomainRequest(),
      lightListControlRequest()
    ]);
    improvementList.value = improvementData;
    frameworkList.value = frameworkData;
    domainList.value = domainData;
    controlList.value = controlData;
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setImprovementListProcessing(false)
  }
}

onMounted(fetchData)


</script>

<template>
  <div>

    <!--  modal of filter improvement list  -->
    <FilterImprovementModal
        :modalId="filterImprovementModalId"
        :showFilterImprovementModalFlag="showFilterImprovementModalFlag"
        :filterDataTemp="filterDataTemp"
        :filterImprovementLoadingFlag="filterImprovementLoadingFlag"
        :frameworkList="frameworkList"
        :domainList="domainList"
        :controlList="controlList"
        :statusList="statusList"
        @resetFilterImprovementData="resetFilterImprovementData"
        @onSubmitFilterImprovement="onSubmitFilterImprovement"
        @removeFilterData="removeFilterData"
    />

    <!--  modal of add improvement  -->
    <div v-if="showAddImprovementModalFlag">
      <AddImprovementModal
          :modalId="addImprovementModalId"
          :showAddImprovementModalFlag="showAddImprovementModalFlag"
          :newImprovement="newImprovement"
          :statusList="statusList"
          :frameworkList="frameworkList"
          :domainList="domainList"
          :controlList="controlList"
          :addImprovementLoadingFlag="addImprovementLoadingFlag"
          @resetAddImprovementData="resetAddImprovementData"
          @onSubmitAddImprovement="onSubmitAddImprovement"
      />
    </div>
    <!--  modal of update improvement  -->
    <div v-if="showUpdateImprovementModalFlag">
      <UpdateImprovementModal
          :modalId="updateImprovementModalId"
          :showUpdateImprovementModalFlag="showUpdateImprovementModalFlag"
          :currentImprovement="currentImprovement"
          :statusList="statusList"
          :frameworkList="frameworkList"
          :domainList="domainList"
          :updateImprovementLoadingFlag="updateImprovementLoadingFlag"
          @resetUpdateImprovementData="resetUpdateImprovementData"
          @onSubmitUpdateImprovement="onSubmitUpdateImprovement"
      />
    </div>

    <!--  modal of update status confirmation  -->
    <ConfirmationModal
        :accept="updateStatusImprovement"
        :deny="cancelUpdateStatusImprovement"
        id="confirmation_update_status_improvement"
    >
      {{ $t('message.update-improvement-confirmation') }} {{ currentImprovement ? currentImprovement.title : '' }}?
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
          <BaseButton class="btn-primary text-white" size="xs" :onclick="showAddImprovementModal">
            <div class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"/>
              </svg>
              <span class="p-1">
                {{ $t("button.add-improvement") }}
              </span>
            </div>
          </BaseButton>
          <BaseButton class="btn-secondary text-white" size="xs" @click="showFilterImprovementModal">
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
            :is-loading="improvementListProcessing"
            :data="improvementList"
            :headers="tableHeaders"
        >
          <template v-slot:cell(status)="{data,index}">
            <BaseToggleSwitch
                :toggleActive="data.item.status===1"
                @toggleAction="confirmUpdateStatusImprovement(data.item)"
            />
<!--            <BaseButton-->
<!--                class="w-20 btn-xs text-xs btn-outline"-->
<!--                size="xs"-->
<!--                :class="{'btn-success':(data.item.status===1),'':!(data.item.status===1)}"-->
<!--                @click="confirmUpdateStatusImprovement(data.item)"-->
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
                  @click="showUpdateImprovementModal(data.item)"
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