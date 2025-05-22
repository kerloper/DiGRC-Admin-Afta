<script setup>
import Modal from "@/components/Modal.vue";
import TextInput from "@/components/TextInput.vue";
import {object} from "yup";
import BaseButton from "@/components/BaseButton.vue";
import {useI18n} from "vue-i18n";
import {Form} from "vee-validate";
import validate from "@/composables/validate.js";

const props = defineProps({
  showAddDocumentModalFlag: Boolean,
  newDocument: Object,
  statusList: Array,
  roleList: Array,
  addDocumentLoadingFlag: Boolean,
  modalId:{
    type: String,
    default: "add_document_modal",
  }
})
const {t: $t} = useI18n()
const emit = defineEmits(['resetAddDocumentData', 'onSubmitAddDocument']);
const resetAddDocumentData = () => {
  emit('resetAddDocumentData');
}
const onSubmitAddDocument = () => {
  emit('onSubmitAddDocument');
}
const addDocumentSchemaValidation = object(
    validate(['title']),
)

</script>

<template>
  <Modal
      @close="resetAddDocumentData"
      :title="$t('modal.add-document')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="addDocumentSchemaValidation" @submit="onSubmitAddDocument"
            v-if="showAddDocumentModalFlag">
        <div class="grid md:grid-cols-1 lg:grid-cols-1 grid-cols-1 gap-2">
          <!--     for disable autocomplete     -->
          <input type="text" class="hidden"/>
          <!--     for disable autocomplete     -->
          <input type="password" class="hidden"/>
          <TextInput class="flex-grow"
                     :label="$t('form.title')"
                     name="title"
                     :has-default-error-message="true"
                     v-model="newDocument.title"/>
          <TextInput class="flex-grow"
                     :label="$t('form.field')"
                     name="field"
                     :has-default-error-message="true"
                     v-model="newDocument.field"/>
        </div>
        <div class="py-[6px]" v-if="addDocumentLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton class="btn-outline btn-primary" size="xs" :onclick="modalId+'.close()'" type="button">
            {{ $t('button.cancel') }}
          </BaseButton>
          <BaseButton class="btn-primary text-white" size="xs" type="submit">
            {{ $t('button.save') }}
          </BaseButton>
        </div>
      </Form>
    </div>
  </Modal>
</template>

<style scoped>

</style>