<script setup>
import BaseButton from "@/components/BaseButton.vue";
import TextInput from "@/components/TextInput.vue";
import Modal from "@/components/Modal.vue";
import {Form} from "vee-validate";
import BaseDatePicker from "@/components/BaseDatePicker.vue";

const props = defineProps({
  showFilterUserModalFlag: Boolean,
  filterDataTemp: Object,
  modalId:{
    type: String,
    default: "filter_user_modal",
  },
  statusList: Array,
  filterUserLoadingFlag: Boolean
});

const emit = defineEmits(['resetFilterUserData', 'onSubmitFilterUser', 'removeFilterData']);

const resetFilterUserData = () => {
  emit('resetFilterUserData');
};

const onSubmitFilterUser = () => {
  emit('onSubmitFilterUser');
};

const removeFilterData = () => {
  emit('removeFilterData');
};
const handleDateFromUpdate = (newDate) => {
  props.filterDataTemp.data_from = newDate;
};

const handleDateToUpdate = (newDate) => {
  props.filterDataTemp.data_to = newDate;
};
</script>

<template>
  <Modal
      @close="resetFilterUserData"
      :title="$t('modal.filter-user-list')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >

    <div>
      <Form @submit="onSubmitFilterUser"
            v-if="showFilterUserModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <TextInput class="flex-grow"
                     :label="$t('form.user-id')"
                     name="user_id"
                     :has-default-error-message="true"
                     v-model="filterDataTemp.user_id"/>
          <TextInput class="flex-grow"
                     :label="$t('form.operator-id')"
                     name="operator_id"
                     :has-default-error-message="true"
                     v-model="filterDataTemp.operator_id"/>
          <TextInput class="flex-grow"
                     :label="$t('form.username')"
                     name="identity"
                     :has-default-error-message="true"
                     v-model="filterDataTemp.identity"/>
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
          <TextInput class="flex-grow"
                     :label="$t('form.mobile')"
                     name="mobile"
                     :has-default-error-message="true"
                     v-model="filterDataTemp.mobile"/>
          <TextInput class="flex-grow"
                     :label="$t('form.state')"
                     name="state"
                     :has-default-error-message="true"
                     v-model="filterDataTemp.state"/>
          <TextInput class="flex-grow"
                     :label="$t('form.method')"
                     name="method"
                     :has-default-error-message="true"
                     v-model="filterDataTemp.method"/>
          <TextInput class="flex-grow col-span-2"
                     :label="$t('form.ip')"
                     name="ip"
                     :has-default-error-message="true"
                     v-model="filterDataTemp.ip"/>
          <BaseDatePicker
              :label="$t('form.data-from')"
              :selectedDate="filterDataTemp.data_from"
              :v-model="filterDataTemp.data_from"
              @update:selectedDate="handleDateFromUpdate"
          />
          <BaseDatePicker
              :label="$t('form.data-to')"
              :selectedDate="filterDataTemp.data_to"
              :v-model="filterDataTemp.data_to"
              @update:selectedDate="handleDateToUpdate"
          />
        </div>
        <div class="py-[6px]" v-if="filterUserLoadingFlag">
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
