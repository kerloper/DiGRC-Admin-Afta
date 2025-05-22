<script setup>
import { defineProps, defineEmits } from 'vue';
import Modal from "@/components/Modal.vue";
import {Form} from "vee-validate";
import TextInput from "@/components/TextInput.vue";
import VSelect from "@/components/VSelect.vue";
import BaseButton from "@/components/BaseButton.vue";
import validate from "@/composables/validate.js";
import {object} from "yup";

const props = defineProps({
  currentRole: Object,
  statusList: Array,
  sectionList: Array,
  showUpdateRoleModalFlag: Boolean,
  updateRoleLoadingFlag: Boolean,
  modalId:{
    type: String,
    default: "update_role_modal",
  }
});

const emit = defineEmits(['close','onSubmitUpdateRole']);

const resetUpdateRoleData = () => {
  emit('close');
};

const onSubmitUpdateRole = () => {
  emit('onSubmitUpdateRole');
};
//for handle validation error in add role
const updateRoleSchemaValidation = object(
    validate(['key','role','resource','module'])
);
</script>

<template>
  <Modal
      @close="resetUpdateRoleData"
      :title="currentRole ? currentRole.name ? currentRole.name : $t('modal.update-role') : $t('modal.update-role')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="updateRoleSchemaValidation" @submit="onSubmitUpdateRole" class=""
            v-if="showUpdateRoleModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <TextInput class="flex-grow"
                     :label="$t('form.key')"
                     name="key"
                     :has-default-error-message="true"
                     v-model="currentRole.key"/>
          <TextInput class="flex-grow"
                     :label="$t('form.resource')"
                     name="resource"
                     :has-default-error-message="true"
                     v-model="currentRole.resource"/>
          <TextInput class="flex-grow"
                     :label="$t('form.module')"
                     name="module"
                     :has-default-error-message="true"
                     v-model="currentRole.module"/>
          <TextInput class="flex-grow"
                     :label="$t('form.role')"
                     name="role"
                     :has-default-error-message="true"
                     v-model="currentRole.role"/>
          <VSelect v-model="currentRole.section"
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
          <VSelect v-model="currentRole.status"
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
        <div class="py-[6px]" v-if="updateRoleLoadingFlag">
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