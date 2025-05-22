<script setup>
import Modal from "@/components/Modal.vue";
import {object} from "yup";
import BaseButton from "@/components/BaseButton.vue";
import {useI18n} from "vue-i18n";
import {Form} from "vee-validate";
import validate from "@/composables/validate.js";
import {ref} from "vue";
import BaseFileUpload from "@/components/BaseFileUpload.vue";
import { apiV3} from "@/constants/config.js";
import {getCookie} from "@/utils/index.js";
import VuePictureCropper, { cropper } from 'vue-picture-cropper'

const props = defineProps({
  showAvatarUploaderModalFlag: Boolean,
  avatarUploaderLoadingFlag: Boolean,
  modalId: {
    type: String,
    default: "upload_avatar_modal",
  }
});
const {t: $t} = useI18n()
const file = ref(null)
const filePreview = ref('')
const isLoading = ref(false)
const schemaValidation = object(
    validate(['avatar']),
);
const emit = defineEmits(['closeAvatarUploaderModal', 'onSubmitAvatarUploader']);


const onSubmitAvatarUploader = async () => {
  isLoading.value = true
  try{
    if (!cropper) return;

    // Get the cropped file data
    const base64 = cropper.getDataURL();
    const blob = await cropper.getBlob(); // Get the cropped image as a Blob
    if (!blob) {
      console.error("Failed to get cropped blob.");
      return;
    }

    // Create a file from the Blob
    const croppedFile = new File([blob], "avatar.png", { type: blob.type });

    // Prepare headers and form data for API request
    const myHeaders = new Headers();
    myHeaders.append("token", getCookie('utn'));
    const formData = new FormData();
    formData.append("file", croppedFile, "avatar.png");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow"
    };

    fetch(apiV3+"user/avatar/upload", requestOptions)
        .then((response) => response.text())
        .then((result) => emit('onSubmitAvatarUploader'))
        .catch((error) => console.error(error));

  }catch(err){
    console.error(err);
    isLoading.value=false
  }finally {
  }
}

const closeAvatarUploaderModal = () => {
  emit('closeAvatarUploaderModal')
}


function handleFileChange(selectedFile) {
  file.value = selectedFile
  if (file.value && file.value.type.startsWith('image/')) {
    filePreview.value = URL.createObjectURL(file.value) // Set the image preview
  }
}

function ready() {
  console.log('Cropper is ready.')
}

</script>

<template>
  <Modal
      @close="closeAvatarUploaderModal"
      :title="$t('title.upload-avatar')"
      :id="modalId"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div class="grid md:grid-cols-1 lg:grid-cols-1 grid-cols-1 gap-2 max-h-[70vh] overflow-y-auto overflow-x-hidden">
        <Form :validation-schema="schemaValidation" @submit="onSubmitAvatarUploader" class="" id="myForm"
              v-if="showAvatarUploaderModalFlag">

          <BaseFileUpload
              class="flex-grow"
              type="file"
              name="avatar"
              :has-label="true"
              :label="$t('form.avatar')"
              v-model="file"
              :has-default-error-message="true"
              @handleFileChange="handleFileChange"
          />
          <div class="w-full flex mx-auto items-center">
            <VuePictureCropper
                :boxStyle="{
                width: '100%',
                height: '100%',
                backgroundColor: '#f8f8f8',
                margin: 'auto',
              }"
                :img="filePreview"
                :options="{
                viewMode: 1,
                dragMode: 'crop',
                aspectRatio: 1 / 1,
              }"
                @ready="ready"
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
              {{ $t('button.upload') }}
            </BaseButton>
          </div>
        </Form>
    </div>
  </Modal>
</template>

<style scoped>

</style>