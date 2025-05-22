<script setup>
import Modal from "@/components/Modal.vue";
import {useI18n} from "vue-i18n";
import API from "@/services/API.js";
import {computed, nextTick, ref, watch} from "vue";
import InputElement from './form-components/InputElement.vue';
import TextareaElement from './form-components/TextareaElement.vue';
import CheckboxElement from './form-components/CheckboxElement.vue';
import RadioButtonsElement from './form-components/RadioButtonsElement.vue';
import SelectElement from './form-components/SelectElement.vue';
import UploadFileElement from './form-components/UploadFileElement.vue';
import FormHeading from './form-components/FormHeading.vue';
import SectionHeading from './form-components/SectionHeading.vue';
import SubHeading from './form-components/SubHeading.vue';
import Divider from './form-components/Divider.vue';
import SubmitButton from "@/views/app/workflow/policy/detail/form-components/SubmitButton.vue";
import BaseButton from "@/components/BaseButton.vue";


const props = defineProps({
  node: Object,
  templateModalId :{
    type: String,
    default: "template_modal_id",
  }
})
const {t: $t} = useI18n()
const emit = defineEmits(['close', 'update']);
function close(){
  emit('close');
  isFetching.value = true
}

const temp = ref({});
const {data, isFetching, execute} = API.contextDetail(computed(() => ({id: temp?.value.data?.id||0})))

watch(()=>props.node,(value)=>{
  if(value){
    nextTick(() => {
      temp.value = props.node
      execute()
    });
  }
})
// Extract form elements and title
const formElements = ref(computed(() => data.value?.data?.information?.form|| []))
const formTitle = ref(computed(() => data.value?.data?.title||''))
// Form data object
const formData = ref({});
// Handle form submission
const handleSubmit = () => {
  console.log("Form Data:", formData.value);
};

// Map element types to components
const getComponent = (type) => {
  const componentMap = {
    InputElement,
    TextareaElement,
    CheckboxElement,
    RadioButtonsElement,
    SelectElement,
    // UploadFileElement,
    FormHeading,
    SectionHeading,
    SubHeading,
    Divider,
    // SubmitButton,
  };
  return componentMap[type] || null;
};


</script>

<template>
  <Modal
      @close="close()"
      :title="formTitle"
      :id="templateModalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div class="pe-2 mx-auto   ">
      <div class="min-h-96 skeleton" v-if="isFetching"></div>
      <form @submit.prevent="handleSubmit" class="grid grid-cols-2 gap-2 min-h-44" v-else>
        <component
            v-for="element in formElements"
            :key="element.id"
            :is="getComponent(element.type)"
            :props="element.props"
            v-model="formData[element.props.name]"
        />
      </form>

      <div class="py-[6px]" v-if="isFetching">
        <progress class="progress w-full progress-primary"></progress>
      </div>
      <div class="flex justify-end mt-3 gap-2" v-else>
        <BaseButton class="btn-outline btn-primary" size="xs" @click="close" type="button">
          {{ $t('button.cancel') }}
        </BaseButton>
        <BaseButton class="btn-primary text-white" size="xs" type="submit">
          {{ $t('button.update') }}
        </BaseButton>
      </div>
    </div>

  </Modal>
</template>

<style scoped>

</style>