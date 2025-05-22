<script setup>
import {defineProps, defineEmits, ref} from 'vue';
import Modal from "@/components/Modal.vue";
import {Form} from "vee-validate";
import TextInput from "@/components/TextInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import {object} from "yup";
import {useI18n} from "vue-i18n";
import validate from "@/composables/validate.js";
import BaseCard from "@/components/BaseCard.vue";
import VSelect from "@/components/VSelect.vue";

const props = defineProps({
  currentSchedulerDocument: Array,
  policyList: Array,
  showUpdateSchedulerDocumentModalFlag: Boolean,
  updateSchedulerDocumentLoadingFlag: Boolean,
  modalId: {
    type: String,
    default: "update_scheduler_document_modal",
  }
});
const {t: $t} = useI18n()
const emit = defineEmits(['close', 'onSubmitUpdateSchedulerDocument']);
const updateSchedulerDocumentSchemaValidation = object(
    validate(['title']),
);

const resetUpdateSchedulerDocumentData = () => {
  emit('close');
};
const onSubmitUpdateSchedulerDocument = () => {
  const transformedList = props.currentSchedulerDocument.map(item => ({
    policy_identifier: item.policy_identifier.identifier,
    period: item.period
  }));
  emit('onSubmitUpdateSchedulerDocument',transformedList);
};


function addSchedule() {
  props.currentSchedulerDocument.push({
    policy_identifier: null,
    period: 120
  });
}

function removeSchedule(schedule) {
  props.currentSchedulerDocument.splice(props.currentSchedulerDocument.indexOf(schedule), 1);
}

</script>

<template>
  <Modal
      @close="resetUpdateSchedulerDocumentData"
      :title="$t('modal.update-document')"
      :id="modalId"
      :custom-style="'max-w-3xl text-start'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form  @submit="onSubmitUpdateSchedulerDocument"
             class=""
            v-if="showUpdateSchedulerDocumentModalFlag">
        <div class="grid md:grid-cols-1 lg:grid-cols-1 grid-cols-1 gap-2">
          <!--     for disable autocomplete     -->
          <input type="text" class="hidden"/>
          <!--     for disable autocomplete     -->
          <input type="password" class="hidden"/>

          <div class="justify-end items-end text-end">
            <BaseButton type="button" @click="addSchedule" size="xs" class="end-0 btn btn-outline btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
              </svg>
            </BaseButton>
          </div>
          <div class="grid grid-cols-1 overflow-auto max-h-96 gap-2">
            <BaseCard v-for="(schedule,index) in currentSchedulerDocument" :key="index">
              <VSelect v-if="policyList"
                       v-model="schedule.policy_identifier"
                       :name="'policy_identifier'+index"
                       :title="$t('form.policy')"
                       :placeholder="$t('form.select-policy-placeholder')"
                       class="col-span-1"
                       deselect-label=""
                       :is-multiple="false"
                       traked
                       label="title"
                       :options="policyList"
                       :searchable="true"
                       :allow-empty="true"
              />
              <TextInput class="flex-grow"
                         :label="$t('form.period')+ '('+$t('title.second')+')' "
                         :name="'period'+index"
                         :has-default-error-message="true"
                         v-model="schedule.period"/>
              {{(schedule.period/60)}} {{$t("title.minute")}}
              <div class="justify-end items-end text-end">
                <BaseButton
                    size="xs"
                    @click="removeSchedule(schedule)"
                    class=" text-white tooltip btn-error"
                    :data-tip="$t('tooltip.delete')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                       stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                  </svg>
                </BaseButton>
              </div>
            </BaseCard>
          </div>
        </div>
        <div class="py-[6px]" v-if="updateSchedulerDocumentLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton class="btn-outline btn-primary" size="xs" :onclick="modalId+'.close()'" type="button">
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