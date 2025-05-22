<script setup>
import Modal from "@/components/Modal.vue";
import TextInput from "@/components/TextInput.vue";
import {object} from "yup";
import BaseButton from "@/components/BaseButton.vue";
import {useI18n} from "vue-i18n";
import {Form} from "vee-validate";
import validate from "@/composables/validate.js";
import BaseToggleSwitch from "@/components/BaseToggleSwitch.vue";
import VSelect from "@/components/VSelect.vue";
import {onMounted, ref} from "vue";
import API from "@/services/API.js";
import BaseFileUpload from "@/components/BaseFileUpload.vue";

const props = defineProps({
  showAddLibraryModalFlag: Boolean,
  addLibraryLoadingFlag: Boolean,
  modalId: {
    type: String,
    default: "add_library_modal",
  }
});
const {t: $t} = useI18n()
const file = ref(null)
const filePreview = ref('')
const isLoading = ref(false)
const requestParams = ref({
  status: true,
  visible: true,
  icon: {
    type: null,
    value: null,
  }
})
const schemaValidation = object(
    validate(['uniq_id', 'title']),
);
const emit = defineEmits(['closeAddLibraryModal', 'onSubmitAddLibrary'])

const hasIcon = ref(true)
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

const onSubmitAddLibrary = async () => {
  isLoading.value = true
  let iconData = null
  if (file.value) {
    requestParams.value.icon.type = 'file'
    iconData = await uploadFile()
    if (JSON.parse(iconData?.file).data[0].originalname) {
      requestParams.value.icon.value = JSON.parse(iconData?.file).data[0].originalname
    } else {
      requestParams.value.icon = {
        type: null,
        value: null
      }
    }
  }

  const {data, error} = await API.addLibraryRequest(requestParams.value);

  if (data.value) {
    emit('onSubmitAddLibrary');
  }
  isLoading.value = false
}

const closeAddLibraryModal = () => {
  emit('closeAddLibraryModal')
}

function changeVisible() {
  requestParams.value.visible = !requestParams.value.visible;
}

function changeStatus() {
  requestParams.value.status = !requestParams.value.status;
}

function handleFileChange(selectedFile) {
  filePreview.value = null
  file.value = selectedFile
  if (file.value && file.value.type.startsWith('image/')) {
    filePreview.value = URL.createObjectURL(file.value) // Set the image preview
  }
}

</script>

<template>
  <Modal
      @close="closeAddLibraryModal"
      :title="$t('title.add-library')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >

    <div class="  ">
      <div class=" max-h-[70vh] overflow-y-auto overflow-x-hidden">
        <Form :validation-schema="schemaValidation" @submit="onSubmitAddLibrary" class="" id="myForm"
              v-if="showAddLibraryModalFlag">


          <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
            <!--     for disable autocomplete     -->
            <input type="text" class="hidden"/>
            <!--     for disable autocomplete     -->
            <input type="password" class="hidden"/>
            <TextInput class="flex-grow"
                       :label="$t('form.id')"
                       name="uniq_id"
                       :has-default-error-message="true"
                       v-model="requestParams.libId"/>
            <TextInput class="flex-grow"
                       :label="$t('form.title')"
                       name="title"
                       :has-default-error-message="true"
                       v-model="requestParams.title"/>
            <BaseToggleSwitch
                :label="$t('form.status')"
                :toggleActive="requestParams.status"
                :suffixLabel="$t('user.active')"
                :prefixLabel="$t('user.inactive')"
                @toggleAction="changeStatus"
            />
            <BaseToggleSwitch
                :label="$t('form.visible')"
                :toggleActive="requestParams.visible"
                :suffixLabel="$t('form.yes')"
                :prefixLabel="$t('form.no')"
                @toggleAction="changeVisible"
            />
            <div class="col-span-2">
              <BaseFileUpload
                  class="flex-grow"
                  :has-label="false"
                  :is-disabled="!hasIcon"
                  name="file"
                  v-model="file"
                  :has-default-error-message="true"
                  @handleFileChange="handleFileChange"
              />
              <img
                  class="h-20 my-4"
                  v-if="file&&filePreview"
                  :src="filePreview"
                  alt=""
              >
            </div>
          </div>
          <div class="py-[6px]" v-if="isLoading">
            <progress class="progress w-full progress-primary"></progress>
          </div>
          <div class="flex justify-end mt-3 gap-2" v-else>
            <BaseButton class="btn-outline btn-primary" size="xs" :onclick="modalId+'.close()'" type="button">
              {{ $t('button.cancel') }}
            </BaseButton>
            <BaseButton class="btn-primary text-white" size="xs" type="submit">
              {{ $t('button.add-library') }}
            </BaseButton>
          </div>
        </Form>
      </div>

    </div>
  </Modal>
</template>

<style scoped>

</style>