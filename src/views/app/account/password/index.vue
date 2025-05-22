<script setup>
import BaseCard from "@/components/BaseCard.vue";
import {Form} from "vee-validate";
import TextInput from "@/components/TextInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import {useUserStore} from "@/stores/user.js";
import {ref} from "vue";
import {storeToRefs} from "pinia";
import {object} from "yup";
import {useI18n} from "vue-i18n";
import validate from "@/composables/validate.js";

const {t: $t} = useI18n()
const userStore = useUserStore()
const user = userStore.currentUser
const userTemp = ref({});
const {updateProcessing} = storeToRefs(userStore);
const setPasswordSchemaValidation = object(
    validate(['password', 'verify_password']),
);
const updatePasswordSchemaValidation = object(
    validate(['current_password', 'password', 'verify_password']),
);
const isCurrentPassHidden = ref(true)
const isUpdatePassHidden = ref(true)
const isUpdatePassVerifyHidden = ref(true)
const updatePassword = ref(null)
const retypeUpdatePassword = ref(null)
const currentPassword = ref(null)

Object.assign(userTemp.value, user);

function cancel() {
  updatePassword.value = null
  retypeUpdatePassword.value = null
  currentPassword.value = null
}

function toggleCurrentPassVisibilityStatus() {
  isCurrentPassHidden.value = !isCurrentPassHidden.value
}

function toggleUpdatePassVisibilityStatus() {
  isUpdatePassHidden.value = !isUpdatePassHidden.value
}

function toggleUpdatePassVerifyVisibilityStatus() {
  isUpdatePassVerifyHidden.value = !isUpdatePassVerifyHidden.value;
}

function tryUpdatePassword() {
  if(userTemp.value.has_password){
    userStore.tryUpdatePassword({
      current_credential: currentPassword.value,
      new_credential: updatePassword.value,
    });
  }else{
    userStore.trySetPassword({
      credential: updatePassword.value
    });
  }

}

</script>

<template>
  <section>
    <BaseCard class="min-h-[57vh]">
      <h3>
        {{ userTemp.has_password ? $t('title.update-password') : $t('title.set-password') }}
      </h3>
      <div class="box border-1 border-gray-200 max-w-[520px]">
        <Form :validation-schema="userTemp.has_password?updatePasswordSchemaValidation:setPasswordSchemaValidation"
              @submit="tryUpdatePassword">
          <div class="grid md:grid-cols-1 lg:grid-cols-1 grid-cols-1 gap-2">
            <!--     for disable autocomplete     -->
            <input type="text" class="hidden"/>
            <!--     for disable autocomplete     -->
            <input type="password" class="hidden"/>
            <TextInput
                v-if="userTemp.has_password"
                class="flex-grow"
                :label="$t('form.current-password')"
                name="current_password"
                :has-default-error-message="true"
                :type="isCurrentPassHidden?'password':'string'"
                v-model="currentPassword">
              <div class="cursor-pointer" @click="toggleCurrentPassVisibilityStatus">
                <svg v-if="isCurrentPassHidden"
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
                       :label="$t('form.new-password')"
                       name="password"
                       :has-default-error-message="true"
                       :type="isUpdatePassHidden?'password':'string'"
                       v-model="updatePassword">
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
                       :label="$t('form.verify-new-password')"
                       name="verify_password"
                       :has-default-error-message="true"
                       :type="isUpdatePassVerifyHidden?'password':'string'"
                       v-model="retypeUpdatePassword">
              <div class="cursor-pointer" @click="toggleUpdatePassVerifyVisibilityStatus">
                <svg v-if="isUpdatePassVerifyHidden"
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
          <div class="py-[6px]" v-if="updateProcessing">
            <progress class="progress w-full progress-primary"></progress>
          </div>
          <div class="flex justify-end mt-3 gap-2" v-else>
            <BaseButton class="btn-outline btn-primary" size="xs" @click="cancel" type="button">
              {{ $t('button.cancel') }}
            </BaseButton>
            <BaseButton class="btn-primary text-white" size="xs" type="submit">
              {{ $t('button.update') }}
            </BaseButton>
          </div>
        </Form>
      </div>
    </BaseCard>
  </section>
</template>

<style scoped>

</style>