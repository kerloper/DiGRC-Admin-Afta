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
import AddDomainModal from "./AddDomainModal.vue";
import UpdateDomainModal from "./UpdateDomainModal.vue";
import FilterDomainModal from "./FilterDomainModal.vue";
import {scollToTop} from "@/composables/scoll-to-top.js";
import cleaner from "@/composables/clean-object.js";
import {listSetting} from "@/constants/config.js";
import BaseToggleSwitch from "@/components/BaseToggleSwitch.vue";

const {t: $t} = useI18n()
const domainListProcessing = ref(false)
const domainProcessing = ref(false)
const fetchError = ref(false)
const currentDomainList = ref([])
const statusList = [
  {'key': 1, 'title': 'Active'},
  {'key': 0, 'title': 'Inactive'}
]
const currentDomain = ref({
  "id": null,
  "title": null,
  "framework": null,
  "framework_id": null,
  "status": null,
})
const defaultDomain = ref({
  "id": null,
  "title": null,
  "framework": null,
  "framework_id": null,
  "status": null,
})
const newDomain = ref({
  "id": null,
  "title": null,
  "framework": null,
  "framework_id": null,
  "status": null,
})
//for handle validation error in filter members list
const filterDomainModalId = 'filter_domain_modal'
const showFilterDomainModalFlag = ref(false)
const filterDomainLoadingFlag = ref(false)
const filterDataDefault = {
  "title": "",
  "framework": null,
  "framework_id": null,
  "status": null
}
const filterData = ref({
  "title": "",
  "framework": null,
  "framework_id": null,
  "status": null
})
const filterDataTemp = ref({
  "title": "",
  "framework": null,
  "framework_id": null,
  "status": null
})
const tableHeaders = [
  {label: "table.id", key: "id"},
  {label: "table.title", key: "title"},
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
const showAddDomainModalFlag = ref(false)
const addDomainModalId = 'add_domain_modal'
const addDomainLoadingFlag = ref(false)
const frameworkListProcessing = ref(true)
const frameworkList = ref([])
//for handle validation error in update domain
const showUpdateDomainModalFlag = ref(false)
const updateDomainLoadingFlag = ref(false)
const updateDomainModalId = 'update_domain_modal'
const {scrollToTop} = scollToTop()
const handlePageChange = (newPage) => {
  pageOptions.value.page = newPage
  listDomainRequest()
  scrollToTop()
};
const onLimitChange = (newLimit) => {
  pageOptions.value.page = 1
  pageOptions.value.limit = newLimit.value
  listDomainRequest()
  scrollToTop()
};

function setDomainListProcessing(payload) {
  domainListProcessing.value = payload
  fetchError.value = null
}

function clearFetchError() {
  fetchError.value = null
}

function setFetchError(payload) {
  fetchError.value = payload
  currentDomainList.value = []
  Object.assign(currentDomain.value, defaultDomain.value);
  domainProcessing.value = false
  domainListProcessing.value = false
}

function setDomainList(payload) {
  currentDomainList.value = payload
  domainListProcessing.value = false
  fetchError.value = null
}

async function listDomainRequest() {
  clearFetchError()
  setDomainListProcessing(true)
  filterData.value.status =filterData.value.status ? filterData.value.status.key : null
  filterData.value.framework_id= filterData.value.framework ? filterData.value.framework.map(({id}) => id) : null

  const {data, error} = await API.listDomainRequest({...pageOptions.value,...cleaner(filterData.value)})
  if (data.value) {
    pageOptions.value = data.value.data.paginator
    pageOptions.value.totalPage = Math.ceil(pageOptions.value.count / pageOptions.value.limit)
    Object.assign(filterData.value, filterDataTemp.value)
    setDomainList(data.value.data.list)
    //if list api call from filter modal
    if (showFilterDomainModalFlag.value) {
      const modal = document.getElementById(filterDomainModalId)
      modal.close()
    }
  } else if (error.value) {
    setFetchError(error.value)
  }
  setDomainListProcessing(false)
  filterDomainLoadingFlag.value = false
}

function showAddDomainModal() {
  if (frameworkListProcessing.value) {
    return
  }
  showAddDomainModalFlag.value = true
  const modal = document.getElementById(addDomainModalId);
  modal.showModal();
}

async function addDomain(domain) {
  if (domain == null) {
    resetAddDomainData();
  }
  delete domain.id
  const {data, error} = await API.addDomainRequest(domain)
  if (data.value) {
    setDomainListProcessing(true)
    resetAddDomainData()
    removeFilterData()
  } else if (error.value) {
    addDomainLoadingFlag.value = false
    ///TODO:set alert for error in delete member
  }
}

function confirmUpdateStatusDomain(domain) {
  Object.assign(currentDomain.value, domain)
  const modal = document.getElementById('confirmation_update_status_domain');
  modal.showModal();
}

function cancelUpdateStatusDomain() {
  Object.assign(currentDomain.value, defaultDomain.value);
}

function updateStatusDomain() {
  setDomainListProcessing(true)
  currentDomain.value.status = 1 - currentDomain.value.status
  updateDomain({
    "id": currentDomain.value.id,
    "status": currentDomain.value.status,
  })
}

function onSubmitAddDomain() {
  if (!newDomain.value) {
    return
  } else {
    addDomainLoadingFlag.value = true
  }
  Object.assign(currentDomain.value, newDomain.value);
  currentDomain.value.status = currentDomain.value.status ? currentDomain.value.status.key : null;
  currentDomain.value.framework_id = currentDomain.value.framework ? currentDomain.value.framework.id : null;
  addDomain(currentDomain.value);
}

function resetAddDomainData() {
  //reset validation error message of form
  showAddDomainModalFlag.value = false
  addDomainLoadingFlag.value = false
  const modal = document.getElementById(addDomainModalId);
  modal.close();
}

///start update domain methods
function showUpdateDomainModal(domain) {
  if (frameworkListProcessing.value) {
    return
  }
  Object.assign(currentDomain.value, domain)
  currentDomain.value.status = statusList.find(status => status.key === domain.status)
  showUpdateDomainModalFlag.value = true
  const modal = document.getElementById(updateDomainModalId);
  modal.showModal();
}

function resetUpdateDomainData() {
  //reset validation error message of update form
  showUpdateDomainModalFlag.value = false
  updateDomainLoadingFlag.value = false
  Object.assign(currentDomain.value, defaultDomain.value);
  const modal = document.getElementById(updateDomainModalId)
  modal.close()
}

function onSubmitUpdateDomain() {
  if (!currentDomain.value) {
    return
  } else {
    updateDomainLoadingFlag.value = true
  }
  updateDomain({
    "id": currentDomain.value.id,
    "title": currentDomain.value.title,
    "status": currentDomain.value.status.key,
  })
}

async function updateDomain(domain) {
  if (domain == null) {
    resetUpdateDomainData()
  }
  const {data, error} = await API.updateDomainRequest(JSON.stringify(domain))
  if (data.value) {
    setDomainListProcessing(true)
    resetUpdateDomainData();
    await listDomainRequest();
  } else if (error.value) {
    updateDomainLoadingFlag.value = false
    ///TODO:set error handler for update member
  }
}

///start filter members list
function showFilterDomainModal() {
  Object.assign(filterDataTemp.value, filterData.value)
  showFilterDomainModalFlag.value = true
  const modal = document.getElementById(filterDomainModalId);
  modal.showModal();
}

function resetFilterDomainData() {
  showFilterDomainModalFlag.value = false
  filterDomainLoadingFlag.value = false
  const modal = document.getElementById(filterDomainModalId)
  modal.close()
}

function onSubmitFilterDomain() {
  pageOptions.value.page = 1
  Object.assign(filterData.value, filterDataTemp.value)
  filterDomainLoadingFlag.value = true
  listDomainRequest()
}

function removeFilterData() {
  pageOptions.value.page = 1
  Object.assign(filterData.value, filterDataDefault)
  Object.assign(filterDataTemp.value, filterDataDefault)
  filterDomainLoadingFlag.value = true
  listDomainRequest()
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

//reset form data of add domain
watch(showAddDomainModalFlag, () => {
  Object.assign(newDomain.value, defaultDomain.value)
})

listDomainRequest()
lightListFrameworkRequest()

</script>

<template>
  <div>

    <!--  modal of filter domain list  -->
    <FilterDomainModal
        :modalId="filterDomainModalId"
        :showFilterDomainModalFlag="showFilterDomainModalFlag"
        :filterDataTemp="filterDataTemp"
        :filterDomainLoadingFlag="filterDomainLoadingFlag"
        :frameworkList="frameworkList"
        :statusList="statusList"
        @resetFilterDomainData="resetFilterDomainData"
        @onSubmitFilterDomain="onSubmitFilterDomain"
        @removeFilterData="removeFilterData"
    />

    <!--  modal of add domain  -->
    <AddDomainModal
        :modalId="addDomainModalId"
        :showAddDomainModalFlag="showAddDomainModalFlag"
        :newDomain="newDomain"
        :statusList="statusList"
        :frameworkList="frameworkList"
        :addDomainLoadingFlag="addDomainLoadingFlag"
        @resetAddDomainData="resetAddDomainData"
        @onSubmitAddDomain="onSubmitAddDomain"
    />

    <!--  modal of update domain  -->
    <UpdateDomainModal
        :modalId="updateDomainModalId"
        :showUpdateDomainModalFlag="showUpdateDomainModalFlag"
        :currentDomain="currentDomain"
        :statusList="statusList"
        :frameworkList="frameworkList"
        :updateDomainLoadingFlag="updateDomainLoadingFlag"
        @resetUpdateDomainData="resetUpdateDomainData"
        @onSubmitUpdateDomain="onSubmitUpdateDomain"
    />

    <!--  modal of update status confirmation  -->
    <ConfirmationModal
        :accept="updateStatusDomain"
        :deny="cancelUpdateStatusDomain"
        id="confirmation_update_status_domain"
    >
      {{ $t('message.update-domain-confirmation') }} {{ currentDomain ? currentDomain.title : '' }}?
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
          <BaseButton class="btn-primary text-white" size="xs" :onclick="showAddDomainModal">
            <div class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"/>
              </svg>
              <span class="p-1">
                {{ $t("button.add-domain") }}
              </span>
            </div>
          </BaseButton>
          <BaseButton class="btn-secondary text-white" size="xs" @click="showFilterDomainModal">
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
            :is-loading="domainListProcessing"
            :data="currentDomainList"
            :headers="tableHeaders"
        >
          <template v-slot:cell(status)="{data,index}">
              <BaseToggleSwitch
                  :toggleActive="data.item.status===1"
                  @toggleAction="confirmUpdateStatusDomain(data.item)"
              />
<!--            <BaseButton-->
<!--                class="w-20 btn-xs text-xs btn-outline"-->
<!--                size="xs"-->
<!--                :class="{'btn-success':(data.item.status===1),'':!(data.item.status===1)}"-->
<!--                @click="confirmUpdateStatusDomain(data.item)"-->
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
                  @click="showUpdateDomainModal(data.item)"
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