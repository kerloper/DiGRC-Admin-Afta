<script setup>
import Modal from "@/components/Modal.vue";
import TextInput from "@/components/TextInput.vue";
import {object} from "yup";
import VSelect from "@/components/VSelect.vue";
import BaseButton from "@/components/BaseButton.vue";
import {useI18n} from "vue-i18n";
import {Form} from "vee-validate";
import validate from "@/composables/validate.js";

const props = defineProps({
  showAddDomainModalFlag: Boolean,
  newDomain: Object,
  statusList: Array,
  frameworkList: Array,
  addDomainLoadingFlag: Boolean,
  modalId:{
    type: String,
    default: "add_domain_company_modal",
  }
});
const {t: $t} = useI18n()
const emit = defineEmits(['resetAddDomainData', 'onSubmitAddDomain']);
const resetAddDomainData = () => {
  emit('resetAddDomainData');
};
const onSubmitAddDomain = () => {
  emit('onSubmitAddDomain');
};

//for handle validation error in add domainCompany
const addDomainSchemaValidation = object(
    validate(['title'])
);
</script>

<template>
  <Modal
      @close="resetAddDomainData"
      :title="$t('modal.add-domain')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="addDomainSchemaValidation" @submit="onSubmitAddDomain" class=""
            v-if="showAddDomainModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <TextInput class="flex-grow"
                     :label="$t('form.title')"
                     name="title"
                     :has-default-error-message="true"
                     v-model="newDomain.title"/>
          <VSelect v-model="newDomain.status"
                   name="status"
                   deselect-label=""
                   :is-multiple="false"
                   track-by="key"
                   :title="$t('form.status')"
                   label="title"
                   :placeholder="$t('form.select-status-placeholder')"
                   :options="statusList"
                   :searchable="false"
                   :allow-empty="false"
                   :is-preselect-first="true"
          />
          <VSelect class="col-span-2"
                   v-model="newDomain.framework"
                   name="framework"
                   deselect-label=""
                   :is-multiple="false"
                   track-by="id"
                   tracked-by="id"
                   :title="$t('form.framework')"
                   label="title"
                   :placeholder="$t('form.select-framework-placeholder')"
                   :options="frameworkList"
                   :searchable="false"
                   :allow-empty="false"
                   :is-preselect-first="true"
          />
        </div>
        <div class="py-[6px]" v-if="addDomainLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton class="btn-outline btn-primary text-white" size="xs" :onclick="modalId+'.close()'"
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