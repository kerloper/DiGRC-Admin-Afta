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
  showAddActivateModalFlag: Boolean,
  newActivate: Object,
  statusList: Array,
  frameworkList: Array,
  addActivateLoadingFlag: Boolean,
  modalId:{
    type: String,
    default: "add_activate_company_modal",
  }
});
const {t: $t} = useI18n()
const emit = defineEmits(['resetAddActivateData', 'onSubmitAddActivate']);
const resetAddActivateData = () => {
  emit('resetAddActivateData');
};
const onSubmitAddActivate = () => {
  emit('onSubmitAddActivate');
};

//for handle validation error in add activateCompany
const addActivateSchemaValidation = object(
    validate(['code','stock_count']),
);
</script>

<template>
  <Modal
      @close="resetAddActivateData"
      :title="$t('modal.add-activate')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="addActivateSchemaValidation" @submit="onSubmitAddActivate" class=""
            v-if="showAddActivateModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <TextInput class="flex-grow col-span-2"
                     :label="$t('form.code')"
                     name="code"
                     :has-default-error-message="true"
                     v-model="newActivate.code"/>
            <TextInput class="flex-grow"
                     :label="$t('form.stock-count')"
                     name="stock_count"
                     :has-default-error-message="true"
                     v-model="newActivate.stock_count"/>
          <VSelect v-model="newActivate.status"
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
          <VSelect class="col-span-2"
                   v-model="newActivate.framework"
                   name="framework"
                   deselect-label=""
                   :is-multiple="false"
                   track-by="id"
                   tracked-by="id"
                   :title="$t('form.framework')"
                   label="title"
                   :placeholder="$t('form.select-framework-placeholder')"
                   :options="frameworkList"
                   :searchable="false"
                   :allow-empty="false"
                   :is-preselect-first="true"
          />
        </div>
        <div class="py-[6px]" v-if="addActivateLoadingFlag">
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