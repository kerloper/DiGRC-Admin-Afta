<script setup>
import BaseButton from "@/components/BaseButton.vue";
import TextInput from "@/components/TextInput.vue";
import Modal from "@/components/Modal.vue";
import {Form} from "vee-validate";

const props = defineProps({
  showFilterCompanyModalFlag: Boolean,
  filterDataTemp: Object,
  modalId:{
    type: String,
    default: "filter_company_modal",
  },
  statusList: Array,
  filterCompanyLoadingFlag: Boolean
});

const emit = defineEmits(['resetFilterCompanyData', 'onSubmitFilterCompany', 'removeFilterData']);

const resetFilterCompanyData = () => {
  emit('resetFilterCompanyData');
};

const onSubmitFilterCompany = () => {
  emit('onSubmitFilterCompany');
};

const removeFilterData = () => {
  emit('removeFilterData');
};
</script>

<template>
  <Modal
      @close="resetFilterCompanyData"
      :title="$t('modal.filter-company-list')"
      :custom-style="'max-w-3xl'"
      :id="modalId"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form @submit="onSubmitFilterCompany"
            v-if="showFilterCompanyModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <TextInput class="flex-grow col-span-2"
                     :label="$t('form.title')"
                     name="title"
                     :has-default-error-message="true"
                     v-model="filterDataTemp.title"/>

        </div>
        <div class="py-[6px]" v-if="filterCompanyLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton type="button" class="btn-outline btn-primary" size="xs" :onclick="modalId+'.close()'">
            {{ $t('button.cancel') }}
          </BaseButton>
          <BaseButton type="button" class="btn-secondary" size="xs" @click="removeFilterData()">
            {{ $t('button.remove-filters') }}
          </BaseButton>
          <BaseButton type="submit" class="btn-primary" size="xs">{{ $t('button.submit') }}</BaseButton>
        </div>
      </Form>
    </div>
  </Modal>
</template>

<style scoped>
</style>
