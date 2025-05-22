<script setup>
import BaseButton from "@/components/BaseButton.vue";
import Modal from "@/components/Modal.vue";
import {Form} from "vee-validate";
import {onMounted, ref} from "vue";
import {object} from "yup";
import validate from "@/composables/validate.js";
import API from "@/services/API.js";
import VSelect from "@/components/VSelect.vue";
import {useUserStore} from "@/stores/user.js";

const userStore = useUserStore()
const user = userStore.currentUser
const filePreview = ref('')
const props = defineProps({
  showAddToLibraryModalFlag: Boolean,
  modalId: {
    type: String,
    default: "add_to_library_modal",
  },
  file: {
    type: Object,
    required: true
  },
  addToLibraryLoadingFlag: Boolean
});

const isLoading = ref(false)
const isLoadingAddToLib = ref(false)

const schemaValidation = object(
    validate(['library']),
);
const emit = defineEmits(['resetAddToLibraryData', 'onSubmitAddToLibrary', 'uploadData']);

const resetAddToLibraryData = () => {
  emit('resetAddToLibraryData');
}

async function addToLib() {
  isLoadingAddToLib.value = true
  let formData = {
    files: [
      props.file._id
    ],
    metadata: {
      libId: library.value.libId,
      companyId: user.company_id ?? 0,
      userId: user.id ?? 0
    }
  }

  const {data, error} = await API.addFileToLibraryRequest(formData);
  if (data.value) {
    emit("onSubmitAddToLibrary");
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
      @close="resetAddToLibraryData"
      :title="$t('title.add-to-library')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >

    <div>
      <Form @submit="addToLib"
            :validation-schema="schemaValidation"
            v-if="showAddToLibraryModalFlag">
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
        </div>
        <div class="py-[6px]" v-if="isLoadingAddToLib">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton type="button" class="btn-outline btn-primary" size="xs" :onclick="modalId+'.close()'">
            {{ $t('button.cancel') }}
          </BaseButton>
          <BaseButton type="submit" class="btn-primary" size="xs">
            {{ $t('button.add') }}
          </BaseButton>
        </div>
      </Form>
    </div>
  </Modal>
</template>
<style scoped>
</style>
