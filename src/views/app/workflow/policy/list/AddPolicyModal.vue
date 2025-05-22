<script setup>
import Modal from "@/components/Modal.vue";
import TextInput from "@/components/TextInput.vue";
import {object} from "yup";
import BaseButton from "@/components/BaseButton.vue";
import {useI18n} from "vue-i18n";
import {Form} from "vee-validate";
import validate from "@/composables/validate.js";

const props = defineProps({
  showAddPolicyModalFlag: Boolean,
  newPolicy: Object,
  statusList: Array,
  roleList: Array,
  addPolicyLoadingFlag: Boolean,
  modalId:{
    type: String,
    default: "add_policy_modal",
  }
})
const {t: $t} = useI18n()
const emit = defineEmits(['resetAddPolicyData', 'onSubmitAddPolicy']);
const resetAddPolicyData = () => {
  emit('resetAddPolicyData');
}
const onSubmitAddPolicy = () => {
  emit('onSubmitAddPolicy');
}
const addPolicySchemaValidation = object(
    validate(['title','identifier']),
)

</script>

<template>
  <Modal
      @close="resetAddPolicyData"
      :title="$t('modal.add-policy')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="addPolicySchemaValidation" @submit="onSubmitAddPolicy"
            v-if="showAddPolicyModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <!--     for disable autocomplete     -->
          <input type="text" class="hidden"/>
          <!--     for disable autocomplete     -->
          <input type="password" class="hidden"/>
          <TextInput class="flex-grow"
                     :label="$t('form.identifier')"
                     name="identifier"
                     :has-default-error-message="true"
                     v-model="newPolicy.id"/>
          <TextInput class="flex-grow"
                     :label="$t('form.title')"
                     name="title"
                     :has-default-error-message="true"
                     v-model="newPolicy.title"/>
          <TextInput class="flex-grow col-span-2"
                     :label="$t('form.description')"
                     name="description"
                     :has-default-error-message="true"
                     v-model="newPolicy.description"/>
        </div>
        <div class="py-[6px]" v-if="addPolicyLoadingFlag">
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