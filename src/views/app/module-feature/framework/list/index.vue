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
import AddFrameworkModal from "./AddFrameworkModal.vue";
import UpdateFrameworkModal from "./UpdateFrameworkModal.vue";
import FilterFrameworkModal from "./FilterFrameworkModal.vue";
import {scollToTop} from "@/composables/scoll-to-top.js";
import cleaner from "@/composables/clean-object.js";
import {listSetting} from "@/constants/config.js";
import BaseToggleSwitch from "@/components/BaseToggleSwitch.vue";

const {t: $t} = useI18n()
const frameworkListProcessing = ref(false)
const frameworkProcessing = ref(false)
const fetchError = ref(false)
const currentFrameworkList = ref([])
const statusList = [
  {'key': 1, 'title': 'Active'},
  {'key': 0, 'title': 'Inactive'}
]
const currentFramework = ref({
  "id": null,
  "title": null,
  "slug": null,
  "price": null,
  "description": null,
  "status": null,
  "square_image": null,
  "circle_image": null
})
const defaultFramework = ref({
  "id": null,
  "title": null,
  "slug": null,
  "price": null,
  "description": null,
  "status": null,
  "square_image": null,
  "circle_image": null
})
const newFramework = ref({
  "id": null,
  "title": null,
  "slug": null,
  "status": null,
  "price": null,
  "description": null,
  "square_image": null,
  "circle_image": null
})
//for handle validation error in filter members list
const filterFrameworkModalId = 'filter_framework_modal'
const showFilterFrameworkModalFlag = ref(false)
const filterFrameworkLoadingFlag = ref(false)
const filterDataDefault = {
  "title": ""
}
const filterData = ref({
  "title": ""
})
const filterDataTemp = ref({
  "title": ""
})
const tableHeaders = [
  {label: "table.id", key: "id"},
  {label: "table.title", key: "title"},
  {label: "table.slug", key: "slug"},
  {label: "table.status", key: "status"},
  {label: "table.action", key: "action"}
]
const pageOptions = ref({
  limit: listSetting.limit,
  page: 1,
  count: 0,
  totalPage: 1,
})
const showAddFrameworkModalFlag = ref(false)
const addFrameworkModalId = 'add_framework_modal'
const addFrameworkLoadingFlag = ref(false)
const resourceList = ref([])
//for handle validation error in update framework
const showUpdateFrameworkModalFlag = ref(false)
const updateFrameworkLoadingFlag = ref(false)
const updateFrameworkModalId = 'update_framework_modal'
const limit = ref(10)
const page = ref(1)
const totalPages = ref(1);
const totalCount = ref(0)
const {scrollToTop} = scollToTop()
const handlePageChange = (newPage) => {
  pageOptions.value.page = newPage
  listFrameworkRequest()
  scrollToTop()
};
const onLimitChange = (newLimit) => {
  pageOptions.value.page = 1
  pageOptions.value.limit = newLimit.value
  listFrameworkRequest()
  scrollToTop()
};

function setFrameworkListProcessing(payload) {
  frameworkListProcessing.value = payload
  fetchError.value = null
}

function clearFetchError() {
  fetchError.value = null
}

function setFetchError(payload) {
  fetchError.value = payload
  currentFrameworkList.value = []
  Object.assign(currentFramework.value, defaultFramework.value);
  frameworkProcessing.value = false
  frameworkListProcessing.value = false
}

function setFrameworkList(payload) {
  currentFrameworkList.value = payload
  frameworkListProcessing.value = false
  fetchError.value = null
}

async function listFrameworkRequest() {
  clearFetchError()
  setFrameworkListProcessing(true)
  const {data, error} = await API.listFrameworkRequest({...pageOptions.value,...cleaner(filterData.value)})
  if (data.value) {
    pageOptions.value = data.value.data.paginator
    pageOptions.value.totalPage = Math.ceil(pageOptions.value.count / pageOptions.value.limit)
    Object.assign(filterData.value, filterDataTemp.value)
    setFrameworkList(data.value.data.list)
    //if list api call from filter modal
    if (showFilterFrameworkModalFlag.value) {
      const modal = document.getElementById(filterFrameworkModalId)
      modal.close()
    }
  } else if (error.value) {
    setFetchError(error.value)
  }
  setFrameworkListProcessing(false)
  filterFrameworkLoadingFlag.value = false
}

function showAddFrameworkModal() {
  showAddFrameworkModalFlag.value = true
  const modal = document.getElementById(addFrameworkModalId);
  modal.showModal();
}

async function addFramework(framework) {
  if (framework == null) {
    resetAddFrameworkData();
  }
  delete framework.id
  const {data, error} = await API.addFrameworkRequest(framework)
  if (data.value) {
    setFrameworkListProcessing(true)
    resetAddFrameworkData()
    removeFilterData()
  } else if (error.value) {
    addFrameworkLoadingFlag.value = false
    ///TODO:set alert for error in delete member
  }
}

function confirmUpdateStatusFramework(framework) {
  Object.assign(currentFramework.value, framework)
  const modal = document.getElementById('confirmation_update_status_framework');
  modal.showModal();
}

function cancelUpdateStatusFramework() {
  Object.assign(currentFramework.value, defaultFramework.value);
}

function updateStatusFramework() {
  setFrameworkListProcessing(true)
  currentFramework.value.status = 1 - currentFramework.value.status
  updateFramework({
    "id": currentFramework.value.id,
    "status": currentFramework.value.status,
  })
}

function onSubmitAddFramework() {
  if (!newFramework.value) {
    return
  } else {
    addFrameworkLoadingFlag.value = true
  }
  Object.assign(currentFramework.value, newFramework.value);
  currentFramework.value.status = currentFramework.value.status ? currentFramework.value.status.key : null;
  addFramework(currentFramework.value);
}

function resetAddFrameworkData() {
  //reset validation error message of form
  showAddFrameworkModalFlag.value = false
  addFrameworkLoadingFlag.value = false
  const modal = document.getElementById(addFrameworkModalId);
  modal.close();
}

///start update framework methods
function showUpdateFrameworkModal(framework) {
  Object.assign(currentFramework.value, framework)
  currentFramework.value.status = statusList.find(status => status.key === framework.status)
  currentFramework.value.square_image = framework.information ? framework.information.square_image : null;
  currentFramework.value.circle_image = framework.information ? framework.information.circle_image : null;
  currentFramework.value.description = framework.information ? framework.information?.description : null;
  showUpdateFrameworkModalFlag.value = true
  const modal = document.getElementById(updateFrameworkModalId);
  modal.showModal();
}

function resetUpdateFrameworkData() {
  //reset validation error message of update form
  showUpdateFrameworkModalFlag.value = false
  updateFrameworkLoadingFlag.value = false
  Object.assign(currentFramework.value, defaultFramework.value);
  const modal = document.getElementById(updateFrameworkModalId)
  modal.close()
}

function onSubmitUpdateFramework() {
  if (!currentFramework.value) {
    return
  } else {
    updateFrameworkLoadingFlag.value = true
  }
  updateFramework({
    "id": currentFramework.value.id,
    "title": currentFramework.value.title,
    "circle_image": currentFramework.value.circle_image,
    "square_image": currentFramework.value.square_image,
    "status": currentFramework.value.status.key,
  })
}

async function updateFramework(framework) {
  if (framework == null) {
    resetUpdateFrameworkData()
  }
  const {data, error} = await API.updateFrameworkRequest(JSON.stringify(framework))
  if (data.value) {
    setFrameworkListProcessing(true)
    resetUpdateFrameworkData();
    await listFrameworkRequest();
  } else if (error.value) {
    updateFrameworkLoadingFlag.value = false
    ///TODO:set error handler for update member
  }
}

///start filter members list
function showFilterFrameworkModal() {
  Object.assign(filterDataTemp.value, filterData.value)
  showFilterFrameworkModalFlag.value = true
  const modal = document.getElementById(filterFrameworkModalId);
  modal.showModal();
}

function resetFilterFrameworkData() {
  showFilterFrameworkModalFlag.value = false
  filterFrameworkLoadingFlag.value = false
  const modal = document.getElementById(filterFrameworkModalId)
  modal.close()
}

function onSubmitFilterFramework() {
  pageOptions.value.page = 1
  Object.assign(filterData.value, filterDataTemp.value)
  filterFrameworkLoadingFlag.value = true
  listFrameworkRequest()
}

function removeFilterData() {
  pageOptions.value.page = 1
  Object.assign(filterData.value, filterDataDefault)
  Object.assign(filterDataTemp.value, filterDataDefault)
  filterFrameworkLoadingFlag.value = true
  listFrameworkRequest()
}

//reset form data of add framework
watch(showAddFrameworkModalFlag, () => {
  Object.assign(newFramework.value, defaultFramework.value)
})

//reset form data of add framework
watch(showUpdateFrameworkModalFlag, () => {
})

listFrameworkRequest()

</script>

<template>
  <div>

    <!--  modal of filter framework list  -->
    <FilterFrameworkModal
        :modalId="filterFrameworkModalId"
        :showFilterFrameworkModalFlag="showFilterFrameworkModalFlag"
        :filterDataTemp="filterDataTemp"
        :filterFrameworkLoadingFlag="filterFrameworkLoadingFlag"
        @resetFilterFrameworkData="resetFilterFrameworkData"
        @onSubmitFilterFramework="onSubmitFilterFramework"
        @removeFilterData="removeFilterData"
    />

    <!--  modal of add framework  -->
    <AddFrameworkModal
        :modalId="addFrameworkModalId"
        :showAddFrameworkModalFlag="showAddFrameworkModalFlag"
        :newFramework="newFramework"
        :statusList="statusList"
        :addFrameworkLoadingFlag="addFrameworkLoadingFlag"
        @resetAddFrameworkData="resetAddFrameworkData"
        @onSubmitAddFramework="onSubmitAddFramework"
    />

    <!--  modal of update framework  -->
    <UpdateFrameworkModal
        :modalId="updateFrameworkModalId"
        :showUpdateFrameworkModalFlag="showUpdateFrameworkModalFlag"
        :currentFramework="currentFramework"
        :statusList="statusList"
        :resourceList="resourceList"
        :updateFrameworkLoadingFlag="updateFrameworkLoadingFlag"
        @resetUpdateFrameworkData="resetUpdateFrameworkData"
        @onSubmitUpdateFramework="onSubmitUpdateFramework"
    />

    <!--  modal of update status confirmation  -->
    <ConfirmationModal
        :accept="updateStatusFramework"
        :deny="cancelUpdateStatusFramework"
        id="confirmation_update_status_framework"
    >
      {{ $t('message.update-framework-confirmation') }} {{ currentFramework ? currentFramework.title : '' }}?
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
          <BaseButton class="btn-primary text-white" size="xs" :onclick="showAddFrameworkModal">
            <div class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
              </svg>
              <span class="p-1">
                {{ $t("button.add-framework") }}
              </span>
            </div>
          </BaseButton>
          <BaseButton class="btn-secondary text-white" size="xs" @click="showFilterFrameworkModal">
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
            :is-loading="frameworkListProcessing"
            :data="currentFrameworkList"
            :headers="tableHeaders"
        >
          <template v-slot:cell(status)="{data,index}">
            <BaseToggleSwitch
                :toggleActive="data.item.status===1"
                @toggleAction="confirmUpdateStatusFramework(data.item)"
            />
          </template>
          <template v-slot:cell(title)="{data,index}">
            <div class="flex gap-3">
              <div>
                <img
                    :src="data.item.information.circle_image"
                    alt=""
                    class="w-10"
                >
              </div>
              <div class="mt-3">
              {{data.item.title}}
              </div>
            </div>
          </template>
          <template v-slot:cell(action)="{data,index}">
            <div class="flex gap-2">
              <BaseButton
                  size="xs"
                  @click="showUpdateFrameworkModal(data.item)"
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