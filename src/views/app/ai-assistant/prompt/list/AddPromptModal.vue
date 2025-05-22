<script setup>
import Modal from "@/components/Modal.vue";
import TextInput from "@/components/TextInput.vue";
import {object} from "yup";
import BaseButton from "@/components/BaseButton.vue";
import {useI18n} from "vue-i18n";
import {Form} from "vee-validate";
import validate from "@/composables/validate.js";
import TextareaInput from "@/components/TextareaInput.vue";

const props = defineProps({
  showAddPromptModalFlag: Boolean,
  newPrompt: Object,
  addPromptLoadingFlag: Boolean,
  modalId:{
    type: String,
    default: "add_prompt_modal",
  }
});
const {t: $t} = useI18n()
const emit = defineEmits(['resetAddPromptData', 'onSubmitAddPrompt']);
const resetAddPromptData = () => {
  emit('resetAddPromptData');
};
const onSubmitAddPrompt = () => {
  emit('onSubmitAddPrompt');
};
const addPromptSchemaValidation = object(
    validate(['title','slug','prompt_text']),
);


</script>

<template>
  <Modal
      @close="resetAddPromptData"
      :title="$t('modal.add-prompt')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="addPromptSchemaValidation" @submit="onSubmitAddPrompt" class=""
            v-if="showAddPromptModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <!--     for disable autocomplete     -->
          <input type="text" class="hidden"/>
          <!--     for disable autocomplete     -->
          <input type="password" class="hidden"/>
          <TextInput class="flex-grow"
                     :label="$t('form.title')"
                     name="title"
                     :has-default-error-message="true"
                     v-model="newPrompt.title"/>
          <TextInput class="flex-grow"
                     :label="$t('form.slug')"
                     name="slug"
                     :has-default-error-message="true"
                     v-model="newPrompt.slug"/>
          <TextareaInput class="flex-grow col-span-2"
                     :label="$t('form.prompt-text')"
                     name="prompt_text"
                     :has-default-error-message="true"
                     v-model="newPrompt.prompt_text"/>
        </div>
        <div class="py-[6px]" v-if="addPromptLoadingFlag">
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