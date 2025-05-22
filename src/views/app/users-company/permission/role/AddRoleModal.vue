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
  showAddRoleModalFlag: Boolean,
  newRole: Object,
  statusList: Array,
  sectionList: Array,
  addRoleLoadingFlag: Boolean,
  modalId:{
    type: String,
    default: "add_role_modal",
  }
});
const {t: $t} = useI18n()
const emit = defineEmits(['resetAddRoleData', 'onSubmitAddRole']);
const resetAddRoleData = () => {
  emit('resetAddRoleData');
};
const onSubmitAddRole = () => {
  emit('onSubmitAddRole');
};

//for handle validation error in add role
const addRoleSchemaValidation = object(
    validate(['key','resource','module','role'])
);
</script>

<template>
  <Modal
      @close="resetAddRoleData"
      :title="$t('modal.add-role')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="addRoleSchemaValidation" @submit="onSubmitAddRole"
            v-if="showAddRoleModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <TextInput class="flex-grow"
                     :label="$t('form.key')"
                     name="key"
                     :has-default-error-message="true"
                     v-model="newRole.key"/>
          <TextInput class="flex-grow"
                     :label="$t('form.resource')"
                     name="resource"
                     :has-default-error-message="true"
                     v-model="newRole.resource"/>
          <TextInput class="flex-grow"
                     :label="$t('form.module')"
                     name="module"
                     :has-default-error-message="true"
                     v-model="newRole.module"/>
          <TextInput class="flex-grow"
                     :label="$t('form.role')"
                     name="role"
                     :has-default-error-message="true"
                     v-model="newRole.role"/>
          <VSelect v-model="newRole.section"
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
          <VSelect v-model="newRole.status"
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
        <div class="py-[6px]" v-if="addRoleLoadingFlag">
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