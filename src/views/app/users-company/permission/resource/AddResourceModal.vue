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
  showAddResourceModalFlag: Boolean,
  newResource: Object,
  statusList: Array,
  sectionList: Array,
  addResourceLoadingFlag: Boolean,
  modalId:{
    type: String,
    default: "add_resource_modal",
  }
});
const {t: $t} = useI18n()
const emit = defineEmits(['resetAddResourceData', 'onSubmitAddResource']);
const resetAddResourceData = () => {
  emit('resetAddResourceData');
};
const onSubmitAddResource = () => {
  emit('onSubmitAddResource');
};
//for handle validation error in add resource
const addResourceSchemaValidation = object(
    validate(['key','title','module','type']),
);
</script>

<template>
  <Modal
      @close="resetAddResourceData"
      :title="$t('modal.add-resource')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="addResourceSchemaValidation" @submit="onSubmitAddResource"
            v-if="showAddResourceModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <TextInput class="flex-grow"
                     :label="$t('form.key')"
                     name="key"
                     :has-default-error-message="true"
                     v-model="newResource.key"/>
          <TextInput class="flex-grow"
                     :label="$t('form.title')"
                     name="title"
                     :has-default-error-message="true"
                     v-model="newResource.title"/>
          <TextInput class="flex-grow"
                     :label="$t('form.module')"
                     name="module"
                     :has-default-error-message="true"
                     v-model="newResource.module"/>
          <TextInput class="flex-grow"
                     :label="$t('form.type')"
                     name="type"
                     :has-default-error-message="true"
                     v-model="newResource.type"/>
          <VSelect v-model="newResource.section"
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
          <VSelect v-model="newResource.status"
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
        <div class="py-[6px]" v-if="addResourceLoadingFlag">
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