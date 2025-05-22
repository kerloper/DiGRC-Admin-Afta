<script setup>
import {ref, watch} from 'vue';
import Modal from "@/components/Modal.vue";
import TextInput from "@/components/TextInput.vue";
import {object} from "yup";
import VSelect from "@/components/VSelect.vue";
import BaseButton from "@/components/BaseButton.vue";
import {useI18n} from "vue-i18n";
import {Form} from "vee-validate";
import BaseToggleSwitch from "@/components/BaseToggleSwitch.vue";
import validate from "@/composables/validate.js";
import {generatePassword} from "@/composables/password-generator.js";
import {isMultiRoles} from "@/constants/config.js";

const props = defineProps({
  showAddMemberModalFlag: Boolean,
  newMember: Object,
  statusList: Array,
  roleList: Array,
  addMemberLoadingFlag: Boolean,
  modalId:{
    type: String,
    default: "add_member_modal",
  }
});
const {t: $t} = useI18n()
const emit = defineEmits(['resetAddMemberData', 'onSubmitAddMember']);
const resetAddMemberData = () => {
  emit('resetAddMemberData');
};
const onSubmitAddMember = () => {
  if(hasPassword.value){
    props.newMember.credential = password.value;
  }
  emit('onSubmitAddMember');
};
const hasPassword = ref(true)
const isPassHidden = ref(true)
const password = ref(null)
const retypePassword = ref(null)
const validationList = ref([])

const addMemberSchemaValidation = ref(
    object(
        validate(validationList.value)
    )
)

function togglePassVisibilityStatus() {
  isPassHidden.value = !isPassHidden.value
}

function changePasswordType(){
  hasPassword.value =!hasPassword.value
  setValidationObjects()
}

function changeMemberStatus(){
  props.newMember.status =!props.newMember.status
}

function refreshPassword() {
  isPassHidden.value = false
  password.value = generatePassword(12);
  retypePassword.value = password.value
}

setValidationObjects()
function setValidationObjects() {
  validationList.value = ['first_name','last_name','email']
  if(hasPassword.value){
    validationList.value = [ 'password','verify_password', ...validationList.value]
  }
  if (props.newMember.mobile) {
    validationList.value.push('mobile')
  }
  addMemberSchemaValidation.value = object(
      validate(validationList.value)
  )
}

watch(props.newMember, (value) => {
  setValidationObjects()
})

</script>

<template>
  <Modal
      @close="resetAddMemberData"
      :title="$t('modal.add-member')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div class=" max-h-[70vh] overflow-y-auto overflow-x-hidden">
      <Form :validation-schema="addMemberSchemaValidation" @submit="onSubmitAddMember" class=""
            v-if="showAddMemberModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <!--     for disable autocomplete     -->
          <input type="text" class="hidden"/>
          <!--     for disable autocomplete     -->
          <input type="password" class="hidden"/>
          <TextInput class="flex-grow"
                     :label="$t('form.first-name')"
                     name="first_name"
                     :has-default-error-message="true"
                     v-model="newMember.first_name"/>
          <TextInput class="flex-grow"
                     :label="$t('form.last-name')"
                     name="last_name"
                     :has-default-error-message="true"
                     v-model="newMember.last_name"/>
          <TextInput class="flex-grow"
                     :label="$t('form.email')"
                     name="email"
                     :has-default-error-message="true"
                     v-model="newMember.email"/>
          <TextInput class="flex-grow"
                     :label="$t('form.mobile')"
                     name="mobile"
                     :has-default-error-message="true"
                     v-model="newMember.mobile"/>
          <BaseToggleSwitch
              :label="$t('form.status')"
              :toggleActive="newMember.status===true||newMember.status===1"
              :suffixLabel="$t('user.active')"
              :prefixLabel="$t('user.inactive')"
              @toggleAction="changeMemberStatus"
          />
          <BaseToggleSwitch
              :label="$t('form.credential-type')"
              :toggleActive="hasPassword"
              :suffixLabel="$t('form.password')"
              :prefixLabel="$t('form.otp')"
              @toggleAction="changePasswordType"
          />
          <TextInput class="flex-grow"
                     v-if="hasPassword"
                     :label="$t('form.password')"
                     name="password"
                     :has-default-error-message="true"
                     :type="isPassHidden?'password':'string'"
                     v-model="password">
            <div class="cursor-pointer" @click="refreshPassword">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <div class="cursor-pointer" @click="togglePassVisibilityStatus">
              <svg v-if="isPassHidden"
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
                     v-if="hasPassword"
                     :label="$t('form.verify-password')"
                     name="verify_password"
                     :has-default-error-message="true"
                     :type="isPassHidden?'password':'string'"
                     v-model="retypePassword">
            <div class="cursor-pointer" @click="togglePassVisibilityStatus">
              <svg v-if="isPassHidden"
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
          <VSelect v-if="roleList"
                   v-model="newMember.roles"
                   name="roles"
                   class="md:col-span-2 lg:col-span-2 xl:col-span-2"
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
        <div class="py-[6px]" v-if="addMemberLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton class="btn-outline btn-primary" size="xs" :onclick="modalId+'.close()'" type="button">
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