<script setup>
import {defineProps, ref, shallowRef, watch} from 'vue';
import API from '@/services/API';
import Codemirror from "codemirror-editor-vue3";
import "codemirror/addon/display/placeholder.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/dracula.css";
import TextInput from "@/components/TextInput.vue";
import {Form} from "vee-validate";
import BaseButton from "@/components/BaseButton.vue";
import VSelect from "@/components/VSelect.vue";

const props = defineProps({
  node: Object,
  modalId: String,
  showUpdateDetailModalFlag: Boolean,
  updateDetailLoadingFlag: {
    type: Boolean,
    default: false
  }
});


let dialog = ref(false);
let isLoading = ref(false);
let title = ref();
let address = ref();
const methodList = ["POST", "GET", "PUT", "PATCH", "DELETE"];
let headers = ref([]);
let desc = ref();
let method = ref("POST");
const formsList = ref([]);
let selectedForm = ref(null);
const jsonKey = ref("");
const pathjson = ref('');
let proto = ref("raw");
const inlineParams = ref(null);
const ruleDetail = ref(null);


const view = shallowRef();
const handleReady = payload => {
  view.value = payload.view;
  // json()
};
const formBody = ref(null)
const jsonData = ref("")
const extrinsicData = ref(null)
const cachedBody = ref("")

getFormsList()

async function getFormsList() {
  isLoading.value = true;
  const {data, error} = await API.policyRegularFormSearch()
  if (data.value) {
    formsList.value = JSON.parse(data.value).data;
  } else if (error.value) {
  }
  isLoading.value = false;
}


async function loadFormConfig() {
  try {
    isLoading.value = true;
    const {data} =  await API.getExtrinsicForm(selectedForm.value?.formId)
    if (data.value) {
      loadOnDialog(JSON.parse(data.value).data);
    }
  } finally {
    isLoading.value = false;
  }
}


function loadOnDialog(data) {
  title.value = data.title;
  address.value = data.url;
  pathjson.value = data.jsonpath;
  proto.value = data.proto_type || "inflow_proto";
  method.value = data.method.toUpperCase() || "POST";
  desc.value = data.description;
  headers.value = [...data.headers];
  inlineParams.value = data.params ? JSON.stringify(data.params) : JSON.stringify({__path_data: "<-Load Path Data On root"});
  jsonKey.value = data.formId;
  if (data.bodyForm) {
    getFormsList(data.bodyForm);
  }
}


function addHeader() {
  headers.value.push({key: null, value: null});
}

function removeHeader() {
  headers.value.length > 1 ? headers.value.pop() : (headers.value = []);
}


async function submit() {
  headers.value = headers.value.filter(v => v.key != null && v.value != null);
  ruleDetail.value.ext_resource = {
    title: title.value,
    formId: jsonKey.value || "__root",
    url: address.value,
    proto_type: proto.value,
    method: method.value,
    bodyForm: selectedForm.value?.formId || "",
    headers: headers.value,
    jsonpath: pathjson.value,
    params: inlineParams.value ? JSON.parse(inlineParams.value) : null,
    description: desc.value,
  };
  const modal = document.getElementById(props.modalId)
  modal.close()
}

watch(() => proto.value, p => {
  if (p === 'raw' && !inlineParams.value) {
    inlineParams.value = JSON.stringify({__path_data: "#Load Path Data On root"});
  }
});

function loadSavedData() {
  if (cachedBody.value) {
    extrinsicData.value.inlineParams = cachedBody.value
  }
}

function addPathData() {
  extrinsicData.value.inlineParams = JSON.stringify(({
    ...JSON.parse(extrinsicData.value.inlineParams),
    "__path_data": "#Load Path Data On root"
  }), 0, 2)
}

async function callViewForm() {
  try {
    isLoading.value = true
    const {data: res} = await API.getFormById(formBody.value.formId)
    jsonData.value = res.data
    extrinsicData.value.inlineParams = JSON.stringify(jsonData.value.data, 0, 2)
  } catch (e) {

  } finally {
    isLoading.value = false
  }
}

formBody.value = selectedForm.value;
extrinsicData.value = {method, inlineParams, pathjson};

const cmOptions = {
  mode: "application/json",
  theme: "dracula",
  readOnly: false,
  lineNumbers: true,
  lineWiseCopyCut: true,
  gutters: ["CodeMirror-lint-markers"],
  lint: true,
  viewportMargin: Infinity,
}

watch(selectedForm,()=>{
  if(selectedForm.value){
    loadFormConfig()
  }
})

async function init() {
  ruleDetail.value = props.node
  if (ruleDetail.value.ext_resource) {
    loadOnDialog(ruleDetail.value.ext_resource);
  }
}

init()

</script>

<template>
  <div>
    <Form>
      <div class="grid md:grid-cols-1 lg:grid-cols-1 grid-cols-1 gap-2">
        <!--     for disable autocomplete     -->
        <input type="text" class="hidden"/>
        <!--     for disable autocomplete     -->
        <input type="password" class="hidden"/>
        <TextInput class="flex-grow"
                   :label="$t('form.key')"
                   name="slug"
                   :has-default-error-message="true"
                   v-model="jsonKey"/>

        <div class="grid grid-cols-4">
          <TextInput class="flex-grow col-span-3"
                     :label="$t('form.url')"
                     :is-disabled="selectedForm!=null"
                     name="password"
                     :has-default-error-message="true"
                     v-model="address">
            <div class="cursor-pointer">
              <select class=" btn-sm bg-transparent border-e-2 border-gray-200" v-model="method" :disabled="selectedForm!=null">
                <option
                    v-for="methodItem in methodList"
                    :key="methodItem"
                    :value="methodItem"
                >
                  {{ methodItem }}
                </option>
              </select>
            </div>
          </TextInput>
          <VSelect
                   v-model="selectedForm"
                   name="selectedForm"
                   class="col-span-1"
                   deselect-label=""
                   :is-multiple="false"
                   label="title"
                   :options="formsList"
                   :searchable="true"
                   :allow-empty="true"
          />
        </div>
        <div class="py-4 px-2 border rounded-md shadow-md">
          <span class=" mb-4">{{ $t('title.header') }}</span>
          <div v-for="(header, index) in headers" :key="index" class="grid grid-cols-2 gap-2 mb-2">
            <TextInput
                class="flex-grow"
                :label="$t('form.key')"
                :name="'key'+index"
                :has-default-error-message="true"
                v-model="header.key"
            >

            </TextInput>
            <TextInput
                class="flex-grow"
                :label="$t('form.value')"
                :name="'value'+index"
                :has-default-error-message="true"
                v-model="header.value"
            >
            </TextInput>
          </div>
          <div class="flex justify-end gap-2 mt-2">
            <BaseButton @click="removeHeader" class="btn-xs text-xs btn-outline" type="button">-</BaseButton>
            <BaseButton @click="addHeader" class="  btn-xs btn-primary btn-outline" type="button">+</BaseButton>
          </div>
        </div>

        <div>
          <div class="flex justify-end mb-2">
            <button title="Inject Path Data" class="mr-2" @click="addPathData" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m2 4H7m14-4a10 10 0 10-10 10"/>
              </svg>
            </button>
          </div>

          <p class="text-sm italic mb-4">
            <span class="font-bold">__path_data</span> as key or value replaced with current path in document
          </p>
          <div class="w-full h-44">
            <Codemirror
                v-model:value="extrinsicData.inlineParams"
                placeholder="Json goes here..."
                :autofocus="true"
                :indent-with-tab="true"
                :tab-size="2"
                :options="cmOptions"
                @ready="handleReady"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-3 gap-2" >
        <BaseButton type="button" class="btn-outline btn-primary" size="xs" :onclick="modalId+'.close()'">
          {{ $t('button.cancel') }}
        </BaseButton>
        <BaseButton type="button" class="btn-primary" size="xs" @click="submit">{{ $t('button.submit') }}</BaseButton>
      </div>
    </Form>
  </div>
</template>

<style scoped>
:deep(.CodeMirror-gutters) {
  @apply ml-0
}

:deep(.CodeMirror pre.CodeMirror-line, .CodeMirror pre.CodeMirror-line-like) {
  @apply ps-6
}

.chip_class {
  cursor: pointer;
}
</style>
