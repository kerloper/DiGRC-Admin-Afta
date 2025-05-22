<script setup>
import {ref, watch} from 'vue';
import Modal from "@/components/Modal.vue";
import TextInput from "@/components/TextInput.vue";
import {object} from "yup";
import VSelect from "@/components/VSelect.vue";
import BaseButton from "@/components/BaseButton.vue";
import {useI18n} from "vue-i18n";
import {Form} from "vee-validate";
import validate from "@/composables/validate.js";
import {industryList} from "@/constants/industry.js";

const props = defineProps({
  showUpdateCompanyModalFlag: Boolean,
  currentCompany: Object,
  updateCompanyLoadingFlag: Boolean,
  packageList:{
    type: Array,
    default:[]
  },
  memberList: {
    type: Array,
    default: []
  },
  modalId: {
    type: String,
    default: "update_company_modal",
  }
})
const {t: $t} = useI18n()
const emit = defineEmits(['resetUpdateCompanyData', 'onSubmitUpdateCompany']);
const resetUpdateCompanyData = () => {
  emit('resetUpdateCompanyData');
}
const validationList = ref([])
const updateCompanySchemaValidation = ref(
    object(
        validate(validationList.value)
    )
)
const onSubmitUpdateCompany = () => {
  emit('onSubmitUpdateCompany');
};

function setValidationObjects() {
  validationList.value = ['title', 'industry', ...validationList.value]
  updateCompanySchemaValidation.value = object(
      validate(validationList.value)
  )
}

watch(props.currentCompany, (value) => {
  if (value.email) {
    validationList.value.push('email');
  } else {
    validationList.value = validationList.value.filter(field => field !== 'email');
  }
  if (value.website) {
    validationList.value.push('website');
  } else {
    validationList.value = validationList.value.filter(field => field !== 'website');
  }
  setValidationObjects()
})
setValidationObjects()
</script>

<template>
  <Modal
      @close="resetUpdateCompanyData"
      :title="$t('modal.update-company')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="updateCompanySchemaValidation"
            @submit="onSubmitUpdateCompany"
            v-if="showUpdateCompanyModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <TextInput class="flex-grow col-span-2"
                     :label="$t('form.title')"
                     name="title"
                     :has-default-error-message="true"
                     v-model="currentCompany.title"/>
          <VSelect class="flex-grow col-span-2"
                   v-model="currentCompany.industry"
                   name="industry"
                   deselect-label=""
                   :is-multiple="false"
                   track-by="name"
                   tracked-by="id"
                   :track-by="'id'"
                   :id="'id'"
                   :has-default-error-message="true"
                   :title="$t('form.industry')"
                   label="title"
                   :placeholder="''"
                   :options="industryList"
                   :searchable="false"
                   :allow-empty="false"
                   :is-preselect-first="false"
          />
          <TextInput class="flex-grow"
                     :label="$t('form.phone')"
                     name="phone"
                     :has-default-error-message="true"
                     v-model="currentCompany.phone"/>
          <TextInput class="flex-grow"
                     :label="$t('form.email')"
                     name="email"
                     :has-default-error-message="true"
                     v-model="currentCompany.email"/>
          <TextInput class="flex-grow col-span-2"
                     :label="$t('form.website')"
                     name="website"
                     :has-default-error-message="true"
                     v-model="currentCompany.website"/>

        </div>
        <div class="py-[6px]" v-if="updateCompanyLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton class="btn-outline btn-primary text-white" size="xs" onclick="update_company_modal.close()"
                      type="button">
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