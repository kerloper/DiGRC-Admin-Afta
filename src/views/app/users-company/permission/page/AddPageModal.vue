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
  showAddPageModalFlag: Boolean,
  newPage: Object,
  statusList: Array,
  sectionList: Array,
  addPageLoadingFlag: Boolean,
  modalId:{
    type: String,
    default: "add_page_modal",
  }
});
const {t: $t} = useI18n()
const emit = defineEmits(['resetAddPageData', 'onSubmitAddPage']);
const resetAddPageData = () => {
  emit('resetAddPageData');
};
const onSubmitAddPage = () => {
  emit('onSubmitAddPage');
};
//for handle validation error in add page
const addPageSchemaValidation = object(
    validate(['key','title','module','package','resource','handler'])
);
</script>

<template>
  <Modal
      @close="resetAddPageData"
      :title="$t('modal.add-page')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="addPageSchemaValidation" @submit="onSubmitAddPage" v-if="showAddPageModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <TextInput class="flex-grow"
                     :label="$t('form.key')"
                     name="key"
                     :has-default-error-message="true"
                     v-model="newPage.key"/>
          <TextInput class="flex-grow"
                     :label="$t('form.title')"
                     name="title"
                     :has-default-error-message="true"
                     v-model="newPage.title"/>
          <TextInput class="flex-grow"
                     :label="$t('form.module')"
                     name="module"
                     :has-default-error-message="true"
                     v-model="newPage.module"/>
          <TextInput class="flex-grow"
                     :label="$t('form.resource')"
                     name="resource"
                     :has-default-error-message="true"
                     v-model="newPage.resource"/>
          <TextInput class="flex-grow"
                     :label="$t('form.handler')"
                     name="handler"
                     :has-default-error-message="true"
                     v-model="newPage.handler"/>
          <TextInput class="flex-grow"
                     :label="$t('form.package')"
                     name="package"
                     :has-default-error-message="true"
                     v-model="newPage.package"/>
          <VSelect v-model="newPage.section"
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
          <VSelect v-model="newPage.status"
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
        <div class="py-[6px]" v-if="addPageLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton class="btn-outline btn-primary text-white" size="xs" :onclick="modalId+'.close()'" type="button">
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