<script setup>
import BaseButton from "@/components/BaseButton.vue";
import VSelect from "@/components/VSelect.vue";
import TextInput from "@/components/TextInput.vue";
import Modal from "@/components/Modal.vue";
import {Form} from "vee-validate";

const props = defineProps({
  showFilterActivateModalFlag: Boolean,
  filterDataTemp: Object,
  modalId:{
    type: String,
    default: "filter_activate_modal",
  },
  frameworkList: Array,
  statusList: Array,
  filterActivateLoadingFlag: Boolean
});

const emit = defineEmits(['resetFilterActivateData', 'onSubmitFilterActivate', 'removeFilterData']);

const resetFilterActivateData = () => {
  emit('resetFilterActivateData');
};

const onSubmitFilterActivate = () => {
  emit('onSubmitFilterActivate');
};

const removeFilterData = () => {
  emit('removeFilterData');
};
</script>

<template>
  <Modal
      @close="resetFilterActivateData"
      :title="$t('modal.filter-activate-list')"
      :custom-style="'max-w-3xl'"
      :id="modalId"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form @submit="onSubmitFilterActivate"
            v-if="showFilterActivateModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <TextInput class="flex-grow col-span-2"
                     :label="$t('form.code')"
                     name="code"
                     :has-default-error-message="true"
                     v-model="filterDataTemp.code"/>
          <VSelect class="col-span-2"
                   v-model="filterDataTemp.framework"
                   name="framework"
                   deselect-label=""
                   :is-multiple="true"
                   track-by="id"
                   tracked-by="id"
                   :title="$t('form.framework')"
                   label="title"
                   :placeholder="$t('form.select-framework-placeholder')"
                   :options="frameworkList"
                   :searchable="true"
                   :allow-empty="true"
                   :is-preselect-first="false"
          />

        </div>
        <div class="py-[6px]" v-if="filterActivateLoadingFlag">
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
