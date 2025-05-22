<script setup>
import BaseButton from "@/components/BaseButton.vue";
import VSelect from "@/components/VSelect.vue";
import TextInput from "@/components/TextInput.vue";
import Modal from "@/components/Modal.vue";
import {Form} from "vee-validate";

const props = defineProps({
  showFilterDocumentModalFlag: Boolean,
  filterDataTemp: Object,
  modalId:{
    type: String,
    default: "filter_document_modal",
  },
  libraryList: Array,
  filterDocumentLoadingFlag: Boolean
});

const emit = defineEmits(['resetFilterDocumentData', 'onSubmitFilterDocument', 'removeFilterData']);

const resetFilterDocumentData = () => {
  emit('resetFilterDocumentData');
};

const onSubmitFilterDocument = () => {
  emit('onSubmitFilterDocument');
};

const removeFilterData = () => {
  emit('removeFilterData');
};
</script>

<template>
  <Modal
      @close="resetFilterDocumentData"
      :title="$t('modal.filter-document-list')"
      :custom-style="'max-w-3xl'"
      :id="modalId"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form @submit="onSubmitFilterDocument"
            v-if="showFilterDocumentModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <VSelect class="col-span-2"
                   v-model="filterDataTemp.library"
                   name="library"
                   deselect-label=""
                   :is-multiple="false"
                   track-by="libId"
                   tracked-by="libId"
                   :title="$t('form.library')"
                   label="title"
                   :options="libraryList"
                   :searchable="true"
                   :allow-empty="true"
                   :is-preselect-first="false"
          />

        </div>
        <div class="py-[6px]" v-if="filterDocumentLoadingFlag">
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
