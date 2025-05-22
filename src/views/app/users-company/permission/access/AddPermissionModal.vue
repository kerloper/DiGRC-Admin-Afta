<script setup>
///KERLOPER:UPDATE 2025MAY15

import Modal from "@/components/Modal.vue";
import TextInput from "@/components/TextInput.vue";
import {object} from "yup";
import VSelect from "@/components/VSelect.vue";
import BaseButton from "@/components/BaseButton.vue";
import {useI18n} from "vue-i18n";
import {Form} from "vee-validate";
import {ref, shallowRef} from "vue";
import {useValidation} from "@/composables/validation.js";
import API from "@/services/API.js";
import CollapsibleGrid from "@/components/CollapsibleGrid.vue";

const props = defineProps({
  roleList: {
    type: Array,
    default: []
  },
  moduleList: {
    type: Array,
    default: []
  },
  modalId: {
    type: String,
    default: "add_permission_modal",
  }
});
const sectionList = [
  {key: 'api', title: 'Api'},
  {key: 'admin', title: 'Admin'}
]
const {t: $t} = useI18n()
const emit = defineEmits(['close', 'refresh']);
const close = () => {
  emit('close');
  isLoading.value = false
  document.getElementById('add_permission_form').reset()
  resetData()
};
const isLoading = shallowRef(false)
const id = shallowRef(null)
const key = shallowRef('')
const section = shallowRef({key: 'api', title: 'Api'})
const module = shallowRef('')
const handler = shallowRef('')
const packageName = shallowRef('')
const title = shallowRef('')

const {titleValidation, generalTextValidation, generalSlugValidation} = useValidation()
const addRoleSchemaValidation = object({
  key: generalSlugValidation,
  title: titleValidation,
  // handler: generalTextValidation,
  // package: generalTextValidation,
  module: generalTextValidation,
});

const onSubmitAddRole = async () => {

  isLoading.value = true
  const payload = {
    key: key.value,
    title: title.value,
    module: module.value,
    section: section.value.key,
    handler: handler.value,
    package: packageName.value,
    roles: roles.value.map(item => item.name)
  }
  try {
    const {data, error} = await API.addResourcePermission(payload)
    if (data.value) {
      close()
      emit('refresh');
    } else if (error.value) {
      isLoading.value = false
    }
  } catch (e) {
    close()
  } finally {
    isLoading.value = false
  }
};

function resetData() {
  id.value = null
  key.value = ''
  section.value = {key: 'api', title: 'Api'}
  title.value = ''
  module.value = ''
  packageName.value = ''
  handler.value = ''
  roles.value = []
}

const roles = ref([])
const modalTitle = $t('modal.add-permission')
const handleSelectionChange = (selected) => {
  roles.value = selected;
}


</script>

<template>
  <Modal
      @close="close"
      :title="modalTitle"
      :id="modalId"
      :custom-style="'max-w-5xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div class=" ">

      <Form :validation-schema="addRoleSchemaValidation" @submit="onSubmitAddRole" class="grid grid-cols-1 gap-2"
            id="add_permission_form">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <TextInput class="flex-grow"
                     :label="$t('form.key')"
                     name="key"
                     v-model="key"/>
          <TextInput class="flex-grow"
                     :label="$t('form.title')"
                     name="title"
                     v-model="title"/>
          <VSelect v-model="section"
                   name="section"
                   deselect-label=""
                   :is-multiple="false"
                   track-by="key"
                   :title="$t('form.section')"
                   label="title"
                   :placeholder="$t('form.select-section-placeholder')"
                   :options="sectionList"
                   :searchable="false"
                   :allow-empty="false"
                   :is-preselect-first="true"
          />
          <VSelect v-model="module"
                   name="module"
                   title="module"
                   :title="$t('form.module')"
                   :options="moduleList"
          />
          <TextInput class="flex-grow"
                     :label="$t('form.package')"
                     name="package"
                     v-model="packageName"/>
          <TextInput class="flex-grow"
                     :label="$t('form.handler')"
                     name="handler"
                     v-model="handler"/>
        </div>
        <div class=" ">
          <label class="fieldset-legend text-sm ps-1">
            {{ $t("general.access") }}
          </label>
          <CollapsibleGrid
              v-model="roles"
              :items="roleList"
              item-display-field="title"
              groupBy="section"
              custom-class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 gap-2"
              initial-group-by="section"
              :has-search="false"
              @selection-changed="handleSelectionChange"
          />
        </div>
        <div class="py-[6px]" v-if="isLoading">
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