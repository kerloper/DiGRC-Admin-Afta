<script setup>
import { defineProps, defineEmits } from 'vue';
import Modal from "@/components/Modal.vue";
import {Form} from "vee-validate";
import TextInput from "@/components/TextInput.vue";
import VSelect from "@/components/VSelect.vue";
import BaseButton from "@/components/BaseButton.vue";
import {object} from "yup";
import {useI18n} from "vue-i18n";
import validate from "@/composables/validate.js";
import TextareaInput from "@/components/TextareaInput.vue";

const {t: $t} = useI18n()
const props = defineProps({
  currentFramework: Object,
  statusList: Array,
  showUpdateFrameworkModalFlag: Boolean,
  updateFrameworkSchemaValidation: Object,
  updateFrameworkLoadingFlag: Boolean,
  modalId:{
    type: String,
    default: "update_framework_modal",
  }
});

const emit = defineEmits(['close','onSubmitUpdateFramework']);

const resetUpdateFrameworkData = () => {
  emit('close');
};

const onSubmitUpdateFramework = () => {
  emit('onSubmitUpdateFramework');
};
//for handle validation error in update framework
const updateFrameworkSchemaValidation = object(
    validate(['title','circle_image','square_image'])
);
</script>

<template>
  <Modal
      @close="resetUpdateFrameworkData"
      :title="currentFramework ? currentFramework.title ? currentFramework.title : $t('modal.update-framework') : $t('modal.update-framework')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="updateFrameworkSchemaValidation" @submit="onSubmitUpdateFramework" class=""
            v-if="showUpdateFrameworkModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <TextInput class="flex-grow col-span-2"
                     :label="$t('form.title')"
                     name="title"
                     :has-default-error-message="true"
                     v-model="currentFramework.title"/>
          <TextInput class="flex-grow"
                     :label="$t('form.price')"
                     name="price"
                     :has-default-error-message="true"
                     v-model="currentFramework.price"/>
          <VSelect v-model="currentFramework.status"
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
          <TextInput class="flex-grow"
                     :label="$t('form.square-image')"
                     name="square_image"
                     :has-default-error-message="true"
                     v-model="currentFramework.square_image"/>
          <TextInput class="flex-grow"
                     :label="$t('form.circle-image')"
                     name="circle_image"
                     :has-default-error-message="true"
                     v-model="currentFramework.circle_image"/>
          <TextareaInput class="flex-grow col-span-2"
                         :label="$t('form.description')"
                         :min-h="'min-h-36'"
                         name="description"
                         :has-default-error-message="true"
                         v-model="currentFramework.description"/>
        </div>
        <div class="py-[6px]" v-if="updateFrameworkLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton class="btn-outline btn-primary text-white" size="xs" :onclick="modalId+'.close()'"
                      type="button">
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