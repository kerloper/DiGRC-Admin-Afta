<script setup>
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import {computed, onMounted, ref} from 'vue'
import UploadDocumentModal from "./UploadDocumentModal.vue";
import API from "@/services/API.js";
import AddToLibraryModal from "@/views/app/ai-assistant/knowledge/list/AddToLibraryModal.vue";
import FilterDocumentModal from "@/views/app/ai-assistant/knowledge/list/FilterDocumentModal.vue";
import {useVecFileDownload} from "@/composables/vec-file-download.js";
import Modal from "@/components/Modal.vue";
import KnowledgeInformationCard from "@/views/app/ai-assistant/knowledge/list/KnowledgeInformationCard.vue";
import BaseTable from "@/components/table/BaseTable.vue";
import DropDown from "@/components/DropDown.vue";
import PerPage from "@/components/table/PerPage.vue";
import {listSetting} from "@/constants/config.js";
import {useLocaleStore} from "@/stores/locale.js";

const {downloadFile} = useVecFileDownload();
const filterDocumentModalId = "filter_document_modal";
const addToLibraryDocumentModalId = "add_to_library_modal";
const showAddToLibraryModalFlag = ref(false)
const loadingQueue = ref([])
const showFilterDocumentModalFlag = ref(false)
const filterDocumentLoadingFlag = ref(false)
const filterDataDefault = {
  "library": null,
}
const filterData = ref({
  "library": null,
})
const filterDataTemp = ref({
  "library": null,
})
const currentDocument = ref({})
const showUpdateLibraryStatusModalFlag = ref(false)
const uploadDocumentModalId = "upload_document_modal";
const showUploadDocumentModalFlag = ref(false)
const isLoadingLibraryList = ref(true)
const isLoading = ref(true)
const fileList = ref([])
const libraryList = ref([])
const libraryKeyList = ref({})
const isRtl = computed(() => useLocaleStore().isRtl);
const increaseIcon = computed(() => isRtl?"»":"«")
const decreaseIcon = computed(() => isRtl?"«":"»")
// const fields = [
//   {label: "table.name", key: "name"},
//   {label: "table.original-name", key: "originalName"},
//   {label: "table.type", key: "type"},
//   {label: "table.bucket", key: "bucket"},
//   {label: "table.library", key: "library"},
//   {label: "table.process", key: "process"},
//   {key: 'action', label: ''},
// ]
const fields = [
  {label: "table.name", key: "name"},
  {label: "table.libraries", key: "libraries"},
  {key: 'action', label: ''},
]
const file = ref({})

function showUploadDocumentModal() {
  showUploadDocumentModalFlag.value = true
  setTimeout(function () {
    const modal = document.getElementById(uploadDocumentModalId);
    modal.showModal();
  }, 100)
}

function onSubmitUploadDocument() {
  showUploadDocumentModalFlag.value = false
  fetchData()
}

function resetUploadDocumentData() {
  showUploadDocumentModalFlag.value = false
}

function showAddToLibraryModal(item) {
  Object.assign(file.value, item)
  showAddToLibraryModalFlag.value = true
  setTimeout(function () {
    const modal = document.getElementById(addToLibraryDocumentModalId);
    modal.showModal();
  }, 100)
}

function resetAddToLibraryData() {
  showAddToLibraryModalFlag.value = false
}

function onSubmitAddToLibrary() {
  showAddToLibraryModalFlag.value = false
  Object.assign(file.value, {})
  fetchData()
}

async function listFileUploadedRequest() {
  isLoading.value = true
  let response = []
  const {data, error} = await API.listFileUploadedRequest({...filterData.value.library,...pageOptions.value})
  if (data.value) {
    response = data.value.data
  } else if (error.value) {
  }
  return response
}

async function listLibraryRequest() {
  isLoadingLibraryList.value = true
  let response = []
  const {data, error} = await API.listLibraryRequest()
  if (data.value) {
    response = data.value.data
  } else if (error.value) {
  }
  return response
}

const fetchData = async () => {
  try {
    const [files, libraries] = await Promise.all([
      listFileUploadedRequest(),
      listLibraryRequest(),
    ]);

    fileList.value = files;
    libraryList.value = libraries;
    libraries.forEach(library => {
      libraryKeyList.value[library['libId']] = library
    })
    isLoadingLibraryList.value = false
    isLoading.value = false
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
  }
};

// Fetch data when the component mounts
onMounted(fetchData);

function filterLibrary(list) {
  list.forEach((item, index) => {
    list[index]['information'] = libraryKeyList.value[item.libId]
  })
  return list;
}

function close() {
  showUpdateLibraryStatusModalFlag.value = false
}

///start filter document list
function showFilterDocumentModal() {
  Object.assign(filterDataTemp.value, filterData.value)
  showFilterDocumentModalFlag.value = true
  const modal = document.getElementById(filterDocumentModalId);
  modal.showModal();
}

function resetFilterDocumentData() {
  showFilterDocumentModalFlag.value = false
  filterDocumentLoadingFlag.value = false
  const modal = document.getElementById(filterDocumentModalId)
  modal.close()
}

function onSubmitFilterDocument() {
  Object.assign(filterData.value, filterDataTemp.value)
  resetFilterDocumentData()
  fetchData()
}

function removeFilterData() {
  Object.assign(filterData.value, filterDataDefault)
  Object.assign(filterDataTemp.value, filterDataDefault)
  resetFilterDocumentData()
  fetchData()
}

const downloadFileWithLoading = (fileName, index) => {
  loadingQueue.value[index] = true;
  requestDownloadFile(fileName, index);
};

const requestDownloadFile = async (fileName, index) => {
  try {
    await downloadFile(fileName);

  } finally {
    loadingQueue.value[index] = false;
  }
}

const showMoreModalDialog = ref(false)

function showMoreModal(item){
  Object.assign(currentDocument.value,item)
  showMoreModalDialog.value = true
  const modal = document.getElementById('document_libraries_list');
  modal.showModal();
}

const pageOptions = ref({
  limit: listSetting.limit,
  page: 1,
  count: 0,
  totalPage: null,
})
const onLimitChange = (newLimit) => {
  pageOptions.value.page = 1
  pageOptions.value.limit = newLimit.value
  fetchData()
}

function changePage(variable){
  pageOptions.value.page =  pageOptions.value.page+variable
  fetchData()
}

</script>
<template>
  <div>
    <Modal
        :custom-style="'max-w-3xl'"
        :title="`${currentDocument?currentDocument.name??'':''} ${$t('table.libraries')}`"
        id="document_libraries_list"
    >
      <KnowledgeInformationCard :knowledge="currentDocument"/>
    </Modal>
    <!--  modal of filter document list  -->
    <FilterDocumentModal
        :modalId="filterDocumentModalId"
        :showFilterDocumentModalFlag="showFilterDocumentModalFlag"
        :filterDataTemp="filterDataTemp"
        :filterDocumentLoadingFlag="filterDocumentLoadingFlag"
        :libraryList="libraryList"
        @resetFilterDocumentData="resetFilterDocumentData"
        @onSubmitFilterDocument="onSubmitFilterDocument"
        @removeFilterData="removeFilterData"
    />

    <!--  modal of upload document  -->
    <div v-if="showUploadDocumentModalFlag">
      <UploadDocumentModal
          :modalId="uploadDocumentModalId"
          :showUploadDocumentModalFlag="showUploadDocumentModalFlag"
          @close="close"
          @resetUploadDocumentData="resetUploadDocumentData"
          @onSubmitUploadDocument="onSubmitUploadDocument"
      />
    </div>

    <!--  add document to library  -->
    <div
        v-if="showAddToLibraryModalFlag"
    >
      <AddToLibraryModal
          :modalId="addToLibraryDocumentModalId"
          :showAddToLibraryModalFlag="showAddToLibraryModalFlag"
          :file="file"
          @close="close"
          @resetAddToLibraryData="resetAddToLibraryData"
          @onSubmitAddToLibrary="onSubmitAddToLibrary"
      />
    </div>

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
          <BaseButton class="btn-primary text-white" size="xs" :onclick="showUploadDocumentModal">
            <div class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              <span class="p-1">
                {{ $t("button.upload-document") }}
              </span>
            </div>
          </BaseButton>
          <BaseButton class="btn-secondary text-white" size="xs" @click="showFilterDocumentModal">
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
        <BaseTable :data="fileList" :headers="fields" :is-loading="isLoading" class="min-card-height-table">
          <template #cell(name)="{ data }">
            <div class="text-sm">
              {{ data.item.name }}
            </div>
          </template>
          <template #cell(libraries)="{ data }">
            <div class="flex gap-1 flex-wrap">
              <div
                  v-for="lib in data.item.libraries"
                  :key="lib.libId"
              >
                <BaseButton
                    class="btn btn-active tooltip"
                    size="xs"
                    :class="{
                      'btn-success':lib.process==='completed',
                      'btn-secondary':lib.process==='inProgress',
                      'btn-warning':lib.process==='pending',
                      'bg-error':lib.process==='failed',
                    }"
                    :data-tip="$t(`tooltip.${lib.process}`)"
                >
                  {{ lib.libId }}
                </BaseButton>
              </div>
            </div>
          </template>
          <template #cell(action)="{ data }">
            <div
                class="text-center"
                v-if="loadingQueue[fileList.indexOf(data.item)]"
            >
              <span class="loading loading-bars loading-sm"></span>
            </div>
            <div class="flex justify-end" v-else>

              <DropDown class="dropdown-end btn-secondary" size="xs" content-width="w-32">
                <span>{{ $t('button.action') }}</span>
                <template #actions>
                  <li class="my-1 flex flex-col gap-1">
                    <BaseButton class="btn-ghost" size="xs" @click="showAddToLibraryModal(data.item)">
                      {{ $t('button.add-to-library') }}
                    </BaseButton>
                    <BaseButton class="btn-ghost" size="xs" @click="downloadFileWithLoading(data.item.name,fileList.indexOf(data.item))">
                      {{ $t('button.download') }}
                    </BaseButton>
                    <BaseButton class="btn-ghost" size="xs"
                                @click="showMoreModal(data.item)">
                      {{ $t('button.detail') }}
                    </BaseButton>
                  </li>
                </template>
              </DropDown>
            </div>
          </template>
        </BaseTable>
      </div>
      <template v-slot:actions>
        <div class="w-full flex items-center justify-center border-t border-primary-200 pt-2" >
          <div class="join">
            <button
                :class="{
                'btn-disabled':pageOptions.page ===1,
                }"
                class="join-item btn btn-sm"
                @click="changePage(-1)"
            >
              {{ decreaseIcon }}
            </button>
            <button
                class="join-item btn font-medium btn-sm btn-primary text-white"
            >
              {{pageOptions.page}}
            </button>
            <button
                class="join-item btn btn-sm"
                :class="{
                'btn-disabled':fileList.length ===0,
                }"
                @click="changePage(+1)"
            >
              {{ increaseIcon }}
            </button>
          </div>
        </div>

      </template>
    </BaseCard>


  </div>
</template>

<style scoped>

</style>