<script setup>

import {ref, watch} from "vue";
import BaseTable from "@/components/table/BaseTable.vue";
import {useI18n} from "vue-i18n";
import API from "@/services/API.js";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import BasePagination from "@/components/table/BasePagination.vue";
import PerPage from "@/components/table/PerPage.vue";
import AddPageModal from "./AddPageModal.vue";
import FilterPageModal from "./FilterPageModal.vue";
import UpdatePageModal from "./UpdatePageModal.vue";
import {scollToTop} from "@/composables/scoll-to-top.js";
import cleaner from "@/composables/clean-object.js";
import {listSetting} from "@/constants/config.js";
import BaseToggleSwitch from "@/components/BaseToggleSwitch.vue";

const {t: $t} = useI18n()
const pageListProcessing = ref(false)
const pageProcessing = ref(false)
const fetchError = ref(false)
const currentPageList = ref([])
const statusList = [
  {'key': 1, 'title': 'Active'},
  {'key': 0, 'title': 'Inactive'}
]
const sectionList = [
  {'key': 'api', 'title': 'Api'},
  {'key': 'admin', 'title': 'Admin'}
]
const currentPage = ref({
  "key": null,
  "title": null,
  "module": null,
  "package": null,
  "resource": null,
  "handler": null,
  "section": null,
  "status": null,
})
const defaultPage = ref({
  "key": null,
  "title": null,
  "module": null,
  "package": null,
  "resource": null,
  "handler": null,
  "section": null,
  "status": null,
})
const newPage = ref({
  "key": null,
  "title": null,
  "module": null,
  "package": null,
  "resource": null,
  "handler": null,
  "section": null,
  "status": null,
})
const tableHeaders = [
  {label: "table.id", key: "id"},
  {label: "table.title", key: "title"},
  {label: "table.key", key: "key"},
  {label: "table.section", key: "section"},
  {label: "table.module", key: "module"},
  {label: "table.package", key: "package"},
  {label: "table.handler", key: "handler"},
  {label: "table.resource", key: "resource"},
  {label: "table.status", key: "status"},
  // {label: "table.action", key: "action"}
]
const pageOptions = ref({
  limit: listSetting.limit,
  page: 1,
  count: 0,
  totalPage: 1,
})
const limit = ref(10)
const addPageModalId = "add_page_modal"
//for handle validation error in filter page list
const showFilterPageModalFlag = ref(false)
const filterPageModalId = 'filter_page_modal'
const filterPageLoadingFlag = ref(false)
const filterDataDefault = {
  "title": null,
  "key": null,
  "module": null,
  "resource": null,
  "section": null,
}
const filterData = ref({
  "title": null,
  "key": null,
  "module": null,
  "resource": null,
  "section": null,
})
const filterDataTemp = ref({
  "title": null,
  "key": null,
  "module": null,
  "resource": null,
  "section": null,
})
//for handle validation error in add page
const showAddPageModalFlag = ref(false)
const addPageLoadingFlag = ref(false)
//for handle validation error in update page
const updatePageModalId = 'update_page_modal'
const showUpdatePageModalFlag = ref(false)
const updatePageLoadingFlag = ref(false)
const totalPages = ref(1);
const totalCount = ref(0)
const {scrollToTop} = scollToTop()
const handlePageChange = (newPage) => {
  pageOptions.value.page = newPage
  listPageRequest()
  scrollToTop()
};
const onLimitChange = (newLimit) => {
  pageOptions.value.page = 1
  pageOptions.value.limit = newLimit.value
  listPageRequest()
  scrollToTop()
};

function setPageListProcessing(payload) {
  pageListProcessing.value = payload
  fetchError.value = null
}

function clearFetchError() {
  fetchError.value = null
}

function setFetchError(payload) {
  fetchError.value = payload
  currentPageList.value = []
  Object.assign(currentPage.value, defaultPage.value);
  pageProcessing.value = false
  pageListProcessing.value = false
}

function setPageList(payload) {
  currentPageList.value = payload
  pageListProcessing.value = false
  fetchError.value = null
}

async function listPageRequest() {
  clearFetchError()
  setPageListProcessing(true)
  filterData.value.section=filterData.value.section?filterData.value.section.key:null
  const {data, error} = await API.listPagePermissionRequest({...pageOptions.value,...cleaner(filterData.value)})
  if (data.value) {
    pageOptions.value = data.value.data.paginator
    pageOptions.value.totalPage = Math.ceil(pageOptions.value.count / pageOptions.value.limit)
    setPageList(data.value.data.list)
    if (showFilterPageModalFlag.value) {
      const modal = document.getElementById(filterPageModalId)
      modal.close()
    }
  } else if (error.value) {
    setFetchError(error.value)
  }
  setPageListProcessing(false)
  filterPageLoadingFlag.value = false
}

function showAddPageModal() {
  showAddPageModalFlag.value = true
  Object.assign(currentPage.value, defaultPage.value)
  Object.assign(newPage.value, defaultPage.value)
  const modal = document.getElementById(addPageModalId);
  modal.showModal();
}

async function addPage(page) {
  if (page == null) {
    resetAddPageData();
  }
  ///TODO: kerloper: link to api
  resetAddPageData();
  removeFilterData();
  await listPageRequest()
}

function onSubmitAddPage() {
  if (!newPage.value) {
    return
  } else {
    addPageLoadingFlag.value = true
  }
  Object.assign(currentPage.value, newPage.value);
  currentPage.value.status = currentPage.value.status ? currentPage.value.status.key : 0;
  currentPage.value.section = currentPage.value.section ? currentPage.value.section.key : 'api';
  addPage(currentPage.value)
}

function resetAddPageData() {
  //reset validation error message of form
  showAddPageModalFlag.value = false
  addPageLoadingFlag.value = false
  const modal = document.getElementById(addPageModalId);
  modal.close();
}

///start update page methods
function showUpdatePageModal(page) {
  Object.assign(currentPage.value, page)
  showUpdatePageModalFlag.value = true
  currentPage.value.status = statusList.find(status => status.key === page.status)
  currentPage.value.section = sectionList.find(section => section.key === page.section)
  const modal = document.getElementById(updatePageModalId);
  modal.showModal();
}

function resetUpdatePageData() {
  //reset validation error message of update form
  showUpdatePageModalFlag.value = false
  updatePageLoadingFlag.value = false
  const modal = document.getElementById(updatePageModalId)
  modal.close()
}

function onSubmitUpdatePage() {
  if (!currentPage.value) {
    return
  } else {
    updatePageLoadingFlag.value = true
  }
  updatePage({
    "id": currentPage.value.id,
    "title": currentPage.value.title,
  })
}

async function updatePage(page) {
  if (page == null) {
    resetUpdatePageData()
  }
  ///TODO: kerloper: link to api
  resetUpdatePageData();
}

///start filter page list
function showFilterPageModal() {
  showFilterPageModalFlag.value = true
  const modal = document.getElementById(filterPageModalId);
  modal.showModal();
}

function resetFilterPageData() {
  showFilterPageModalFlag.value = false
  filterPageLoadingFlag.value = false
  const modal = document.getElementById(filterPageModalId)
  modal.close()
}

function onSubmitFilterPage() {
  pageOptions.value.page = 1
  Object.assign(filterData.value, filterDataTemp.value)
  filterPageLoadingFlag.value = true
  listPageRequest()
}

function removeFilterData() {
  pageOptions.value.page = 1
  Object.assign(filterData.value, filterDataDefault)
  Object.assign(filterDataTemp.value, filterDataDefault)
  filterPageLoadingFlag.value = true
  listPageRequest()
}

function resetDeletePage() {
  const modal = document.getElementById('confirmation_delete_page');
  modal.close();
}

//reset form data of add page
watch(showAddPageModalFlag, () => {
  Object.assign(newPage.value, defaultPage.value)
})

listPageRequest()

</script>

<template>
  <div>

    <!--  modal of filter page list  -->
    <FilterPageModal
        :modalId="filterPageModalId"
        :showFilterPageModalFlag="showFilterPageModalFlag"
        :filterDataTemp="filterDataTemp"
        :sectionList="sectionList"
        :filterPageLoadingFlag="filterPageLoadingFlag"
        @resetFilterPageData="resetFilterPageData"
        @onSubmitFilterPage="onSubmitFilterPage"
        @removeFilterData="removeFilterData"
    />
    <!--  modal of add page  -->
    <AddPageModal
        :modalId="addPageModalId"
        :showAddPageModalFlag="showAddPageModalFlag"
        :newPage="newPage"
        :sectionList="sectionList"
        :statusList="statusList"
        :addPageLoadingFlag="addPageLoadingFlag"
        @resetAddPageData="resetAddPageData"
        @onSubmitAddPage="onSubmitAddPage"
    />
    <!--  modal of update page  -->
    <UpdatePageModal
        :modalId="updatePageModalId"
        :currentPage="currentPage"
        :statusList="statusList"
        :sectionList="sectionList"
        :showUpdatePageModalFlag="showUpdatePageModalFlag"
        :updatePageLoadingFlag="updatePageLoadingFlag"
        @onSubmitUpdatePage="onSubmitUpdatePage"
        @close="resetUpdatePageData"
    />

    <!--  modal of delete confirmation  -->
    <ConfirmationModal
        :accept="resetDeletePage"
        :deny="resetDeletePage"
        id="confirmation_delete_page"
    >
      {{ $t('message.delete-page-confirmation') }} ?
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
<!--          <BaseButton class="btn-primary text-white" size="xs" :onclick="showAddPageModal">-->
<!--            <div class="flex">-->
<!--              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"-->
<!--                   stroke="currentColor" class="size-5">-->
<!--                <path stroke-linecap="round" stroke-linejoin="round"-->
<!--                      d="M3 8.25V18a2.25 2.25 0 0 0 2.25 2.25h13.5A2.25 2.25 0 0 0 21 18V8.25m-18 0V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v2.25m-18 0h18M5.25 6h.008v.008H5.25V6ZM7.5 6h.008v.008H7.5V6Zm2.25 0h.008v.008H9.75V6Z"/>-->
<!--              </svg>-->
<!--              <span class="p-1">-->
<!--                {{ $t("button.add-page") }}-->
<!--              </span>-->
<!--            </div>-->
<!--          </BaseButton>-->
          <BaseButton class="btn-secondary text-white" size="xs" @click="showFilterPageModal">
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
            :is-loading="pageListProcessing"
            :data="currentPageList"
            :headers="tableHeaders"
        >
          <template v-slot:cell(status)="{data,index}">
            <BaseToggleSwitch
                :toggleActive="true"
            />
          </template>
          <template v-slot:cell(action)="{data,index}">
            <div class="flex gap-2">
              <BaseButton
                  size="xs"
                  @click="showUpdatePageModal(data.item)"
                  class="btn-primary tooltip text-white"
                  :data-tip="$t('tooltip.edit')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                </svg>
              </BaseButton>
              <BaseButton
                  size="xs"
                  class="btn-error tooltip text-white"
                  onclick="confirmation_delete_page.show()"
                  :data-tip="$t('tooltip.delete')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
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