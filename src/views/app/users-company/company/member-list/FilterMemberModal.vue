<script setup>
import BaseButton from "@/components/BaseButton.vue";
import TextInput from "@/components/TextInput.vue";
import Modal from "@/components/Modal.vue";
import {Form} from "vee-validate";

const props = defineProps({
  showFilterMemberModalFlag: Boolean,
  filterDataTemp: Object,
  filterMemberLoadingFlag: Boolean
});

const emit = defineEmits(['resetFilterMemberData', 'onSubmitFilterMember', 'removeFilterData']);

const resetFilterMemberData = () => {
  emit('resetFilterMemberData');
};

const onSubmitFilterMember = () => {
  emit('onSubmitFilterMember');
};

const removeFilterData = () => {
  emit('removeFilterData');
};
</script>

<template>
  <Modal
      @close="resetFilterMemberData"
      :title="$t('modal.filter-members-list')"
      id="filter_member_modal"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form @submit="onSubmitFilterMember"
            v-if="showFilterMemberModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <TextInput class="flex-grow"
                     :label="$t('form.name')"
                     name="name"
                     :has-default-error-message="true"
                     v-model="filterDataTemp.name"/>
          <TextInput class="flex-grow"
                     :label="$t('form.email')"
                     name="email"
                     :has-default-error-message="true"
                     v-model="filterDataTemp.email"/>

        </div>
        <div class="py-[6px]" v-if="filterMemberLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton type="button" class="btn-outline btn-primary" size="xs" onclick="filter_member_modal.close()">
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
