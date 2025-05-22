<script setup>

import {ref} from "vue";
import BaseTable from "@/components/table/BaseTable.vue";
import {useI18n} from "vue-i18n";
import API from "@/services/API.js";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import router from "@/router/index.js";
import PerPage from "@/components/table/PerPage.vue";
import BasePagination from "@/components/table/BasePagination.vue";
import AddDocumentModal from "@/views/app/workflow/document/list/AddDocumentModal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import UpdateDocumentModal from "@/views/app/workflow/document/list/UpdateDocumentModal.vue";
import UpdateSchedulerDocumentModal from "@/views/app/workflow/document/list/UpdateSchedulerDocumentModal.vue";
import {listSetting} from "@/constants/config.js";

const {t: $t} = useI18n()
const inflowDocumentListProcessing = ref(false)
const inflowDocumentProcessing = ref(false)
const fetchError = ref(false)
const currentInflowDocumentList = ref([])
const tableHeaders = [
  {label: "table.id", key: "id"},
  {label: "table.title", key: "title"},
  {label: "table.id", key: "id"},
  {label: "table.gateway", key: "gateway"},
  {label: "table.document-id", key: "document"},
  {label: "table.field", key: "field"},
  {label: "table.action", key: "action"},
]
const pageOptions = ref({
  limit: listSetting.limit,
  page: 1,
  count: 0,
  totalPage: 1,
})
const policyList=ref([])
const showUpdateDocumentModalFlag = ref(false)
const updateDocumentModalId = 'update_document_modal'
const updateDocumentLoadingFlag = ref(false)

//for handle validation error in add document
const showAddDocumentModalFlag = ref(false)
const addDocumentModalId = 'add_document_modal'
const addDocumentLoadingFlag = ref(false)
const currentDocument = ref({
  docId: null,
  id: null,
  title: null,
  field: null
})
const defaultDocument = {
  docId: null,
  id: null,
  title: null,
  field: null
}
const newDocument = ref({
  docId: null,
  id: null,
  title: null,
  field: null
})
const currentSchedulerDocument = ref([])
const showUpdateSchedulerDocumentModalFlag = ref(false)
const updateSchedulerDocumentModalId = 'update_scheduler_document_modal'
const updateSchedulerDocumentLoadingFlag = ref(false)


function showAddDocumentModal() {
  Object.assign(currentDocument.value,defaultDocument)
  Object.assign(newDocument.value,defaultDocument)
  showAddDocumentModalFlag.value = true
  const modal = document.getElementById(addDocumentModalId);
  modal.showModal();
}

async function addDocument(document) {
  if (document == null) {
    resetAddDocumentData();
  }
  var request = {
    headers:{
      info:{
        id: currentDocument.value.id,
        title: currentDocument.value.title,
        field: currentDocument.value.field,
      }
    },
    data:{}
  }
  const {data, error} = await API.addDocumentRequest(request)
  if (data.value) {
    resetAddDocumentData()
  } else if (error.value) {
    addDocumentLoadingFlag.value = false
    ///TODO:set alert for error in delete document
  }
  await listInflowDocumentRequest()
}

function onSubmitAddDocument() {
  if (!newDocument.value) {
    return
  } else {
    addDocumentLoadingFlag.value = true
  }
  Object.assign(currentDocument.value, newDocument.value);
  addDocument(currentDocument.value);
}

function resetAddDocumentData() {
  showAddDocumentModalFlag.value = false
  addDocumentLoadingFlag.value = false
  const modal = document.getElementById(addDocumentModalId);
  modal.close();
}

function setInflowDocumentListProcessing(payload) {
  inflowDocumentListProcessing.value = payload
  fetchError.value = null
}

function clearFetchError() {
  fetchError.value = null
}

function setFetchError(payload) {
  fetchError.value = payload
  currentInflowDocumentList.value = []
  inflowDocumentProcessing.value = false
  inflowDocumentListProcessing.value = false
}

function setInflowDocumentList(payload) {
  currentInflowDocumentList.value = payload
  inflowDocumentListProcessing.value = false
  fetchError.value = null
}

async function listInflowDocumentRequest() {
  clearFetchError()
  setInflowDocumentListProcessing(true)
  const {data, error} = await API.listInflowDocumentRequest({...pageOptions.value})
  if (data.value) {
    let resp = JSON.parse(data.value).data
    pageOptions.value.count = resp.count
    pageOptions.value.totalPage = Math.ceil(resp.count / pageOptions.value.limit)
    setInflowDocumentList(resp.list)
  } else if (error.value) {
    setFetchError(error.value)
  }
  setInflowDocumentListProcessing(false)
}

function showInflow(data) {
  router.push({
    path: `/app/workflow/document/document-detail/${data.id}`
  });
}

const handlePageChange = (newPage) => {
  pageOptions.value.page = newPage
  listInflowDocumentRequest()
  scrollToTop()
};
const onLimitChange = (newLimit) => {
  pageOptions.value.page = 1
  pageOptions.value.limit = newLimit.value
  listInflowDocumentRequest()
  scrollToTop()
};

function confirmDeleteDocument(selectedDocument) {
  Object.assign(currentDocument.value, selectedDocument);
  const modal = document.getElementById('confirmation_delete_document');
  modal.showModal();
}

function cancelDeleteDocument() {
  Object.assign(currentDocument.value, defaultDocument);
}

function deleteDocument() {
  deleteDocumentRequest(currentDocument.value);
}

async function deleteDocumentRequest(document) {
  if (document == null) {
    cancelDeleteDocument();
  }
  setInflowDocumentListProcessing(true)
  const {data, error} = await API.deleteDocumentRequest(document.id)
  if (data.value) {
    await listInflowDocumentRequest();
  } else if (error.value) {
    ///TODO:set alert for error in delete document
  }
}


///start update document methods
function showUpdateDocumentModal(selectedDocument) {
  Object.assign(currentDocument.value, selectedDocument.headers.info)
  currentDocument.value.docId= selectedDocument.id
  showUpdateDocumentModalFlag.value = true
  const modal = document.getElementById(updateDocumentModalId);
  modal.showModal();
}

function resetUpdateDocumentData() {
  //reset validation error message of update form
  showUpdateDocumentModalFlag.value = false
  updateDocumentLoadingFlag.value = false
  const modal = document.getElementById(updateDocumentModalId)
  modal.close()
}

function onSubmitUpdateDocument(updatedDocument) {
  if (!updatedDocument) {
    return
  } else {
    updateDocumentLoadingFlag.value = true
  }
  updateDocument(updatedDocument)
}

async function updateDocument(document) {
  if (document == null) {
    resetUpdateDocumentData()
  }
  const {data, error} = await API.updateInflowDocumentRequest(document)
  if (data.value) {
    resetUpdateDocumentData();
    await listInflowDocumentRequest();
  } else if (error.value) {
    updateDocumentLoadingFlag.value = false
    ///TODO:set error handler for update document
  }
}

///start update scheduler document methods
function showUpdateSchedulerDocumentModal(selectedDocument) {
  const tempList = selectedDocument.schedule??[]
  for (let i = 0; i < tempList.length; i++) {
    const policy = policyList.value.find((item) => item.identifier === tempList[i].policy_identifier)
    tempList[i].policy_identifier =policy??null
  }
  Object.assign(currentSchedulerDocument.value,tempList )
  Object.assign(currentDocument.value, selectedDocument )
  showUpdateSchedulerDocumentModalFlag.value = true
  const modal = document.getElementById(updateSchedulerDocumentModalId);
  modal.showModal();
}

function resetUpdateSchedulerDocumentData() {
  //reset validation error message of update form
  showUpdateSchedulerDocumentModalFlag.value = false
  updateSchedulerDocumentLoadingFlag.value = false
  const modal = document.getElementById(updateSchedulerDocumentModalId)
  modal.close()
}

function onSubmitUpdateSchedulerDocument(scheduleList) {
  updateSchedulerDocumentLoadingFlag.value = true
  currentDocument.value.schedule = scheduleList
  updateSchedulerDocument(currentDocument)
}

async function updateSchedulerDocument(document) {
  if (document == null) {
    resetUpdateSchedulerDocumentData()
  }
  const {data, error} = await API.updateInflowSchedulerDocumentRequest({
    docId: document.value.id,
    schedule:document.value.schedule??[]
  })
  if (data.value) {
    resetUpdateSchedulerDocumentData();
    await listInflowDocumentRequest();
  } else if (error.value) {
    updateSchedulerDocumentLoadingFlag.value = false
    ///TODO:set error handler for update document
  }
}


async function listInflowPolicyRequest() {
  const {data, error} = await API.listInflowPolicyRequest({...pageOptions.value})
  if (data.value) {
    let resp = JSON.parse(data.value).data
    policyList.value = resp.list
  } else if (error.value) {
  }
}


listInflowDocumentRequest()
listInflowPolicyRequest()
</script>

<template>
  <div>

    <!--  modal of add document  -->
    <AddDocumentModal
        :modalId="addDocumentModalId"
        :showAddDocumentModalFlag="showAddDocumentModalFlag"
        :newDocument="newDocument"
        :addDocumentLoadingFlag="addDocumentLoadingFlag"
        @resetAddDocumentData="resetAddDocumentData"
        @onSubmitAddDocument="onSubmitAddDocument"
    />

    <!--  modal of update document  -->
    <UpdateDocumentModal
        :modalId="updateDocumentModalId"
        :showUpdateDocumentModalFlag="showUpdateDocumentModalFlag"
        :currentDocument="currentDocument"
        :updateDocumentLoadingFlag="updateDocumentLoadingFlag"
        @resetUpdateDocumentData="resetUpdateDocumentData"
        @onSubmitUpdateDocument="onSubmitUpdateDocument"
    />

    <!--  modal of update scheduler document  -->
    <UpdateSchedulerDocumentModal
        :modalId="updateSchedulerDocumentModalId"
        :showUpdateSchedulerDocumentModalFlag="showUpdateSchedulerDocumentModalFlag"
        :currentSchedulerDocument="currentSchedulerDocument"
        :policyList="policyList"
        :updateSchedulerDocumentLoadingFlag="updateSchedulerDocumentLoadingFlag"
        @resetUpdateSchedulerDocumentData="resetUpdateSchedulerDocumentData"
        @onSubmitUpdateSchedulerDocument="onSubmitUpdateSchedulerDocument"
    />


    <!--  modal of delete confirmation  -->
    <ConfirmationModal
        :accept="deleteDocument"
        :deny="cancelDeleteDocument"
        id="confirmation_delete_document"
    >
      {{ $t('message.delete-document-confirmation') }} {{ currentDocument ? currentDocument.title : '' }}?
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
          <BaseButton class="btn-primary text-white" size="xs" :onclick="showAddDocumentModal">
            <div class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"/>
              </svg>
              <span class="p-1">
                {{ $t("button.add-document") }}
              </span>
            </div>
          </BaseButton>
        </div>
      </div>
      <div class="min-card-height-table">
        <BaseTable
            :is-loading="inflowDocumentListProcessing"
            :data="currentInflowDocumentList"
            :headers="tableHeaders"
        >
          <template v-slot:cell(title)="{data,index}">
                {{data.item.headers?data.item.headers.info?data.item.headers.info.title??"":"" :"" }}
          </template>
          <template v-slot:cell(gateway)="{data,index}">
                {{data.item.gateway.name }}
          </template>
          <template v-slot:cell(field)="{data,index}">
            {{data.item.headers?data.item.headers.info?data.item.headers.info.field??"":"" :"" }}
          </template>
          <template v-slot:cell(document)="{data,index}">
            {{data.item.headers?data.item.headers.info?data.item.headers.info.id??"":"" :"" }}
          </template>
          <template v-slot:cell(action)="{data,index}">
            <div class="flex gap-2">
              <BaseButton
                  size="xs"
                  @click="showInflow(data.item)"
                  class=" btn btn-outline tooltip"
                  :data-tip="$t('tooltip.view')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                </svg>
              </BaseButton>
              <BaseButton
                  size="xs"
                  @click="showUpdateDocumentModal(data.item)"
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
                  @click="showUpdateSchedulerDocumentModal(data.item)"
                  class="btn-outline tooltip"
                  :data-tip="$t('tooltip.scheduler')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                </svg>
              </BaseButton>
              <BaseButton
                  size="xs"
                  @click="confirmDeleteDocument(data.item)"
                  class=" text-white tooltip btn-error"
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