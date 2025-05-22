<script setup>
import Modal from "@/components/Modal.vue";
import TextInput from "@/components/TextInput.vue";
import {object} from "yup";
import VSelect from "@/components/VSelect.vue";
import BaseButton from "@/components/BaseButton.vue";
import {useI18n} from "vue-i18n";
import {Form} from "vee-validate";
import validate from "@/composables/validate.js";
import TextareaInput from "@/components/TextareaInput.vue";

const props = defineProps({
  showAddFrameworkModalFlag: Boolean,
  newFramework: Object,
  statusList: Array,
  addFrameworkLoadingFlag: Boolean,
  modalId:{
    type: String,
    default: "add_framework_company_modal",
  }
});
const {t: $t} = useI18n()
const emit = defineEmits(['resetAddFrameworkData', 'onSubmitAddFramework']);
const resetAddFrameworkData = () => {
  emit('resetAddFrameworkData');
};
const onSubmitAddFramework = () => {
  emit('onSubmitAddFramework');
};

//for handle validation error in add frameworkCompany
const addFrameworkSchemaValidation = object(
    validate(['slug','title','circle_image','square_image'])
);
</script>

<template>
  <Modal
      @close="resetAddFrameworkData"
      :title="$t('modal.add-framework')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="addFrameworkSchemaValidation" @submit="onSubmitAddFramework" class=""
            v-if="showAddFrameworkModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <TextInput class="flex-grow col-span-2"
                     :label="$t('form.title')"
                     name="title"
                     :has-default-error-message="true"
                     v-model="newFramework.title"/>
          <TextInput class="flex-grow col-span-2"
                     :label="$t('form.slug')"
                     name="slug"
                     :has-default-error-message="true"
                     v-model="newFramework.slug"/>
          <TextInput class="flex-grow"
                     :label="$t('form.price')"
                     name="price"
                     :has-default-error-message="true"
                     v-model="newFramework.price"/>
          <VSelect v-model="newFramework.status"
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
                     v-model="newFramework.square_image"/>
          <TextInput class="flex-grow"
                     :label="$t('form.circle-image')"
                     name="circle_image"
                     :has-default-error-message="true"
                     v-model="newFramework.circle_image"/>
          <TextareaInput class="flex-grow col-span-2"
                         :label="$t('form.description')"
                         :min-h="'min-h-36'"
                         name="description"
                         :has-default-error-message="true"
                         v-model="newFramework.description"/>
        </div>
        <div class="py-[6px]" v-if="addFrameworkLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton class="btn-outline btn-primary text-white" size="xs" :onclick="modalId+'.close()'"
                      type="button">
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