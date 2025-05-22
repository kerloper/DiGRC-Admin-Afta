<script setup>
import {defineProps, defineEmits} from 'vue';
import Modal from "@/components/Modal.vue";
import {Form} from "vee-validate";
import TextInput from "@/components/TextInput.vue";
import VSelect from "@/components/VSelect.vue";
import BaseButton from "@/components/BaseButton.vue";
import {object} from "yup";
import {useI18n} from "vue-i18n";
import validate from "@/composables/validate.js";
import {isMultiRoles} from "@/constants/config.js";

const props = defineProps({
  currentMember: Object,
  roleList: Array,
  showUpdateMemberModalFlag: Boolean,
  updateMemberLoadingFlag: Boolean,
  modalId: {
    type: String,
    default: "update_member_modal",
  }
});
const {t: $t} = useI18n()
const emit = defineEmits(['close', 'onSubmitUpdateMember', 'cleanMfa', 'cleanAvatar']);
const resetUpdateMemberData = () => {
  emit('close');
};
const onSubmitUpdateMember = () => {
  emit('onSubmitUpdateMember');
};
const cleanMfa = () => {
  emit('cleanMfa');
};
const cleanAvatar = () => {
  emit('cleanAvatar');
};
const closeModal = () => {
  emit('close');
};
const updateMemberSchemaValidation = object(
    validate(['first_name','last_name']),
);

</script>

<template>
  <Modal
      @close="resetUpdateMemberData"
      :title="currentMember ? currentMember.name ? currentMember.name : $t('modal.update-member') : $t('modal.update-member')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="updateMemberSchemaValidation" @submit="onSubmitUpdateMember" class=""
            v-if="showUpdateMemberModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <TextInput class="flex-grow"
                     :label="$t('form.first-name')"
                     name="first_name"
                     :has-default-error-message="true"
                     v-model="currentMember.first_name"/>
          <TextInput class="flex-grow"
                     :label="$t('form.last-name')"
                     name="last_name"
                     :has-default-error-message="true"
                     v-model="currentMember.last_name"/>
          <VSelect v-if="roleList"
                   v-model="currentMember.roles"
                   name="roles"
                   class="col-span-2"
                   deselect-label=""
                   :is-multiple="isMultiRoles"
                   track-by="name"
                   tracked-by="name"
                   :title="$t('form.roles')"
                   label="title"
                   :placeholder="$t('form.select-roles-placeholder')"
                   :options="roleList"
                   :searchable="false"
                   :allow-empty="false"
          />
        </div>
        <div class="py-[6px]" v-if="updateMemberLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-between mt-3" v-else>
          <div class="flex gap-2">
            <BaseButton class="btn-outline" size="xs" @click="cleanMfa" type="button">
              {{ $t('button.clean-mfa') }}
            </BaseButton>
            <BaseButton class="btn-outline" size="xs" @click="cleanAvatar" type="button">
              {{ $t('button.clean-avatar') }}
            </BaseButton>
          </div>
          <div class="flex gap-2">
            <BaseButton class="btn-outline btn-primary" size="xs" @click="closeModal" type="button">
              {{ $t('button.cancel') }}
            </BaseButton>
            <BaseButton class="btn-primary text-white" size="xs" type="submit">
              {{ $t('button.update') }}
            </BaseButton>
          </div>
        </div>
      </Form>
    </div>
  </Modal>
</template>

<style scoped>

</style>