<script setup>
import {nextTick, onBeforeUnmount, onMounted, onUpdated, watch} from 'vue';
import JsonEditorVue from "json-editor-vue";
import {useRoute} from 'vue-router';
import {useI18n} from "vue-i18n";
import {ref} from "vue";
import BaseCard from "@/components/BaseCard.vue";
import API from "@/services/API.js";
import BaseButton from "@/components/BaseButton.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import TimeConfigurationModal from "@/components/Inflow/TimeConfigurationModal.vue";
import VSelect from "@/components/VSelect.vue";
import router from "@/router/index.js";
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'
import {useStorage} from "@vueuse/core";
import {defaultTheme, themeSelectedColorStorageKey} from "@/constants/config.js";
import WebSocketLog from "@/components/WebSocketLog.vue";

const {t: $t} = useI18n()
const route = useRoute()
const documentId = ref(route.params.documentId || null)
const requestOptions = ref({
  documentId: documentId.value
})
const theme = useStorage(themeSelectedColorStorageKey, defaultTheme)
const consoleOptions = ref({
  logs: "",
  webSocketUrl: null
})
const jsonData = ref(null)
const currentDocument = ref({})
const originalDocument = ref({})
const documentDetailProcessing = ref(true)
const showWebSocketLog = ref(false)
const updateDocumentConfirmationModalId = "confirmation_update_document"
const policyList = ref([])
const policy = ref()
const timeConfigurationModalId = 'time_configuration_modal'
const showTimeConfigurationModalFlag = ref(false)
const timeConfigurationLoadingFlag = ref(false)
const processConfig = ref({
  http_req_ms_timeout: 6000,
  proc_second_timeout: 3600
})
const startProcessLoadingFlag = ref(false)
const processingStatus = ref('')
const baseCardWidth = ref(0);
const baseCardRef = ref(null)
const logContainer = ref(null);


function setDocumentDetailProcessing(payload) {
  documentDetailProcessing.value = payload
}

function onJsonChange(value) {
  jsonData.value = value
}

function setDocumentDetail(data) {
  Object.assign(currentDocument.value, data)
  Object.assign(originalDocument.value, data)
  jsonData.value = JSON.parse(data.data) ?? {}
  if (data.headers?.inflow?.policyId !== "") {
    policyList.value = policyList.value??[]
    policy.value = policyList.value.find((item) => item.identifier === data.headers?.inflow?.policyId)
  }
  if (data.headers?.inflow?.processId) {
    processingStatus.value = 'processing'
  } else {
    processingStatus.value = ''
  }
}

async function documentDetailRequest() {
  setDocumentDetailProcessing(true)
  const {data, error} = await API.detailDocumentRequest(requestOptions.value.documentId)
  if (data.value) {
    setDocumentDetail(JSON.parse(data.value).data)
  } else if (error.value) {
  }
  setDocumentDetailProcessing(false)
}


function confirmUpdateDocument() {
  const modal = document.getElementById(updateDocumentConfirmationModalId);
  modal.showModal();
}

function cancelUpdateDocument() {
}

function updateDocument() {
  updateDocumentRequest();
}

async function updateDocumentRequest() {
  if (document == null) {
    cancelUpdateDocument();
  }
  setDocumentDetailProcessing(true)
  const {data, error} = await API.updateDocumentDataRequest({id: documentId.value, data: jsonData.value})
  if (data.value) {
    await documentDetailRequest();
  } else if (error.value) {
    ///TODO:set alert for error in update document
  }
}

function setWebSocketUrl(url) {
  consoleOptions.value.webSocketUrl = url.replace("https://", "wss://")
  consoleOptions.value.webSocketUrl = url.replace("http://", "ws://")
}

async function getWebSocketUrl() {
  const {data, error} = await API.requestWebSocketUrl()
  if (data.value) {
    try {
      setWebSocketUrl(JSON.parse(data.value).data)
    } catch (error) {
      consoleOptions.value.webSocketUrl = null
    }
  } else if (error.value) {
    consoleOptions.value.webSocketUrl = null
  }
}

async function listInflowPolicyRequest() {
  const {data, error} = await API.listInflowPolicyRequest({page: 1, limit: 1000})
  if (data.value) {
    let resp = JSON.parse(data.value).data
    policyList.value = resp.list
    try {
      if (currentDocument.value.headers?.inflow?.policyId !== "") {
        policy.value = policyList.value.find((item) => item.identifier === currentDocument.value.headers?.inflow?.policyId)
      }
    } catch (error) {

    }
  } else if (error.value) {
  }
}

function timeConfiguration() {
  if (policy.value) {
    if (policy.value.process_config) {
      policy.value.process_config.http_req_ms_timeout =
          policy.value.process_config.http_req_ms_timeout > 0 ?
              policy.value.process_config.http_req_ms_timeout :
              6000
      policy.value.process_config.proc_second_timeout =
          policy.value.process_config.proc_second_timeout > 0 ?
              policy.value.process_config.proc_second_timeout :
              3600
      Object.assign(processConfig.value, policy.value.process_config)
    }
  }
  showtimeConfigurationModal()
}

///start time configuration methods
function showtimeConfigurationModal() {
  showTimeConfigurationModalFlag.value = true
  setTimeout(function () {
    const modal = document.getElementById(timeConfigurationModalId);
    modal.showModal();
  }, 200)
}

function resetTimeConfigurationData() {
  showTimeConfigurationModalFlag.value = false
  timeConfigurationLoadingFlag.value = false
  const modal = document.getElementById(timeConfigurationModalId)
  modal.close()
}

function onSubmitTimeConfiguration() {
  if (!policy.value) {
    return
  } else {
    timeConfigurationLoadingFlag.value = true
  }
  Object.assign(
      policy.value.process_config,
      Object.fromEntries(
          Object.entries(processConfig.value).map(
              ([key, value]) => [key, Number(value)]
          )
      )
  )
  resetTimeConfigurationData()
}

function showInflow(data) {
  router.push({
    path: `/app/workflow/policy/policy-detail/${data.id}`
  });
}


function startProcess() {
  startProcessLoadingFlag.value = true
  const request = {
    docId: documentId.value,
    policyIdentifier: policy.value.identifier,
    config: processConfig.value
  }
  executePolicy(request)
}

async function executePolicy(request) {
  processingStatus.value = 'processing'
  const {data, error} = await API.executePolicy(request)

  if (data.value) {
    await documentDetailRequest()
  } else if (error.value) {
    processingStatus.value = 'failed'
  }
  startProcessLoadingFlag.value = false
}

function toggleWebSocketLog() {
  showWebSocketLog.value = !showWebSocketLog.value;
}


function stopProcess() {
  startProcessLoadingFlag.value = true
  const request = {
    processId: currentDocument.value?.headers?.inflow?.processId ?? "",
  }
  stopPolicy(request)
}

async function stopPolicy(request) {
  processingStatus.value = 'processing'
  const {data, error} = await API.stopPolicy(request.processId)

  if (data.value) {
    await documentDetailRequest()
  } else if (error.value) {
  }
  startProcessLoadingFlag.value = false
}

function updateConsoleLogHistory(log) {
  consoleOptions.value.logs = log
}

getWebSocketUrl();
listInflowPolicyRequest();
documentDetailRequest();


const updateBaseCardWidth = () => {
  if (baseCardRef.value) {
    baseCardWidth.value = baseCardRef.value.$el.offsetWidth;
  }
};

onMounted(() => {
  nextTick(updateBaseCardWidth);
  window.addEventListener('resize', updateBaseCardWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateBaseCardWidth);
});

onUpdated(() => {
  // Scroll to the bottom of the log container after the component updates
  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight;
    }
  });
})

</script>


<template>
  <div>
    <!--  modal of update confirmation  -->
    <ConfirmationModal
        :accept="updateDocument"
        :deny="cancelUpdateDocument"
        :id="updateDocumentConfirmationModalId"
    >
      {{ $t('message.update-document-confirmation') }} {{ currentDocument ? currentDocument.title : '' }}?
    </ConfirmationModal>

    <div v-if="showTimeConfigurationModalFlag">
      <TimeConfigurationModal
          :modalId="timeConfigurationModalId"
          :showTimeConfigurationModalFlag="showTimeConfigurationModalFlag"
          :processConfig="processConfig"
          :updatePolicyLoadingFlag="timeConfigurationLoadingFlag"
          @resetTimeConfigurationData="resetTimeConfigurationData"
          @onSubmitTimeConfiguration="onSubmitTimeConfiguration"
      />
    </div>

    <BaseCard ref="baseCardRef">
      <div class="flex justify-between border-b-2 pb-2">
        <div>
          <div class="skeleton my-2 h-2 w-28 rounded-full" v-if="documentDetailProcessing"></div>
          <div v-else>
             <span v-if="documentId">
               {{
                 currentDocument.headers ? currentDocument.headers.info ? currentDocument.headers.info.title : "" : ""
               }}
              </span>
          </div>
        </div>

        <div class="flex gap-2">
          <div class="skeleton my-2 h-2 w-28 rounded-full" v-if="documentDetailProcessing"></div>
          <BaseButton class="btn-primary text-white" size="xs" :onclick="confirmUpdateDocument" v-else>
            <div class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"/>
              </svg>
              <span class="p-1">
                {{ $t("button.update-document") }}
              </span>
            </div>
          </BaseButton>
        </div>
      </div>
      <div class="min-card-height-table">
        <progress class="progress progress-secondary w-full" v-show="documentDetailProcessing"
                  v-if="documentDetailProcessing"></progress>
        <div v-else>
          <div
              class="rounded-sm pb-3  my-1 shadow-y shadow-b-md grid grid-cols-1 md:grid-cols-5 sm:grid-cols-5 xl:grid-cols-5 lg:grid-cols-5">
            <div class="lg:max-w-96 md:max-w-96 col-span-2 flex">
              <VSelect v-if="policyList"
                       v-model="policy"
                       name="policy"
                       :has-label="false"
                       :placeholder="$t('form.select-policy-placeholder')"
                       deselect-label=""
                       disabled="true"
                       class="w-full"
                       :is-multiple="false"
                       :is-disabled="(processingStatus==='processing')"
                       label="title"
                       :options="policyList"
                       :searchable="true"
                       :allow-empty="true"
              />
              <div class="w-6 pt-1 mx-2">
                <BaseButton
                    v-if="policy"
                    size="xs"
                    @click="showInflow(policy)"
                    class=" btn btn-outline tooltip"
                    :data-tip="$t('tooltip.view')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                       stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                  </svg>
                </BaseButton>
              </div>
            </div>
            <div class="px-4 pt-1 text-center">
              {{ processingStatus }}
            </div>
            <div
                class="text-end float-end col-span-2"
            >
              <div class="flex gap-2 w-48 items-end float-end justify-end">
                <BaseButton
                    class="btn btn-circle btn-outline"
                    :class="{'btn-disabled': (!policy||processingStatus==='processing')}"
                    size="xs"
                    @click="startProcess"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                       stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/>
                  </svg>
                </BaseButton>

                <BaseButton
                    class="btn btn-circle btn-outline"
                    :class="{'btn-disabled': (  processingStatus!=='processing')}"
                    size="xs"
                    @click="stopProcess"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                       stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z"/>
                  </svg>
                </BaseButton>
                <BaseButton
                    class="btn btn-circle btn-outline"
                    :class="{'btn-disabled': (!policy||processingStatus==='processing')}"
                    size="xs"
                    @click="timeConfiguration"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                       stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                  </svg>
                </BaseButton>
                <BaseButton
                    class="btn btn-circle btn-outline"
                    size="xs"
                    @click="toggleWebSocketLog"
                >
                  >ـ
                </BaseButton>
              </div>

            </div>
          </div>
          <div
              class="w-full overflow-auto">
            <JsonEditorVue
                v-model="jsonData"
                :expandedOnStart="true"
                @json-change="onJsonChange"
                :class="{'jse-theme-dark':theme === 'dim'}"
                class="pb-16"
            />
          </div>
        </div>
      </div>
    </BaseCard>
    <div
        v-if="showWebSocketLog&&consoleOptions.webSocketUrl"
        class="fixed w-full me-3 overflow-y-auto flex flex-col-reverse z-50 bottom-0 h-48"
        ref="logContainer"
        :style="{ width: `${baseCardWidth}px` }"
    >
      <WebSocketLog :consoleOptions="consoleOptions" @update-console-log-history="updateConsoleLogHistory"/>
    </div>
  </div>
</template>

<style scoped>
:deep(.jse-menu.svelte-pf7s2l.svelte-pf7s2l) {
  @apply bg-primary
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.websocket-log-panel {
  max-height: 400px;
  overflow-y: auto;
}
</style>

