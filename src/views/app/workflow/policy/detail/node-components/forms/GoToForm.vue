<script setup>
import {ref, defineProps, shallowRef, watch} from 'vue';
import Codemirror from "codemirror-editor-vue3";
import "codemirror/addon/display/placeholder.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/dracula.css";
import {Form} from "vee-validate";
import BaseButton from "@/components/BaseButton.vue";
import VSelect from "@/components/VSelect.vue";
import API from "@/services/API.js";
import {InflowNodeType} from "@/constants/vueflow.js";

const props = defineProps({
  node: Object,
  modalId: String,
  showUpdateDetailModalFlag: Boolean,
  updateDetailLoadingFlag: {
    type: Boolean,
    default: false
  }
});


const ruleDetail = ref(null)
const policy=ref(null)
const policyList=ref([])
const ruleList=ref([])
const rule=ref([])
const pageOptions = ref({
  limit: 1000,
  page: 1,
})

const submit = () => {
  const { title, vfId, ...rest } = rule.value;
  rule.value = rest
  if(typeof rule.value === 'object'){
    rule.value = rule.value.data.vfId
  }
  ruleDetail.value.proc_next = { "policyId": policy.value?.identifier, "rule": rule.value }
  const modal = document.getElementById(props.modalId)
  modal.close()
}

async function listInflowPolicyRequest() {
  const {data, error} = await API.listInflowPolicyRequest({...pageOptions.value})
  if (data.value) {
    let resp = JSON.parse(data.value).data
    policyList.value = resp.list
    LoadRulesList()
  } else if (error.value) {
  }
}

function loadRules(){
  ruleList.value = policy.value?.nodes.filter(v=>{if (v.data.title!=="" && v.data.title!=null && v.data.nodeType!==InflowNodeType.StartNode) return v})
  ruleList.value
  ruleList.value = ruleList.value.map(rule => ({
    ...rule,  // Spread existing rule properties
    vfId: rule.data.vfId ,
    title: rule.data.title,
  }));
  rule.value = ruleList.value.find(v=>{if(v.data.vfId===ruleDetail.value.proc_next?.rule) return v})
}

async function init() {
  ruleDetail.value = props.node
  await listInflowPolicyRequest()
}

init()

watch(policy,(value)=>{
  ruleList.value=[]
  rule.value = null
  if(policy.value){
   loadRules()
  }
})

function LoadRulesList(){
  policy.value = policyList.value.find(v=>{if(v.identifier===ruleDetail.value.proc_next?.policyId) return v})
  ruleList.value = policy.value?.nodes.filter(v=>{if (v.data.title!=="" && v.data.title!=null && v.data.nodeType!==InflowNodeType.StartNode) return v})
  }
</script>

<template>
  <div>
    <Form>
      <div class="grid md:grid-cols-1 lg:grid-cols-1 grid-cols-1 gap-2">
        <!--     for disable autocomplete     -->
        <input type="text" class="hidden"/>
        <!--     for disable autocomplete     -->
        <div>
          <VSelect v-if="policyList"
                   v-model="policy"
                   name="policy"
                   :title="$t('form.policy')"
                   :placeholder="$t('form.select-policy-placeholder')"
                   class="col-span-1"
                   deselect-label=""
                   :is-multiple="false"
                   label="title"
                   :options="policyList"
                   :searchable="true"
                   :allow-empty="true"
          />

          <VSelect v-if="ruleList"
                   v-model="rule"
                   name="rule"
                   :title="$t('form.rule')"
                   :placeholder="$t('form.select-rule-placeholder')"
                   class="col-span-1"
                   deselect-label=""
                   :is-multiple="false"
                   label="title"
                   :options="ruleList"
                   :searchable="true"
                   :allow-empty="true"
          />

        </div>
      </div>
      <div class="flex justify-end mt-3 gap-2">
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
