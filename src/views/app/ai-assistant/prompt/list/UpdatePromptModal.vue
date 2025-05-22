<script setup>
import {defineProps, defineEmits} from 'vue';
import Modal from "@/components/Modal.vue";
import {Form} from "vee-validate";
import TextInput from "@/components/TextInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import {object} from "yup";
import {useI18n} from "vue-i18n";
import validate from "@/composables/validate.js";
import TextareaInput from "@/components/TextareaInput.vue";

const props = defineProps({
  currentPrompt: Object,
  roleList: Array,
  showUpdatePromptModalFlag: Boolean,
  updatePromptLoadingFlag: Boolean,
  modalId: {
    type: String,
    default: "update_prompt_modal",
  }
});
const {t: $t} = useI18n()
const emit = defineEmits(['close', 'onSubmitUpdatePrompt', 'cleanMfa', 'cleanAvatar']);
const resetUpdatePromptData = () => {
  emit('close');
};
const onSubmitUpdatePrompt = () => {
  emit('onSubmitUpdatePrompt');
};
const closeModal = () => {
  emit('close');
};
const updatePromptSchemaValidation = object(
    validate(['title','slug','prompt_text']),
);

</script>

<template>
  <Modal
      @close="resetUpdatePromptData"
      :title="$t('modal.update-prompt')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="updatePromptSchemaValidation" @submit="onSubmitUpdatePrompt" class=""
            v-if="showUpdatePromptModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <TextInput class="flex-grow"
                     :label="$t('form.title')"
                     name="title"
                     :has-default-error-message="true"
                     v-model="currentPrompt.title"/>
          <TextInput class="flex-grow"
                     :label="$t('form.slug')"
                     name="slug"
                     :has-default-error-message="true"
                     v-model="currentPrompt.slug"/>
          <TextareaInput class="flex-grow col-span-2"
                         :label="$t('form.prompt-text')"
                         name="prompt_text"
                         :has-default-error-message="true"
                         v-model="currentPrompt.prompt_text"/>
        </div>
        <div class="py-[6px]" v-if="updatePromptLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-between mt-3" v-else>
          <div class="flex gap-2">

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