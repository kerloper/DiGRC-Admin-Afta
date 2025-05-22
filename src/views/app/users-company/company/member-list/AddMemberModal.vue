<script setup>
import {ref, watch} from 'vue';
import Modal from "@/components/Modal.vue";
import TextInput from "@/components/TextInput.vue";
import {object} from "yup";
import VSelect from "@/components/VSelect.vue";
import BaseButton from "@/components/BaseButton.vue";
import {useI18n} from "vue-i18n";
import {Form} from "vee-validate";
import BaseToggleSwitch from "@/components/BaseToggleSwitch.vue";
import validate from "@/composables/validate.js";
import {generatePassword} from "@/composables/password-generator.js";
import {isMultiRoles} from "@/constants/config.js";

const props = defineProps({
  showAddMemberModalFlag: Boolean,
  newMember: Object,
  memberList: Array,
  addMemberLoadingFlag: Boolean,
  modalId: {
    type: String,
    default: "add_member_modal",
  }
});
const {t: $t} = useI18n()
const emit = defineEmits(['resetAddMemberData', 'onSubmitAddMember']);
const resetAddMemberData = () => {
  emit('resetAddMemberData');
};
const onSubmitAddMember = () => {
  emit('onSubmitAddMember');
};
const addMemberSchemaValidation = object(validate(['user']))

</script>

<template>
  <Modal
      @close="resetAddMemberData"
      :title="$t('modal.add-member')"
      :id="modalId"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="addMemberSchemaValidation" @submit="onSubmitAddMember" class=""
            v-if="showAddMemberModalFlag">
        <div class="grid  grid-cols-1 gap-2">
          <!--     for disable autocomplete     -->
          <input type="text" class="hidden"/>
          <!--     for disable autocomplete     -->
          <input type="password" class="hidden"/>

          <VSelect class="flex-grow col-span-2"
                   v-model="newMember.user"
                   name="user"
                   deselect-label=""
                   :is-multiple="false"
                   track-by="name"
                   tracked-by="id"
                   :track-by="'id'"
                   :id="'id'"
                   :has-default-error-message="true"
                   :title="$t('form.user')"
                   label="name"
                   :placeholder="''"
                   :options="memberList"
                   :searchable="false"
                   :allow-empty="false"
                   :is-preselect-first="false"
          >
            <template #singleLabel="props">
              <div class="flex flex-row gap-2">
                <div class="">
                  {{ props.data.option.name }}
                </div>
                <div>
                  ( {{ props.data.option.email }} )
                </div>
              </div>
            </template>
            <template #option="props">
              <div class="flex flex-row gap-2">
                <div class="">
                  {{ props.data.option.name }}
                </div>
                <div>
                  ( {{ props.data.option.email }} )
                </div>
              </div>
            </template>
          </VSelect>
        </div>
        <div class="py-[6px]" v-if="addMemberLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton class="btn-outline btn-primary" size="xs" :onclick="modalId+'.close()'" type="button">
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