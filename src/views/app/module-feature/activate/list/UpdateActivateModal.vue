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

const {t: $t} = useI18n()
const props = defineProps({
  currentActivate: Object,
  statusList: Array,
  frameworkList: Array,
  showUpdateActivateModalFlag: Boolean,
  updateActivateSchemaValidation: Object,
  updateActivateLoadingFlag: Boolean,
  modalId: {
    type: String,
    default: "update_activate_modal",
  }
});

const emit = defineEmits(['close', 'onSubmitUpdateActivate']);

const resetUpdateActivateData = () => {
  emit('close');
};

const onSubmitUpdateActivate = () => {
  emit('onSubmitUpdateActivate');
};
//for handle validation error in update activate
const updateActivateSchemaValidation = object(
    validate(['stock_count']),
);
</script>

<template>
  <Modal
      @close="resetUpdateActivateData"
      :title="currentActivate ? currentActivate.title ? currentActivate.title : $t('modal.update-activate') : $t('modal.update-activate')"
      :id="modalId"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="updateActivateSchemaValidation" @submit="onSubmitUpdateActivate" class=""
            v-if="showUpdateActivateModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <TextInput class="flex-grow"
                     :label="$t('form.stock-count')"
                     name="stock_count"
                     :has-default-error-message="true"
                     v-model="currentActivate.stock_count"/>
          <VSelect v-model="currentActivate.status"
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
        </div>
        <div class="py-[6px]" v-if="updateActivateLoadingFlag">
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