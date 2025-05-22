<script setup>
import BaseButton from "@/components/BaseButton.vue";
import VSelect from "@/components/VSelect.vue";
import TextInput from "@/components/TextInput.vue";
import Modal from "@/components/Modal.vue";
import {Form} from "vee-validate";

const props = defineProps({
  showFilterResourceModalFlag: Boolean,
  filterDataTemp: Object,
  modalId:{
    type: String,
    default: "filter_resource_modal",
  },
  sectionList: Array,
  filterResourceLoadingFlag: Boolean
});

const emit = defineEmits(['resetFilterResourceData', 'onSubmitFilterResource', 'removeFilterData']);

const resetFilterResourceData = () => {
  emit('resetFilterResourceData');
};

const onSubmitFilterResource = () => {
  emit('onSubmitFilterResource');
};

const removeFilterData = () => {
  emit('removeFilterData');
};
</script>

<template>
  <Modal
      @close="resetFilterResourceData"
      :title="$t('modal.filter-resource-list')"
      :custom-style="'max-w-3xl'"
      :id="modalId"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form @submit="onSubmitFilterResource"
            v-if="showFilterResourceModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <TextInput class="flex-grow"
                     :label="$t('form.title')"
                     name="title"
                     :has-default-error-message="true"
                     v-model="filterDataTemp.title"/>
          <TextInput class="flex-grow"
                     :label="$t('form.key')"
                     name="key"
                     :has-default-error-message="true"
                     v-model="filterDataTemp.key"/>
          <TextInput class="flex-grow"
                     :label="$t('form.module')"
                     name="module"
                     :has-default-error-message="true"
                     v-model="filterDataTemp.module"/>
          <VSelect name="section"
                   deselect-label=""
                   :is-multiple="false"
                   track-by="key"
                   :title="$t('form.section')"
                   label="title"
                   :placeholder="$t('form.select-section-placeholder')"
                   :options="sectionList"
                   :searchable="false"
                   :allow-empty="true"
                   :is-preselect-first="false"
                   v-model="filterDataTemp.section"
          />
        </div>
        <div class="py-[6px]" v-if="filterResourceLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton class="btn-outline btn-primary" size="xs" :onclick="modalId+'.close()'" type="button">
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
