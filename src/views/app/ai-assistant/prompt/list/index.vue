<script setup>

import {ref, watch} from "vue";
import BaseTable from "@/components/table/BaseTable.vue";
import {useI18n} from "vue-i18n";
import API from "@/services/API.js";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import Modal from "@/components/Modal.vue";
import AddPromptModal from "./AddPromptModal.vue";
import UpdatePromptModal from "./UpdatePromptModal.vue";
import BaseToggleSwitch from "@/components/BaseToggleSwitch.vue";

const {t: $t} = useI18n()
const promptListProcessing = ref(false)
const promptProcessing = ref(false)
const fetchError = ref(false)
const currentPromptList = ref([])
const currentPrompt = ref({})
const defaultPrompt = {
  "title": null,
  "slug": null,
  "prompt_text": null,
  "result_format": "markdown",
  "result_language": "english"
}
const newPrompt = ref({
  "title": null,
  "slug": null,
  "prompt_text": null,
  "result_format": "markdown",
  "result_language": "english"
})
const tableHeaders = [
  {label: "table.id", key: "id"},
  {label: "table.title", key: "title"},
  {label: "table.slug", key: "slug"},
  {label: "table.time-created", key: "time_created_view"},
  {label: "table.action", key: "action"}
]

//for handle validation error in add prompt
const showAddPromptModalFlag = ref(false)
const addPromptModalId = 'add_prompt_modal'
const addPromptLoadingFlag = ref(false)
//for handle validation error in update prompt
const showUpdatePromptModalFlag = ref(false)
const updatePromptModalId = 'update_prompt_modal'
const updatePromptLoadingFlag = ref(false)
//for handle show user log history
const showUserLogHistoryModalFlag = ref(false)
const userLogHistoryModalId = 'user_log_history_modal'

function setPromptListProcessing(payload) {
  promptListProcessing.value = payload
  fetchError.value = null
}

function clearFetchError() {
  fetchError.value = null
}

function setFetchError(payload) {
  fetchError.value = payload
  currentPromptList.value = []
  Object.assign(currentPrompt.value, defaultPrompt);
  promptProcessing.value = false
  promptListProcessing.value = false
}

function setPromptList(payload) {
  currentPromptList.value = payload
  promptListProcessing.value = false
  fetchError.value = null
}

async function listPromptRequest() {
  clearFetchError()
  setPromptListProcessing(true)
  const {data, error} = await API.listPromptRequest()
  if (data.value) {
    setPromptList(data.value.data.list)
  } else if (error.value) {
    setFetchError(error.value)
  }
  setPromptListProcessing(false)
}

function showAddPromptModal() {
  showAddPromptModalFlag.value = true
  const modal = document.getElementById(addPromptModalId);
  modal.showModal();
}

async function addPrompt(prompt) {
  if (prompt == null) {
    resetAddPromptData();
  }
  const {data, error} = await API.addPromptRequest(prompt)
  if (data.value) {
    setPromptListProcessing(true)
    resetAddPromptData()
    await listPromptRequest()
  } else if (error.value) {
    addPromptLoadingFlag.value = false
  }
}

function showPromptTextDialog(prompt) {
  Object.assign(currentPrompt.value, prompt);
  setTimeout(function (){
    const modal = document.getElementById('prompt_text_dialog');
    modal.showModal();
  },100)
}

function onSubmitAddPrompt() {
  if (!newPrompt.value) {
    return
  } else {
    addPromptLoadingFlag.value = true
  }
  Object.assign(currentPrompt.value, newPrompt.value);
  addPrompt(currentPrompt.value);
}

function resetAddPromptData() {
  //reset validation error message of form
  showAddPromptModalFlag.value = false
  addPromptLoadingFlag.value = false
  const modal = document.getElementById(addPromptModalId);
  modal.close();
}


///start update prompt methods
function showUpdatePromptModal(prompt) {
  Object.assign(currentPrompt.value, prompt)
  currentPrompt.value.prompt_text =prompt.information.prompt_text
  showUpdatePromptModalFlag.value = true
  const modal = document.getElementById(updatePromptModalId);
  modal.showModal();
}

function resetUpdatePromptData() {
  //reset validation error message of update form
  showUpdatePromptModalFlag.value = false
  updatePromptLoadingFlag.value = false
  const modal = document.getElementById(updatePromptModalId)
  modal.close()
}

function onSubmitUpdatePrompt() {
  if (!currentPrompt.value) {
    return
  } else {
    updatePromptLoadingFlag.value = true
  }
  updatePrompt({
    id: currentPrompt.value.id,
    "title": currentPrompt.value.title,
    "prompt_text": currentPrompt.value.prompt_text,
    "result_format": "markdown",
    "result_language": "english"
  })
}

async function updatePrompt(prompt) {
  const {data, error} = await API.updatePromptRequest(prompt)
  if (data.value) {
    setPromptListProcessing(true)
    resetUpdatePromptData();
    await listPromptRequest();
  } else if (error.value) {
    updatePromptLoadingFlag.value = false
  }
}

//reset form data of add prompt
watch(showAddPromptModalFlag, () => {
  Object.assign(newPrompt.value, defaultPrompt)
})

watch(showUserLogHistoryModalFlag, () => {
  if (showUserLogHistoryModalFlag.value) {
    setTimeout(() => {
      const modal = document.getElementById(userLogHistoryModalId);
      modal.showModal();
    }, 100)
  }
})
listPromptRequest()


</script>

<template>
  <div>

    <!--  modal of add prompt  -->
    <AddPromptModal
        :modalId="addPromptModalId"
        :showAddPromptModalFlag="showAddPromptModalFlag"
        :newPrompt="newPrompt"
        :addPromptLoadingFlag="addPromptLoadingFlag"
        @resetAddPromptData="resetAddPromptData"
        @onSubmitAddPrompt="onSubmitAddPrompt"
    />

    <!--  modal of update prompt  -->
    <UpdatePromptModal
        :modalId="updatePromptModalId"
        :currentPrompt="currentPrompt"
        :showUpdatePromptModalFlag="showUpdatePromptModalFlag"
        :updatePromptLoadingFlag="updatePromptLoadingFlag"
        @onSubmitUpdatePrompt="onSubmitUpdatePrompt"
        @close="resetUpdatePromptData"
    />

    <!--  modal of show prompts roles  -->
    <Modal
        :title="`${currentPrompt?currentPrompt.title??'':''}`"
        id="prompt_text_dialog"
        :custom-style="'max-w-5xl h-[vh-80]'"
        v-if="currentPrompt.information"
    >
      <div class="flex gap-2">
        <BaseCard
            class="w-full overflow-auto max-h-[70vh] text-sm leading-7"
        >
          <p v-html="currentPrompt.information.prompt_text
              .replace(/\n/g, '<br>')
              .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')">
          </p>
        </BaseCard>
      </div>
    </Modal>

    <BaseCard>
      <div class="flex justify-between border-b-2 pb-2">
        <div>
        </div>
        <div class="flex gap-2">
          <BaseButton class="btn-primary text-white" size="xs" :onclick="showAddPromptModal">
            <div class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
              <span class="p-1">
                {{ $t("button.add-prompt") }}
              </span>
            </div>
          </BaseButton>
        </div>
      </div>
      <div class="min-card-height-table">
        <BaseTable
            :data="currentPromptList"
            :is-loading="promptListProcessing"
            :headers="tableHeaders"
        >
          <template v-slot:cell(action)="{data,index}">
            <div class="flex gap-2">
              <BaseButton
                  size="xs"
                  @click="showUpdatePromptModal(data.item)"
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
                  class="bg-gray-600 hover:bg-gray-800 text-white tooltip"
                  @click="showPromptTextDialog(data.item)"
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
      </template>
    </BaseCard>
  </div>
</template>

<style scoped>

</style>