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
let isLoading = ref(false)
let title = ref();
const desc = ref();
let selectedForm = ref();
const opCondition = ref("=");
const resultCondition = ref(0);
let isCondition = ref(true);
const ruleDetail = ref(null)
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
  }
}

async function submit() {
  try {
    isLoading.value = true
    let ifCollect = []
    if (isCondition.value && conditionForm.length) {
      for (const datum of conditionForm) {
        if (datum.text_path === "" && datum.text_value === "" && datum.op === "") {
          continue
        }
        datum.text_path = datum.text_path === undefined ? "" : datum.text_path
        datum.text_value = datum.text_value === undefined ? "" : datum.text_value
        const cond = {
          path: datum.text_path.split('.'),
          value_type: datum.value_type,
          value: datum.value_type === 'variable' ? datum.text_value.split('.') : datum.text_value.split(','),
          op: datum.op
        }
        if (cond.value_type === 'number') {
          cond.value = cond.value.map(v => parseFloat(v))
        } else if (cond.value_type === 'string') {
          cond.value = cond.value.filter(v => v !== "") || []
        }
        ifCollect.push(cond);
      }
    }
    ifCollect.map((el, i) => {
      if (el.value_type === 'number') {
        ifCollect[i].value = ifCollect[i].value.map(v => Number(v))
      }
    })

    ruleDetail.value.if.conditions = isCondition.value === true ? ifCollect : {
      "op": "=",
      "result": 0,
      "conditions": []
    }
    const modal = document.getElementById(props.modalId)
    modal.close()

  } catch (e) {
    console.log(e)
  } finally {
    const modal = document.getElementById(props.modalId)
    modal.close()

  }
}


function init(rule) {
  ruleDetail.value = rule
  if (rule) {
    opCondition.value = rule?.if?.op;
    resultCondition.value = rule?.if?.result;
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
              return "string"
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
  } else {
    conditionForm = reactive([
      {
        path: null,
        pathRules: [],
        text_path: '',
        op: null,
        value: null,
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
    selectedForm.value = "";
    opCondition.value = "";
    resultCondition.value = 0;
  }
}

init( props.node)
</script>

<template>
  <div>
    <Form>

      <div class="grid md:grid-cols-1 lg:grid-cols-1 grid-cols-1 gap-2">
        <input type="text" class="hidden"/>
        <div>
          <div class="grid gap-2">
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
