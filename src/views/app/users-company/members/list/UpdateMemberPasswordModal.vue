<script setup>

import {Form} from "vee-validate";
import {defineEmits, defineProps, ref} from "vue";
import Modal from "@/components/Modal.vue";
import {object} from "yup";
import TextInput from "@/components/TextInput.vue";
import {useI18n} from "vue-i18n";
import BaseButton from "@/components/BaseButton.vue";
import validate from "@/composables/validate.js";
import {generatePassword} from "@/composables/password-generator.js";

const props = defineProps({
  currentMember: Object,
  showUpdateMemberPasswordModalFlag: Boolean,
  updateMemberPasswordLoadingFlag: Boolean,
  modalId: {
    type: String,
    default: "update_member_password_modal",
  }
});

const {t: $t} = useI18n()
const isUpdatePassHidden = ref(true)
const updatePassword = ref(null)
const retypeUpdatePassword = ref(null)
const updateMemberPasswordSchemaValidation = object(
      validate(['password','verify_password']),
);

const emit = defineEmits(['close', 'onSubmitUpdateMemberPassword','cleanPassword']);

const resetUpdateMemberPasswordData = () => {
  updatePassword.value = null
  retypeUpdatePassword.value = null
  emit('close');
};

const onSubmitUpdateMemberPassword = () => {
  props.currentMember.password = updatePassword.value
  emit('onSubmitUpdateMemberPassword');
}

const cleanPassword = () => {
  emit('cleanPassword');
}

function toggleUpdatePassVisibilityStatus() {
  isUpdatePassHidden.value = !isUpdatePassHidden.value
}

function refreshPassword() {
  isUpdatePassHidden.value = false
  updatePassword.value = generatePassword(12);
  retypeUpdatePassword.value = updatePassword.value
}
</script>

<template>
  <Modal
      @close="resetUpdateMemberPasswordData"
      :title="currentMember?currentMember.name?currentMember.name:$t('modal.update-member-password'):$t('modal.update-member-password')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="updateMemberPasswordSchemaValidation" @submit="onSubmitUpdateMemberPassword" class=""
            v-if="showUpdateMemberPasswordModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <!--     for disable autocomplete     -->
          <input type="text" class="hidden"/>
          <!--     for disable autocomplete     -->
          <input type="password" class="hidden"/>
          <TextInput class="flex-grow"
                     :label="$t('form.password')"
                     name="password"
                     :has-default-error-message="true"
                     :type="isUpdatePassHidden?'password':'string'"
                     v-model="updatePassword">
            <div class="cursor-pointer" @click="refreshPassword">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <div class="cursor-pointer" @click="toggleUpdatePassVisibilityStatus">
              <svg v-if="isUpdatePassHidden"
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/>
              </svg>
              <svg v-else
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
              </svg>
            </div>
          </TextInput>
          <TextInput class="flex-grow"
                     :label="$t('form.verify-password')"
                     name="verify_password"
                     :has-default-error-message="true"
                     :type="isUpdatePassHidden?'password':'string'"
                     v-model="retypeUpdatePassword">
            <div class="cursor-pointer" @click="toggleUpdatePassVisibilityStatus">
              <svg v-if="isUpdatePassHidden"
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/>
              </svg>
              <svg v-else
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
              </svg>
            </div>
          </TextInput>
        </div>
        <div class="py-[6px]" v-if="updateMemberPasswordLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-between mt-3" v-else>
          <div class="flex gap-2">
            <BaseButton class="btn-outline" size="xs" @click="cleanPassword" type="button">
              {{ $t('button.clean-password') }}
            </BaseButton>
          </div>
          <div class="flex gap-2">
            <BaseButton class="btn-outline btn-primary" size="xs" :onclick="modalId+'.close()'"
                        type="button">
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