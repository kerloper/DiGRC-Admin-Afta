<script setup>
import {ref, defineProps, shallowRef} from 'vue';
import Codemirror from "codemirror-editor-vue3";
import "codemirror/addon/display/placeholder.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/dracula.css";
import {Form} from "vee-validate";
import BaseButton from "@/components/BaseButton.vue";

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



const submit = () => {
  ruleDetail.value.prog.src = code.value
  const modal = document.getElementById(props.modalId)
  modal.close()
}

const cmOptions = {
  mode: "javascript",
  theme: "dracula",
  readOnly: false,
  lineNumbers: true,
  lineWiseCopyCut: true,
  gutters: ["CodeMirror-lint-markers"],
  lint: true,
}

async function init() {
  ruleDetail.value = props.node
  if (ruleDetail.value.prog) {
    code.value = ruleDetail.value.prog.src === "" ? codeHelp : ruleDetail.value.prog.src
  } else {
    code.value = codeHelp
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
        <div>
          <div class="w-full h-44">
            <Codemirror
                v-model:value="code"
                v-model="code"
                placeholder="Code goes here..."
                :options="cmOptions"
                :autofocus="true"
                :indent-with-tab="true"
                :tab-size="2"
                @ready="handleReady"
            />
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
