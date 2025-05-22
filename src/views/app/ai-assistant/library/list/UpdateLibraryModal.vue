<script setup>
import Modal from "@/components/Modal.vue";
import TextInput from "@/components/TextInput.vue";
import {object} from "yup";
import BaseButton from "@/components/BaseButton.vue";
import {useI18n} from "vue-i18n";
import {Form} from "vee-validate";
import validate from "@/composables/validate.js";
import VSelect from "@/components/VSelect.vue";
import {ref} from "vue";
import API from "@/services/API.js";
import BaseFileUpload from "@/components/BaseFileUpload.vue";
import BaseToggleSwitch from "@/components/BaseToggleSwitch.vue";

const props = defineProps({
  showUpdateLibraryModalFlag: Boolean,
  updateLibraryLoadingFlag: Boolean,
  library: Object,
  modalId: {
    type: String,
    default: "update_library_modal",
  }
});
const hasIcon = ref(true)
const file = ref(null)
const filePreview = ref(props.library?.icon?.src ?? null)
const {t: $t} = useI18n()
const isLoading = ref(false)
const schemaValidation = object(
    validate(['uniq_id', 'title']),
);
const emit = defineEmits(['closeUpdateLibraryModal', 'onSubmitUpdateLibrary']);


const uploadFile = async () => {

  const formData = new FormData();
  let name = `${Date.now()}_${file.value?.name}`
  formData.append("file", file.value, name);
  const {data, error} = await API.fileUploadedGlobalRequest(formData);
  if (data.value) {
    return {
      result: true,
      file: data.value
    }
  } else {
    return {
      result: true,
      file: null
    }
  }
}

const onSubmitUpdateLibrary = async () => {
  isLoading.value = true
  let request = {
    id: props.library._id,
    title: props.library.title,
    libId: props.library.libId,
    icon: props.library.icon
  }

  let iconData = null
  if (file.value) {
    props.library.icon.type = 'file'
    iconData = await uploadFile()
    if (JSON.parse(iconData?.file).data[0]?.originalname) {
      props.library.icon.value = JSON.parse(iconData?.file).data[0]?.originalname
    }
  } else {
    request.icon = {
      type: null,
      value: null
    }
  }

  const {data, error} = await API.updateLibraryRequest(request);

  if (data.value) {
    emit('onSubmitUpdateLibrary');
  }
  isLoading.value = false
}

const closeUpdateLibraryModal = () => {
  emit('closeUpdateLibraryModal')
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
      @close="closeUpdateLibraryModal"
      :title="$t('title.update-library')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >

    <div class="  ">
      <div class=" max-h-[70vh] overflow-y-auto overflow-x-hidden">
        <Form :validation-schema="schemaValidation" @submit="onSubmitUpdateLibrary" class="" id="myForm"
              v-if="showUpdateLibraryModalFlag">

          <div class="grid md:grid-cols-4 lg:grid-cols-4 grid-cols-1 gap-2">
            <!--     for disable autocomplete     -->
            <input type="text" class="hidden"/>
            <!--     for disable autocomplete     -->
            <input type="password" class="hidden"/>
            <TextInput class="flex-grow col-span-4 md:col-span-1"
                       :label="$t('form.id')"
                       :is-disabled="true"
                       name="uniq_id"
                       :has-default-error-message="true"
                       v-model="library.libId"/>
            <TextInput class="flex-grow col-span-4 md:col-span-3"
                       :label="$t('form.title')"
                       name="title"
                       :has-default-error-message="true"
                       v-model="library.title"/>
          </div>

          <div
              class="w-full"
          >
            <BaseFileUpload
                class="flex-grow"
                :is-disabled="!hasIcon"
                :label="''"
                :has-label="true"
                name="file"
                v-model="file"
                :has-default-error-message="true"
                @handleFileChange="handleFileChange"
            />
            <img v-if="filePreview"
                 :src="filePreview"
                 class="h-10 my-2"
                 alt=""
            />
          </div>

          <div class="py-[6px]" v-if="isLoading">
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

    </div>
  </Modal>
</template>

<style scoped>

</style>