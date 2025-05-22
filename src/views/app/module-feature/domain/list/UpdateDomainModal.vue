<script setup>
import { defineProps, defineEmits } from 'vue';
import Modal from "@/components/Modal.vue";
import {Form} from "vee-validate";
import TextInput from "@/components/TextInput.vue";
import VSelect from "@/components/VSelect.vue";
import BaseButton from "@/components/BaseButton.vue";
import {object} from "yup";
import {useI18n} from "vue-i18n";
import validate from "@/composables/validate.js";

const {t: $t} = useI18n()
const props = defineProps({
  currentDomain: Object,
  statusList: Array,
  frameworkList: Array,
  showUpdateDomainModalFlag: Boolean,
  updateDomainSchemaValidation: Object,
  updateDomainLoadingFlag: Boolean,
  modalId:{
    type: String,
    default: "update_domain_modal",
  }
});

const emit = defineEmits(['close','onSubmitUpdateDomain']);

const resetUpdateDomainData = () => {
  emit('close');
};

const onSubmitUpdateDomain = () => {
  emit('onSubmitUpdateDomain');
};
//for handle validation error in update domain
const updateDomainSchemaValidation = object(
    validate(['title'])
);
</script>

<template>
  <Modal
      @close="resetUpdateDomainData"
      :title="currentDomain ? currentDomain.title ? currentDomain.title : $t('modal.update-domain') : $t('modal.update-domain')"
      :id="modalId"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="updateDomainSchemaValidation" @submit="onSubmitUpdateDomain" class=""
            v-if="showUpdateDomainModalFlag">

        <div class="grid md:grid-cols-1 lg:grid-cols-1 grid-cols-1 gap-2">
          <TextInput class="flex-grow"
                     :label="$t('form.title')"
                     name="title"
                     :has-default-error-message="true"
                     v-model="currentDomain.title"/>
          <VSelect v-model="currentDomain.status"
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
        </div>
        <div class="py-[6px]" v-if="updateDomainLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton class="btn-outline btn-primary text-white" size="xs" :onclick="modalId+'.close()'"
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