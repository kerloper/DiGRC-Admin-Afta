<script setup>
import {defineProps, defineEmits} from 'vue';
import Modal from "@/components/Modal.vue";
import {Form} from "vee-validate";
import TextInput from "@/components/TextInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import {object} from "yup";
import {useI18n} from "vue-i18n";
import validate from "@/composables/validate.js";

const props = defineProps({
  currentDocument: Object,
  showUpdateDocumentModalFlag: Boolean,
  updateDocumentLoadingFlag: Boolean,
  modalId: {
    type: String,
    default: "update_document_modal",
  }
});
const {t: $t} = useI18n()
const emit = defineEmits(['close', 'onSubmitUpdateDocument']);
const updateDocumentSchemaValidation = object(
    validate(['title']),
);  

const resetUpdateDocumentData = () => {
  emit('close');
};
const onSubmitUpdateDocument = () => { 
  emit('onSubmitUpdateDocument',{
    docId:props.currentDocument.docId,
    id:props.currentDocument.id,
    title:props.currentDocument.title,
    field:props.currentDocument.field
  });
};

</script>

<template>
  <Modal
      @close="resetUpdateDocumentData"
      :title="$t('modal.update-document')"
      :id="modalId"
      :custom-style="'max-w-3xl text-start'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="updateDocumentSchemaValidation" @submit="onSubmitUpdateDocument" class=""
            v-if="showUpdateDocumentModalFlag">
        <div class="grid md:grid-cols-1 lg:grid-cols-1 grid-cols-1 gap-2">
          <!--     for disable autocomplete     -->
          <input type="text" class="hidden"/>
          <!--     for disable autocomplete     -->
          <input type="password" class="hidden"/>
          <TextInput class="flex-grow" 
                     :label="$t('form.id')"
                     name="id"
                     :has-default-error-message="true"
                     v-model="currentDocument.id"/>
          <TextInput class="flex-grow" 
                     :label="$t('form.title')"
                     name="title"
                     :has-default-error-message="true"
                     v-model="currentDocument.title"/>
          <TextInput class="flex-grow"
                     :label="$t('form.field')"
                     name="field"
                     :has-default-error-message="true"
                     v-model="currentDocument.field"/>
        </div>
        <div class="py-[6px]" v-if="updateDocumentLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton class="btn-outline btn-primary" size="xs" :onclick="modalId+'.close()'" type="button">
            {{ $t('button.cancel') }}
          </BaseButton>
          <BaseButton class="btn-primary text-white" size="xs" type="submit">
            {{ $t('button.update') }}
          </BaseButton>
        </div>
      </Form>
    </div>
  </Modal>
</template>

<style scoped>

</style>