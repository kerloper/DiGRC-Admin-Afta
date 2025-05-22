<script setup>
import BaseButton from "@/components/BaseButton.vue";
import TextInput from "@/components/TextInput.vue";
import Modal from "@/components/Modal.vue";
import {Form} from "vee-validate";
import {onMounted, ref} from "vue";
import {object} from "yup";
import validate from "@/composables/validate.js";
import API from "@/services/API.js";
import BaseFileUpload from "@/components/BaseFileUpload.vue";
import VSelect from "@/components/VSelect.vue";
import {useUserStore} from "@/stores/user.js";

const userStore = useUserStore()
const user = userStore.currentUser
const globalLoading = ref(false)
const doneFlag = ref(false)
const file = ref(null)
const filePreview = ref('')
const props = defineProps({
  showUploadDocumentModalFlag: Boolean,
  modalId: {
    type: String,
    default: "upload_document_modal",
  },
  statusList: Array,
  uploadDocumentLoadingFlag: Boolean
});

const isLoading = ref(false)
const isLoadingAddToLib = ref(false)

const schemaValidation = object(
    validate(['document','library' ]),
);
const emit = defineEmits(['resetUploadDocumentData', 'onSubmitUploadDocument', 'uploadData']);

const resetUploadDocumentData = () => {
  emit('resetUploadDocumentData');
}

const isUploadedFileFlag= ref(false)
const isAddedToLibFlag= ref(false)
const fileUploaded = ref(null)

const onSubmitUploadDocument = async () => {
  isLoading.value = true
  globalLoading.value = true
  const formData = new FormData();
  let name = `${Date.now()}_${file.value?.name}`
  formData.append("file", file.value, name);
  const {data, error} = await API.fileUploadedVecRequest(formData);
  if (data.value) {
    isUploadedFileFlag.value = true
    fileUploaded.value =JSON.parse(data.value).data[0]
    await addToLib()
  }else{
    globalLoading.value=false
  }
  isLoading.value = false
}

async function addToLib() {
  isLoadingAddToLib.value = true
  let formData = {
    files: [
        fileUploaded.value._id
    ],
    metadata: {
      libId: library.value.libId,
      companyId: user.company_id??0,
      userId: user.id??0
    }
  }

  const {data, error} = await API.addFileToLibraryRequest(formData);
  if(data.value){
    isLoadingAddToLib.value = false
    isAddedToLibFlag.value = true
    doneFlag.value = true
  }
  globalLoading.value=false
}

function handleFileChange(selectedFile) {
  file.value = selectedFile
  if (file.value && file.value.type.startsWith('image/')) {
    filePreview.value = URL.createObjectURL(file.value) // Set the image preview
  }
}

async function listLibraryRequest() {
  isLoadingLibraryList.value = true
  let response = []
  const {data, error} = await API.listLibraryRequest()
  if (data.value) {
    response = data.value.data
  } else if (error.value) {
  }
  return response
}

const library = ref(null)
const libraryList = ref([])
const isLoadingLibraryList = ref(true)
const fetchData = async () => {
  try {
    const [libraries] = await Promise.all([
      listLibraryRequest(),
    ]);
    libraryList.value = libraries;
    isLoadingLibraryList.value = false
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
  }
};
onMounted(fetchData)

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
        <div class="grid grid-cols-6 gap-2 ">
          <div class="col-span-4">
            <fieldset class="fieldset border p-4   rounded-xl">
              <legend class="fieldset-legend text-sm">
                {{ $t("title.information") }}
              </legend>
              <div>
                <div>
                  <VSelect v-model="library"
                           name="library"
                           :title="$t('form.library')"
                           :has-default-error-message="true"
                           class="col-span-1"
                           deselect-label=""
                           :is-multiple="false"
                           label="title"
                           :options="libraryList"
                           :searchable="true"
                           :allow-empty="true"
                  />
                </div>
                <div>
                  <BaseFileUpload
                      class="flex-grow"
                      type="file"
                      :label="$t('form.document')"
                      :has-label="true"
                      name="document"
                      v-model="file"
                      :has-default-error-message="true"
                      @handleFileChange="handleFileChange"
                  />
                </div>
              </div>
            </fieldset>
          </div>
          <div class="col-span-2 flex flex-row">
            <fieldset class="fieldset border p-2 w-full rounded-xl">
              <legend class="fieldset-legend text-sm">
                {{ $t("title.result") }}
              </legend>
              <div>
                <ul class="steps steps-vertical">
                  <li
                      class="step text-xs"
                      :data-content="isUploadedFileFlag?'✓':''"
                      :class="{'step-neutral': isUploadedFileFlag}"
                  >
                    <div class="flex flex-row gap-2">
                      {{ $t("title.uploading-file") }}
                      <span class="loading loading-spinner loading-xs" v-if="isLoading"></span>
                    </div>
                  </li>
                  <li class="step text-xs"
                      :data-content="isAddedToLibFlag?'✓':''"
                      :class="{'step-neutral': isAddedToLibFlag}"
                  >
                    <div class="flex flex-row gap-2">
                      {{ $t("title.add-to-library") }}
                      <span class="loading loading-spinner loading-xs" v-if="isLoadingAddToLib"></span>
                    </div>
                  </li>
                </ul>
              </div>
            </fieldset>
          </div>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-if="doneFlag">
          <div class="w-full">
            {{ $t('message.file-upload-and-add-to-library-successfully') }}
          </div>
          <BaseButton type="button" @click="emit('onSubmitUploadDocument')" class="btn-primary" size="xs">
            {{ $t('button.close') }}
          </BaseButton>
        </div>
        <div class="py-[6px]" v-else-if="globalLoading">
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
