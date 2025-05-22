<script setup>
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import {onMounted, ref} from 'vue'
import API from "@/services/API.js";
import AddLibraryModal from "@/views/app/ai-assistant/library/list/AddLibraryModal.vue";
import BaseTable from "@/components/table/BaseTable.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import UpdateLibraryModal from "@/views/app/ai-assistant/library/list/UpdateLibraryModal.vue";
import BaseToggleSwitch from "@/components/BaseToggleSwitch.vue";
import {useGlobalFileDownload} from "@/composables/global-file-download.js";


const {downloadImage} = useGlobalFileDownload();
const isLoadingLibraryList = ref(true)
const fileList = ref([])
const libraryList = ref([])
const addLibraryModalId = "add_library_modal"
const showAddLibraryModalFlag = ref(false)
const addLibraryLoadingFlag = ref(false)
const updateLibraryModalId = "update_library_modal"
const showUpdateLibraryModalFlag = ref(false)
const updateLibraryLoadingFlag = ref(false)
const tableHeaders = [
  {label: "table.title", key: "title"},
  {label: "table.lib-id", key: "libId"},
  {label: "table.status", key: "status"},
  {label: "table.visible", key: "visible"},
  {label: "table.action", key: "action"}
]
const currentLibrary = ref({})
const isLoadingUpdateLibraryFlag = ref(false)
const showUpdateLibraryVisibleModalFlag = ref(false)

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

function showAddLibraryModal() {
  showAddLibraryModalFlag.value = true
  setTimeout(function () {
    const modal = document.getElementById(addLibraryModalId);
    modal.showModal();
  }, 100)
}

function closeAddLibraryModal() {
  showAddLibraryModalFlag.value = false
}

function onSubmitAddLibrary() {
  showAddLibraryModalFlag.value = false
  fetchData()
}

function closeUpdateLibraryModal() {
  showUpdateLibraryModalFlag.value = false
}

function onSubmitUpdateLibrary() {
  showUpdateLibraryModalFlag.value = false
  fetchData()
}

const fetchData = async () => {

  const [libraries] = await Promise.all([
    listLibraryRequest(),
  ]);

  let index = 0
  for (const item of libraries) {
    if (item?.icon?.type === 'file'){
      libraries[index].icon.src =  await downloadImage(item?.icon?.value)
    }
    index++
  }

  libraryList.value = libraries;
  isLoadingLibraryList.value = false

};

// Fetch data when the component mounts
onMounted(fetchData);


const showUpdateLibraryStatusModalFlag = ref(false)

function showUpdateLibraryStatusModal(library) {
  Object.assign(currentLibrary.value, library)
  showUpdateLibraryStatusModalFlag.value = true
  setTimeout(function () {
    const modal = document.getElementById('confirmation_update_status_library');
    modal.showModal();
  }, 100)
}

async function updateLibraryStatus() {
  let request = {
    id: currentLibrary.value._id,
    status: 1 - currentLibrary.value.status
  }
  isLoadingUpdateLibraryFlag.value = true
  const {data, error} = await API.updateLibraryRequest(request);
  if (data.value) {
    await fetchData()
  }
  resetUpdateLibrary()
}

function showUpdateLibraryVisibleModal(library) {
  Object.assign(currentLibrary.value, library)
  showUpdateLibraryVisibleModalFlag.value = true
  setTimeout(function () {
    const modal = document.getElementById('confirmation_update_visible_library');
    modal.showModal();
  }, 100)
}

function showUpdateLibraryModal(library) {
  //Deep Copy
  Object.assign(currentLibrary.value, JSON.parse(JSON.stringify(library)));
  showUpdateLibraryModalFlag.value = true
  setTimeout(function () {
    const modal = document.getElementById('update_library_modal');
    modal.showModal();
  }, 100)
}

function resetUpdateLibrary() {
  showUpdateLibraryStatusModalFlag.value = false
  showUpdateLibraryVisibleModalFlag.value = false
  showUpdateLibraryModalFlag.value = false
}

async function updateLibraryVisible() {
  let request = {
    id: currentLibrary.value._id,
    visible: !currentLibrary.value.visible
  }
  isLoadingUpdateLibraryFlag.value = true
  const {data, error} = await API.updateLibraryRequest(request);
  if (data.value) {
    await fetchData()
  }
  resetUpdateLibrary()
}

</script>

<template>
  <div>

    <div v-if="showUpdateLibraryStatusModalFlag">
      <ConfirmationModal
          :accept="updateLibraryStatus"
          :deny="resetUpdateLibrary"
          id="confirmation_update_status_library"
      >
        {{ $t('message.update-library-status-confirmation') }} {{ currentLibrary ? currentLibrary.title : '' }}?
      </ConfirmationModal>
    </div>

    <div v-if="showUpdateLibraryVisibleModalFlag">
      <ConfirmationModal
          :accept="updateLibraryVisible"
          :deny="resetUpdateLibrary"
          id="confirmation_update_visible_library"
      >
        {{ $t('message.update-library-visible-confirmation') }} {{ currentLibrary ? currentLibrary.title : '' }}?
      </ConfirmationModal>
    </div>

    <div v-if="showAddLibraryModalFlag">
      <AddLibraryModal
          :modalId="addLibraryModalId"
          :addLibraryLoadingFlag="addLibraryLoadingFlag"
          :showAddLibraryModalFlag="showAddLibraryModalFlag"
          @closeAddLibraryModal="closeAddLibraryModal"
          @onSubmitAddLibrary="onSubmitAddLibrary"
      />
    </div>

    <div v-if="showUpdateLibraryModalFlag">
      <UpdateLibraryModal
          :modalId="updateLibraryModalId"
          :library="currentLibrary"
          :updateLibraryLoadingFlag="updateLibraryLoadingFlag"
          :showUpdateLibraryModalFlag="showUpdateLibraryModalFlag"
          @closeUpdateLibraryModal="closeUpdateLibraryModal"
          @onSubmitUpdateLibrary="onSubmitUpdateLibrary"
      />
    </div>

    <BaseCard>
      <div class="flex justify-between border-b-2 pb-2">
        <div>
        </div>
        <div class="flex gap-2">
          <BaseButton class="btn-primary text-white" size="xs" @click="showAddLibraryModal">
            <div class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3"/>
              </svg>
              <span class="p-1">
                {{ $t("button.add-library") }}
              </span>
            </div>
          </BaseButton>
        </div>
      </div>
      <div class="min-card-height-table">
        <BaseTable
            :data="libraryList"
            :is-loading="isLoadingLibraryList"
            :headers="tableHeaders"
        >
          <template v-slot:cell(title)="{data,index}">
            <div class="flex flex-row gap-3">
              <img v-if="data.item.icon?.type==='file'"
                   :src="data.item.icon?.src"
                   class="h-10 object-contain"
                   alt=""
              />
              <img v-else
                   src="../../../../../assets/icons/ai/ai.png"
                   class="h-10 object-contain"
                   alt=""
              />
              <div class="relative w-full min-w-32">
                <div class="absolute bottom-1">{{ data.item.title }}</div>
              </div>
            </div>
          </template>
          <template v-slot:cell(status)="{data,index}">
            <BaseToggleSwitch
                :toggleActive="data.item.status===1"
                @toggleAction="showUpdateLibraryStatusModal(data.item)"
            />
          </template>
          <template v-slot:cell(visible)="{data,index}">
            <BaseToggleSwitch
                :toggleActive="data.item.visible"
                @toggleAction="showUpdateLibraryVisibleModal(data.item)"
            />
          </template>

          <template v-slot:cell(action)="{data,index}">
            <div class="flex gap-2">
              <BaseButton
                  size="xs"
                  @click="showUpdateLibraryModal(data.item)"
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
      </template>
    </BaseCard>


  </div>
</template>

<style scoped>

</style>