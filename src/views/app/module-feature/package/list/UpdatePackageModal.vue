<script setup>
import { defineProps, defineEmits } from 'vue';
import Modal from "@/components/Modal.vue";
import {Form} from "vee-validate";
import TextInput from "@/components/TextInput.vue";
import VSelect from "@/components/VSelect.vue";
import BaseButton from "@/components/BaseButton.vue";
import {object} from "yup";
import {useI18n} from "vue-i18n";
import validate from "@/composables/validate.js";
import SelectableTable from "@/components/table/SelectableTable.vue";

const {t: $t} = useI18n()
const props = defineProps({
  currentPackageCompany: Object,
  statusList: Array,
  expireList: Array,
  typeList: Array,
  resourceList: Array,
  showUpdatePackageCompanyModalFlag: Boolean,
  updatePackageCompanySchemaValidation: Object,
  updatePackageCompanyLoadingFlag: Boolean,
  modalId:{
    type: String,
    default: "update_package_company_modal",
  }
});

const emit = defineEmits(['close','onSubmitUpdatePackageCompany']);

const resetUpdatePackageCompanyData = () => {
  emit('close');
};

const onSubmitUpdatePackageCompany = () => {
  emit('onSubmitUpdatePackageCompany');
};
//for handle validation error in update package company
const updatePackageCompanySchemaValidation = object(
    validate(['title'])
);
</script>

<template>
  <Modal
      @close="resetUpdatePackageCompanyData"
      :title="currentPackageCompany ? currentPackageCompany.title ? currentPackageCompany.title : $t('modal.update-package') : $t('modal.update-package')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="updatePackageCompanySchemaValidation" @submit="onSubmitUpdatePackageCompany" class=""
            v-if="showUpdatePackageCompanyModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <TextInput class="flex-grow"
                     :label="$t('form.title')"
                     name="title"
                     :has-default-error-message="true"
                     v-model="currentPackageCompany.title"/>
          <VSelect v-model="currentPackageCompany.status"
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
          <VSelect v-model="currentPackageCompany.expire"
                   name="expire"
                   deselect-label=""
                   :is-multiple="false"
                   track-by="key"
                   :title="$t('form.expire')"
                   label="title"
                   :placeholder="$t('form.select-expire-placeholder')"
                   :options="expireList"
                   :searchable="false"
                   :allow-empty="false"
                   :is-preselect-first="true"
          />
          <VSelect v-model="currentPackageCompany.type"
                   name="type"
                   deselect-label=""
                   :is-multiple="false"
                   track-by="key"
                   :title="$t('form.type')"
                   label="title"
                   :placeholder="$t('form.select-type-placeholder')"
                   :options="typeList"
                   :searchable="false"
                   :allow-empty="false"
                   :is-preselect-first="true"
          />

          <SelectableTable
              v-if="currentPackageCompany.type?currentPackageCompany.type.key==='limited':false"
              :data="resourceList"
              v-model="currentPackageCompany.access"
              uniqueKey="key"
              :title="$t('form.access')"
              class="col-span-2"
              :headers="['#', $t('table.title') , $t('table.section'),$t('table.module'),$t('table.type')]"
              :keys="['id', 'title', 'section','module','type']"
          />
        </div>
        <div class="py-[6px]" v-if="updatePackageCompanyLoadingFlag">
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