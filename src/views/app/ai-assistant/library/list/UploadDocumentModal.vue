<script setup>
import BaseButton from "@/components/BaseButton.vue";
import TextInput from "@/components/TextInput.vue";
import Modal from "@/components/Modal.vue";
import {Form} from "vee-validate";
import {ref} from "vue";
import {object} from "yup";
import validate from "@/composables/validate.js";
import API from "@/services/API.js";
import BaseFileUpload from "@/components/BaseFileUpload.vue";

const file = ref(null)
const filePreview = ref('')
const props = defineProps({
  showUploadDocumentModalFlag: Boolean,
  modalId: {
    type: String,
    default: "filter_user_modal",
  },
  statusList: Array,
  uploadDocumentLoadingFlag: Boolean
});

const isLoading = ref(false)

const schemaValidation = object(
    validate(['document']),
);
const emit = defineEmits(['resetUploadDocumentData', 'onSubmitUploadDocument', 'uploadData']);

const resetUploadDocumentData = () => {
  emit('resetUploadDocumentData');
}

const onSubmitUploadDocument = async () => {
  isLoading.value = true
  const formData = new FormData();
  formData.append("file", file.value, file.value.name);
  const {data, error} = await API.fileUploadedRequest(formData);

  if (data.value) {
    emit('onSubmitUploadDocument');
  }
  isLoading.value = false
}

function handleFileChange(selectedFile) {
  file.value = selectedFile
  if (file.value && file.value.type.startsWith('image/')) {
    filePreview.value = URL.createObjectURL(file.value) // Set the image preview
  }
}
</script>

<template>
  <Modal
      @close="resetUploadDocumentData"
      :title="$t('title.upload-file')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >

    <div>
      <Form @submit="onSubmitUploadDocument"
            :validation-schema="schemaValidation"
            v-if="showUploadDocumentModalFlag">
        <div>
          <div>
            <BaseFileUpload
                class="flex-grow"
                type="file"
                name="document"
                v-model="file"
                :has-default-error-message="true"
                @handleFileChange="handleFileChange"
            />
          </div>
        </div>
        <div class="py-[6px]" v-if="isLoading">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton type="button" class="btn-outline btn-primary" size="xs" :onclick="modalId+'.close()'">
            {{ $t('button.cancel') }}
          </BaseButton>
          <BaseButton type="submit" class="btn-primary" size="xs">
            {{ $t('button.upload') }}
          </BaseButton>
        </div>
      </Form>
    </div>
  </Modal>
</template>
<style scoped>
</style>
