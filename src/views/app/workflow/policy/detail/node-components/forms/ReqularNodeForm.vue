<script setup>
import {ref, defineProps, shallowRef, reactive, watch} from 'vue';
import Codemirror from "codemirror-editor-vue3";
import "codemirror/addon/display/placeholder.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/dracula.css";
import {Form} from "vee-validate";
import BaseButton from "@/components/BaseButton.vue";
import {useI18n} from "vue-i18n";
import BaseCard from "@/components/BaseCard.vue";
import TextInput from "@/components/TextInput.vue";

const {t: $t} = useI18n()
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
const codeHelp = `
/*
'__getData()' function :  load scope data.

'__returnToInflow(data)' function : for saving in specific path
*/
   var data = __getData()
   data.result = {}
  __returnToInflow(data)
`;

const code = ref(codeHelp);
const view = shallowRef();
const handleReady = payload => {
  view.value = payload.view;
};


const cmOptions = {
  mode: "javascript",
  theme: "dracula",
  readOnly: false,
  lineNumbers: true,
  lineWiseCopyCut: true,
  gutters: ["CodeMirror-lint-markers"],
  lint: true,
}

let rule = reactive({
  path: [],
  proc: [],
  formId: null,
  if: {
    // op: "",
    // result: 0,
    conditions: []
  }
});


async function init() {
  ruleDetail.value = props.node
  // if (ruleDetail.value.prog) {
  //   code.value = ruleDetail.value.prog.src === "" ? codeHelp : ruleDetail.value.prog.src
  // } else {
  //   code.value = codeHelp
  // }
  rule.formId = ruleDetail.value.formId
  rule.path = ruleDetail.value.path
  rule.proc = ruleDetail.value.proc
  rule.if = ruleDetail.value.if
  if (ruleDetail.value.prog) {
    rule.prog = ruleDetail.value.prog
  }

  rule.next_proc = ruleDetail.next_proc
  rule.description = ruleDetail.description
  // if (regularPolicyForm.value.length) {
  await updateRegularFormData()
  initRule(ruleDetail.value);
}

init()


const resultForm = ref(true)
const dialog = ref(false)
let isLoading = ref(false)
const regularPolicyForm = ref([{formId: "", title: "root"}]);
let title = ref();
// const identifier = ref();
const desc = ref();
let selectedForm = ref();
// let ruleIndex = ref();
const opCondition = ref("=");
const resultCondition = ref(0);
let selectedRadio = ref("Calculate");
const disableProc = ref(false);
const showCoding = ref(false);
let procFieldType = ref("");
let path = ref('')
let isCondition = ref(false);

defineExpose({dialog, ruleDetail})

function conditionStatus(cond, index) {
  if (cond.value_type == 'namespace') {
    cond.value_type = 'string'
  } else {
    cond.value_type = 'namespace'
  }
}

function resultFormChangeStatus() {
  resultForm.value = !resultForm.value
}

function checkType(field) {
  let tt = "text";
  const items = selectedForm.value;
  for (elem in items.data) {
    if (elem == field) {
      if (typeof elem === 'number') {
        return 'number'
      }
    }
  }

  return tt;
}

// check if rule detail value and return dialog title
// const dialogTitle = computed(() => {
//   return ruleDetail.value.selectedRule ? t('rule_detail') : t('add_new_rule');
// });
const dialogTitle = "titl;e"

function setInputType(field) {
  if (field) {
    procFieldType.value = ` ${t('field_type_is')} ${checkType(field)} `;

  }
}

// Operation ....
let procForm = reactive([
  {
    operation: null,
    field: null,
    append: false,
    path: null,
    pathRules: []
  }
]);

function addProc() {
  procForm.push({
    operation: null,
    field: null,
    append: false,
    path: null,
    pathRules: []
  });
}

function removeProc() {
  procForm.splice(procForm.length - 1, 1);
}

// Conditions ....
let conditionForm = reactive([
  {
    path: "",
    pathRules: [],
    op: "",
    value: "",
    value_type: "string",
    values: [],
    prependIcons: ["mdi-numeric", "mdi-code-string", "mdi-alpha"],
    prependIcon: "mdi-code-string",
  }
]);

function addCondition() {
  conditionForm.push({
    path: "",
    pathRules: [],
    op: "",
    value: "",
    values: [],
    prependIcons: ["mdi-numeric", "mdi-code-string", "mdi-alpha"],
    prependIcon: "mdi-code-string",
    value_type: "string"
  });
  resultCondition.value = conditionForm.length

}


const emit = defineEmits(["close", "update"]);
let updateSelectedFormToggle = ref(false);

function dialogUpdateForm() {
  toggleUpdateForm();
}

async function updateRegularFormData() {
  //get Form regular data

  await getPolicyRegularForm();
  if (rule.formId) {
    const finded = regularPolicyForm.value.filter(
        form => {
          if (form.formId === rule.formId) {
            return true
          }
        }
    );
    selectedForm.value = finded
  }

}

function closeUpdateSelectedDialog() {
  toggleUpdateForm();
}

function toggleUpdateForm() {
  updateSelectedFormToggle.value = !updateSelectedFormToggle.value;
}

// Get Regular Policy Data for form
async function getPolicyRegularForm() {
  try {
    const {data: res} = await API.policyRegularForm(50, 1);
    // console.log(res.data);
    regularPolicyForm.value = [{formId: "", title: "root"}, ...res.data];
  } catch (e) {
  } finally {
  }
}


// emit close dialog to parent
function close() {
  emit("close");
}


function initRule(rule) {
  if (rule) {
    // rule = value;
    path.value = rule.path.join('.')
    title.value = rule?.title;
    desc.value = rule?.description;
    if (rule?.formId != "") {
      [selectedForm.value] = regularPolicyForm.value.filter(
          form => form.formId === rule?.formId
      );


    } else {
      selectedForm.value = {formId: "", title: ""}
    }
    if (rule?.proc && rule.proc.length) {
      procForm = reactive([]);
      for (let proc of [...rule.proc]) {
        procForm.push({
          operation: proc.op,
          field: proc.field,
          append: proc.append,
          path: null,
          pathRules: proc.capture,
          text_path: proc.capture.join('.')
        });
      }
    } else {
      procForm = reactive([]);
      addProc()
    }
    // console.log(rule)
    if (rule.prog) {
      selectedRadio.value = "Coding"
    } else if ((rule?.proc.length === 0) && rule?.ext_resource != null) {
      selectedRadio.value = "External"

    } else {
      selectedRadio.value = "Calculate"
    }
    if (rule?.if.conditions.length > 0) {
      isCondition.value = true;
      conditionForm = reactive([]);
      for (let condition of [...rule?.if.conditions]) {
        conditionForm.push({
          path: null,
          pathRules: condition.path,
          text_path: condition.path.join('.'),
          op: condition.op,
          value: null,
          values: condition.value,
          // text_value:condition.value.join(','),

          prependIcons: ["mdi-numeric", "mdi-code-string", "mdi-alpha"],
          prependIcon: function () {
            if ((typeof condition.value[0] === "number" || condition.value_type === "number")) {
              return "mdi-numeric"
            } else if (condition.value[0] && (condition.value_type === "variable")) {
              return "mdi-alpha"
            } else if (condition.value[0] && (condition.value_type === "string")) {
              return "mdi-code-string"
            } else {
              return "mdi-code-string"
            }
          }(),

          value_type: function () {
            if ((typeof condition.value[0] === "number" || condition.value_type === "number")) {
              return "number"
            } else if (condition.value[0] && (condition.value_type === "variable")) {
              return "variable"
            } else if (condition.value[0] && (condition.value_type === "string")) {
              return "string"
            } else {
              return "namespace"
            }
          }(),
          text_value: condition.value[0] && (condition.value_type === "variable") ? condition.value.join('.') : condition.value.join(',')
        });
      }
    } else {
      conditionForm = reactive([]);
      isCondition.value = true
      addCondition()
    }
    // opCondition.value = rule?.if?.op;
    // resultCondition.value = rule?.if?.result;
  } else {
    rule = reactive({
      path: [],
      proc: [],
      formId: null,
      if: { /*op: "", result: 0, */conditions: []}
    });
    procForm = reactive([
      {
        operation: null,
        field: null,
        append: false,
        path: null,
        pathRules: [],
        text_path: ''
      }
    ]);
    conditionForm = reactive([
      {
        path: "",
        pathRules: [],
        text_path: '',
        op: "",
        value: "",
        values: [],
        text_value: '',
        prependIcons: ["mdi-numeric", "mdi-code-string", "mdi-alpha"],
        prependIcon: "mdi-code-string",
        value_type: "string"
      }
    ]);
    isCondition.value = false;
    title.value = "";
    desc.value = "";
    selectedForm.value = null;
    opCondition.value = "";
    resultCondition.value = 0;
  }
  // console.log("proc form" ,procForm)
  // console.log("condition form" ,conditionForm)
  if (rule.path.length > 0) {
    // console.log(rule)
    // console.log(rule.path.join("."))
  }
}


//rule path

function addPath() {

  let rulePath = [];
  // console.log(path.value)/
  if (path.value) {
    const reg = /\[\d+\]/g;
    path.value = path.value.replace(reg, "");
    let splited = path.value.split(".");
    rulePath.push(...splited);
  }
  return rulePath
}

function conditionMeetNumber(n) {
  return n >= 0 && n <= conditionForm.length;
}


function removeCondition() {
  conditionForm.splice(conditionForm.length - 1, 1);
  resultCondition.value = conditionForm.length
}


function changeIcon(value, index) {
  switch (conditionForm[index].prependIcon) {
    case "mdi-code-string":
      conditionForm[index].value = "";
      conditionForm[index].values = [];
      conditionForm[index].value_type = "number";
      conditionForm[index].prependIcon = "mdi-numeric";
      break;
    case "mdi-numeric":
      conditionForm[index].value = "";
      conditionForm[index].values = [];
      conditionForm[index].prependIcon = "mdi-code-string";
      conditionForm[index].value_type = "string";
      break
      // case "mdi-alpha":
      //   conditionForm[index].value = "";
      //   conditionForm[index].values = [];
      //   conditionForm[index].prependIcon = "mdi-code-string";
      //   conditionForm[index].value_type = "string";

  }
}


watch(
    () => selectedRadio.value,
    value => {
      switch (value) {
        case "Calculate":
          disableProc.value = false;
          showCoding.value = false;
          procForm = procForm.length
              ? procForm
              : reactive([
                {
                  operation: null,
                  field: null,
                  append: false,
                  path: null,
                  pathRules: []
                }
              ]);
          break;
        case "External":
          // procForm = [];
          // ruleDetail.value.ext_resource = null
          disableProc.value = true;
          resultForm.value = false
          showCoding.value = false;
          break;
        case "Coding":
          // procForm = [];
          disableProc.value = true;
          resultForm.value = false
          showCoding.value = true;
          // selectedForm.value = null
          code.value = rule.hasOwnProperty("prog") ? rule.prog.src : codeHelp;
          break;
      }
    }
);

// get data from form input and Submit that
async function submit() {
  try {
    isLoading.value = true
    if (procForm.length) {
      rule.proc = [];
      for (const datum of procForm) {
        rule.proc.push({
          capture: datum.text_path === undefined ? [] : datum.text_path.split('.').filter(v => v !== ''),
          append: datum.append,
          field: datum.field,
          op: datum.operation
        });
      }
    }
    if (isCondition.value && conditionForm.length) {
      rule.if.conditions = [];
      for (const datum of conditionForm) {
        // console.log(conditionForm)
        if (datum.text_path === "" && datum.text_value === "" && datum.op === "") {
          continue
        }
        if (datum.value_type === 'namespace') {
          datum.value = ""
          datum.op = ""
          datum.text_value = ""
        }
        const cond = {
          path: datum.text_path.split('.'),
          value_type: datum.value_type,
          value: datum.value_type === 'variable' ? datum.text_value.split('.') : datum.text_value.split(','),
          op: datum.op
        }
        if (cond.value_type === 'number') {
          cond.value = cond.value.map(v => parseFloat(v))
        }
        rule.if.conditions.push(cond);
      }

    }
    let item = {
      title: title.value,
      path: addPath(),
      formId: (function getSelectedForm() {
        return selectedForm?.value?.formId || "";
      })(),
      proc: rule.proc,
      if: isCondition.value === true ? rule.if : {
        "op": "=",
        "result": 0,
        "conditions": []
      },
      description: desc.value
    };
    if (code.value && showCoding.value) {
      item.prog = {}; // Create the 'prog' property if it doesn't exist
      item.prog.src = code.value; // Set the 'src' property of 'prog'
      item.proc = [];
    }
    if (selectedRadio.value === "External") {
      item.proc = [];
    }

    ruleDetail.value.path = item.path
    ruleDetail.value.proc = item.proc
    ruleDetail.value.formId = item.formId
    ruleDetail.value.if = item.if
    ruleDetail.value.prog = item.prog
    const modal = document.getElementById(props.modalId)
    modal.close()
  } catch (e) {
    console.log(e)
  } finally {
    isLoading.value = false
  }
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
          <!-- Conditions Section -->
          <div class="grid grid-cols-2 gap-2">
            <BaseCard class=" ">
              <span class="pb-2 font-bold">{{ $t('title.conditions-definition') }}</span>
              <div class="">
                <div v-for="(condition, index) in conditionForm" :key="index" class=" ">
                  <div class="">
                    <div class="flex justify-between">
                      <div class="flex space-x-2">

                        <div v-if="condition.value_type !== 'namespace'" class="flex gap-4">
                          <BaseButton type="button" class="btn btn-outline" size="xs"
                                      :class="condition.value_type !== 'variable' ? 'btn-outline' : ''"
                                      @click="condition.value_type = 'string'; condition.prependIcon = 'mdi-code-string'">
                            abc
                          </BaseButton>
                          <BaseButton type="button" class="btn btn-outline" size="xs"
                                      :class="condition.value_type === 'variable' ? 'btn-outline' : ''"
                                      @click="condition.value_type = 'variable'; condition.prependIcon = 'mdi-alpha'">
                            a
                          </BaseButton>
                        </div>
                      </div>
                      <BaseButton type="button" class="btn-outline btn " size="xs"
                                  :class="condition.value_type === 'namespace' ? 'btn-primary' : ''"
                                  @click="conditionStatus(condition, index)">
                        scope
                      </BaseButton>
                    </div>

                    <!-- Namespace Condition -->
                    <div v-if="condition.value_type === 'namespace'" class="mt-2">
                      <TextInput
                          :has-default-error-message="true"
                          v-model="condition.text_path"
                          type="text"
                          :label="$t('title.scope')"
                          name="scope"
                      />
                    </div>

                    <!-- Other Condition Types -->
                    <div v-if="condition.value_type !== 'namespace'" class="mt-2">
                      <TextInput
                          :has-default-error-message="true"
                          v-model.trim="condition.text_path"
                          type="text"
                          :label="$t('title.capture-path')"
                          :disabled="!isCondition"
                          name="text_path"
                      />
                      <TextInput
                          :has-default-error-message="true"
                          v-model="condition.text_value" type="text"
                          :label="condition.value_type === 'variable' ? $t('title.goto-path_and-capture') : $t('title.condition-value')"
                          :disabled="!isCondition"
                          name="condition_value"
                      >
                        <BaseButton
                            v-if="condition.value_type !== 'variable'"
                            type="button"
                            size="xs"
                            class="btn btn-outline ms-[-6px]"
                            @click="changeIcon(condition.value, index)"
                        >
                          {{ condition.value_type }}
                        </BaseButton>
                      </TextInput>

                      <!-- Expression Field -->
                      <div v-if="condition.value_type !== 'string'" class="mt-2">
                        <TextInput
                            :has-default-error-message="true"
                            v-model.trim="condition.op"
                            type="text"
                            :label=" $t('title.condition-expression')  "
                            :disabled="!isCondition"
                            name="condition_expression"/>
                      </div>

                    </div>


                  </div>
                </div>
              </div>
            </BaseCard>

            <!-- Operation Section -->
            <BaseCard class=" ">
              <span class="pb-2 font-bold">{{ $t('title.operation') }}</span>
              <div class=" ">
                <div v-for="(proc, index) in procForm" :key="index" >
                  <div class=" ">
                    <Codemirror
                        v-model:value="proc.operation"
                        placeholder="Code goes here..."
                        class="rounded-md shadow-md"
                        :style="{ height: '400px', width: '100%' }"
                        :autofocus="true"
                        :indent-with-tab="true"
                        :tab-size="2"
                        :options="cmOptions"
                        @ready="handleReady">

                    </Codemirror>
                  </div>

                </div>
              </div>
            </BaseCard>
          </div>
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
