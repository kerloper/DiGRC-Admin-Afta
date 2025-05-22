<script setup>
import { defineProps, defineEmits } from 'vue';
import Modal from "@/components/Modal.vue";
import {Form} from "vee-validate";
import TextInput from "@/components/TextInput.vue";
import VSelect from "@/components/VSelect.vue";
import BaseButton from "@/components/BaseButton.vue";
import {object} from "yup";
import validate from "@/composables/validate.js";

const props = defineProps({
  currentPage: Object,
  statusList: Array,
  sectionList: Array,
  showUpdatePageModalFlag: Boolean,
  updatePageLoadingFlag: Boolean,
  modalId:{
    type: String,
    default: "update_page_modal",
  }
});
const emit = defineEmits(['close','onSubmitUpdatePage']);
const resetUpdatePageData = () => {
  emit('close');
};
const onSubmitUpdatePage = () => {
  emit('onSubmitUpdatePage');
};
const updatePageSchemaValidation = object(
    validate(['key','title','module','package','resource','handler'])
);
</script>

<template>
  <Modal
      @close="resetUpdatePageData"
      :title="currentPage ? currentPage.name ? currentPage.name : $t('modal.update-page') : $t('modal.update-page')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="updatePageSchemaValidation" @submit="onSubmitUpdatePage" class=""
            v-if="showUpdatePageModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <TextInput class="flex-grow"
                     :label="$t('form.key')"
                     name="key"
                     :has-default-error-message="true"
                     v-model="currentPage.key"/>
          <TextInput class="flex-grow"
                     :label="$t('form.title')"
                     name="title"
                     :has-default-error-message="true"
                     v-model="currentPage.title"/>
          <TextInput class="flex-grow"
                     :label="$t('form.module')"
                     name="module"
                     :has-default-error-message="true"
                     v-model="currentPage.module"/>
          <TextInput class="flex-grow"
                     :label="$t('form.resource')"
                     name="resource"
                     :has-default-error-message="true"
                     v-model="currentPage.resource"/>
          <TextInput class="flex-grow"
                     :label="$t('form.handler')"
                     name="handler"
                     :has-default-error-message="true"
                     v-model="currentPage.handler"/>
          <TextInput class="flex-grow"
                     :label="$t('form.package')"
                     name="package"
                     :has-default-error-message="true"
                     v-model="currentPage.package"/>
          <VSelect v-model="currentPage.section"
                   name="section"
                   deselect-label=""
                   :is-multiple="false"
                   track-by="key"
                   :title="$t('form.section')"
                   label="title"
                   :placeholder="$t('form.select-section-placeholder')"
                   :options="sectionList"
                   :searchable="false"
                   :allow-empty="false"
                   :is-preselect-first="true"
          />
          <VSelect v-model="currentPage.status"
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
        <div class="py-[6px]" v-if="updatePageLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton class="btn-outline btn-primary text-white" size="xs" :onclick="modalId+'.close()'" type="button">
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