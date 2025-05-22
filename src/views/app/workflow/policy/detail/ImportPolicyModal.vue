<script setup>
import Modal from "@/components/Modal.vue";
import BaseButton from "@/components/BaseButton.vue";
import {useI18n} from "vue-i18n";
import {Form} from "vee-validate";
import Codemirror from "codemirror-editor-vue3";
import { ref, shallowRef} from "vue";

const props = defineProps({
  showImportPolicyModalFlag: Boolean,
  importPolicyLoadingFlag: Boolean,
  modalId: {
    type: String,
    default: "import_policy_modal",
  }
})
const {t: $t} = useI18n()
const emit = defineEmits(['resetImportPolicyData', 'onSubmitImportPolicy']);
const jsonData = ref(null)
const view = shallowRef();
const cmOptions = {
  mode: "application/json",
  theme: "dracula",
  readOnly: false,
  lineNumbers: true,
  lineWrapping: true,
  lineWiseCopyCut: true,
  gutters: ["CodeMirror-lint-markers"],
  lint: true,
}
const resetImportPolicyData = () => {
  emit('resetImportPolicyData');
  jsonData.value = null
}
const onSubmitImportPolicy = () => {
  emit('onSubmitImportPolicy', jsonData.value);
  jsonData.value = null
}
const handleReady = payload => {
  view.value = payload.view;
};

async function pastFromClipboard() {
}

</script>

<template>
  <Modal
      @close="resetImportPolicyData"
      :title="$t('modal.import-policy')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div class="max-h-[40vh] overflow-auto z-50">
      <Form @submit="onSubmitImportPolicy"
            v-if="showImportPolicyModalFlag">
        <div class="grid md:grid-cols-1 lg:grid-cols-1 grid-cols-1 gap-2">
          <div class="w-full h-44">
            <Codemirror
                v-model:value="jsonData"
                placeholder="Json goes here..."
                :autofocus="true"
                :indent-with-tab="true"
                :tab-size="2"
                :options="cmOptions"
                @ready="handleReady"
            />
          </div>
        </div>
        <div class="py-[6px]" v-if="importPolicyLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex mt-3" v-else>
          <div class="w-full">
<!--            <BaseButton class="btn btn-outline" size="xs" type="button" @click="pastFromClipboard">-->
<!--              {{ $t('button.past-from-clipboard') }}-->
<!--            </BaseButton>-->
          </div>
          <div class="flex justify-end gap-2">
            <BaseButton class="btn-outline btn-primary" size="xs" :onclick="modalId+'.close()'" type="button">
              {{ $t('button.cancel') }}
            </BaseButton>
            <BaseButton class="btn-primary text-white" size="xs" type="submit">
              {{ $t('button.import') }}
            </BaseButton>
          </div>
        </div>
      </Form>
    </div>
  </Modal>
</template>

<style scoped>

</style>