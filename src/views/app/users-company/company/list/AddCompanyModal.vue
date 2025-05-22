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
  showAddCompanyModalFlag: Boolean,
  newCompany: Object,
  addCompanyLoadingFlag: Boolean,
  packageList: {
    type: Array,
    default: []
  },
  memberList: {
    type: Array,
    default: []
  },
  modalId: {
    type: String,
    default: "add_company_modal",
  }
})
const {t: $t} = useI18n()
const emit = defineEmits(['resetAddCompanyData', 'onSubmitAddCompany']);
const resetAddCompanyData = () => {
  emit('resetAddCompanyData');
}
const validationList = ref([])
const addCompanySchemaValidation = ref(
    object(
        validate(validationList.value)
    )
)
const onSubmitAddCompany = () => {
  emit('onSubmitAddCompany');
};

function setValidationObjects() {
  validationList.value = ['title', 'package', 'industry', 'user', ...validationList.value]
  addCompanySchemaValidation.value = object(
      validate(validationList.value)
  )
}

watch(props.newCompany, (value) => {
  if (value.email) {
    validationList.value.push('email');
  } else {
    validationList.value = validationList.value.filter(field => field !== 'email');
  }
  if (value.company_website) {
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
      @close="resetAddCompanyData"
      :title="$t('modal.add-company')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="addCompanySchemaValidation"
            @submit="onSubmitAddCompany"
            v-if="showAddCompanyModalFlag">
        <fieldset class="fieldset border p-4 mb-4 rounded-xl">
          <legend class="fieldset-legend">
            {{ $t("title.member-information") }}
          </legend>
          <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
            <VSelect class="flex-grow col-span-2"
                     v-model="newCompany.user"
                     name="user"
                     deselect-label=""
                     :is-multiple="false"
                     track-by="name"
                     tracked-by="id"
                     :track-by="'id'"
                     :id="'id'"
                     :has-default-error-message="true"
                     :title="$t('form.user')"
                     label="name"
                     :placeholder="''"
                     :options="memberList"
                     :searchable="false"
                     :allow-empty="false"
                     :is-preselect-first="false"
            >
              <template #singleLabel="props">
                <div class="flex flex-row gap-2">
                  <div class="">
                    {{ props.data.option.name }}
                  </div>
                  <div>
                    ( {{ props.data.option.email }} )
                  </div>
                </div>
              </template>
              <template #option="props">
                <div class="flex flex-row gap-2">
                  <div class="">
                    {{ props.data.option.name }}
                  </div>
                  <div>
                    ( {{ props.data.option.email }} )
                  </div>
                </div>
              </template>
            </VSelect>
          </div>
        </fieldset>
        <fieldset class="fieldset border p-4 mb-4 rounded-xl">
          <legend class="fieldset-legend">
            {{ $t("title.company-information") }}
          </legend>
          <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
            <TextInput class="flex-grow col-span-2"
                       :label="$t('form.title')"
                       name="title"
                       :has-default-error-message="true"
                       v-model="newCompany.title"/>
            <VSelect class="flex-grow"
                     v-model="newCompany.industry"
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
            <VSelect class="flex-grow"
                     v-model="newCompany.package"
                     name="package"
                     deselect-label=""
                     :is-multiple="false"
                     track-by="name"
                     tracked-by="id"
                     :track-by="'id'"
                     :id="'id'"
                     :has-default-error-message="true"
                     :title="$t('form.package')"
                     label="title"
                     :placeholder="''"
                     :options="packageList"
                     :searchable="false"
                     :allow-empty="false"
                     :is-preselect-first="false"
            />
            <TextInput class="flex-grow"
                       :label="$t('form.phone')"
                       name="mobile"
                       :has-default-error-message="true"
                       v-model="newCompany.company_phone"/>
            <TextInput class="flex-grow"
                       :label="$t('form.email')"
                       name="email"
                       :has-default-error-message="true"
                       v-model="newCompany.company_email"/>
            <TextInput class="flex-grow col-span-2"
                       :label="$t('form.website')"
                       name="website"
                       :has-default-error-message="true"
                       v-model="newCompany.company_website"/>
          </div>
        </fieldset>
        <div class="py-[6px]" v-if="addCompanyLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton class="btn-outline btn-primary text-white" size="xs" onclick="add_company_modal.close()"
                      type="button">
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