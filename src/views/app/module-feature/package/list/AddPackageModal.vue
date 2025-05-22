<script setup>
import Modal from "@/components/Modal.vue";
import TextInput from "@/components/TextInput.vue";
import {object} from "yup";
import VSelect from "@/components/VSelect.vue";
import BaseButton from "@/components/BaseButton.vue";
import {useI18n} from "vue-i18n";
import {Form} from "vee-validate";
import validate from "@/composables/validate.js";
import SelectableTable from "@/components/table/SelectableTable.vue";

const props = defineProps({
  showAddPackageCompanyModalFlag: Boolean,
  newPackageCompany: Object,
  statusList: Array,
  expireList: Array,
  typeList: Array,
  resourceList: Array,
  addPackageCompanyLoadingFlag: Boolean,
  modalId:{
    type: String,
    default: "add_package_company_modal",
  }
});
const {t: $t} = useI18n()
const emit = defineEmits(['resetAddPackageCompanyData', 'onSubmitAddPackageCompany']);
const resetAddPackageCompanyData = () => {
  emit('resetAddPackageCompanyData');
};
const onSubmitAddPackageCompany = () => {
  emit('onSubmitAddPackageCompany');
};

//for handle validation error in add packageCompany
const addPackageCompanySchemaValidation = object(
    validate(['title'])
);
</script>

<template>
  <Modal
      @close="resetAddPackageCompanyData"
      :title="$t('modal.add-package')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="addPackageCompanySchemaValidation" @submit="onSubmitAddPackageCompany" class=""
            v-if="showAddPackageCompanyModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <TextInput class="flex-grow"
                     :label="$t('form.title')"
                     name="title"
                     :has-default-error-message="true"
                     v-model="newPackageCompany.title"/>
          <VSelect v-model="newPackageCompany.status"
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
          <VSelect v-model="newPackageCompany.expire"
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
          <VSelect v-model="newPackageCompany.type"
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
              v-if="newPackageCompany.type?newPackageCompany.type.key==='limited':false"
              :data="resourceList"
              v-model="newPackageCompany.access"
              uniqueKey="key"
              :title="$t('form.access')"
              class="col-span-2"
              :headers="['#', $t('table.title') , $t('table.section'),$t('table.module'),$t('table.type')]"
              :keys="['id', 'title', 'section','module','type']"
          />
        </div>
        <div class="py-[6px]" v-if="addPackageCompanyLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton class="btn-outline btn-primary text-white" size="xs" :onclick="modalId+'.close()'"
                      type="button">
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