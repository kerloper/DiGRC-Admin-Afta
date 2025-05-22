<script setup>
///KERLOPER:UPDATE 2025MAY15

import Modal from "@/components/Modal.vue";
import TextInput from "@/components/TextInput.vue";
import {object} from "yup";
import VSelect from "@/components/VSelect.vue";
import BaseButton from "@/components/BaseButton.vue";
import {useI18n} from "vue-i18n";
import {Form} from "vee-validate";
import {computed, ref, shallowRef, watch} from "vue";
import {useValidation} from "@/composables/validation.js";
import API from "@/services/API.js";
import CollapsibleGrid from "@/components/CollapsibleGrid.vue";

const props = defineProps({
  role: undefined,
  permissionList: {
    type: Array,
    default: []
  },
  modalId: {
    type: String,
    default: "add_role_modal",
  }
});
const statusList = [
  {key: 1, title: 'Active'},
  {key: 0, title: 'Inactive'}
]
const sectionList = [
  {key: 'api', title: 'Api'},
  {key: 'admin', title: 'Admin'}
]
const isAddMode = shallowRef(true)
const {t: $t} = useI18n()
const emit = defineEmits(['close', 'refresh']);
const close = () => {
  emit('close');
  isLoading.value = false
  document.getElementById('add_role_form').reset()
  resetData()
};
const isLoading = shallowRef(false)
const id = shallowRef(null)
const name = shallowRef('')
const section = shallowRef('')
const title = shallowRef('')
const status = shallowRef('')

const {titleValidation, lowerCase} = useValidation()
const addRoleSchemaValidation = object({
  name: lowerCase,
  title: titleValidation,
});

const onSubmitAddRole = async () => {

  isLoading.value = true
  const payload = {
    name: name.value,
    title: title.value,
    status: status.value ? status.value.key : 0,
    section: section.value ? section.value.key : 0,
    permissions: permissions.value.map(item => item.key)
  }

  try {
    if (isAddMode.value) {
      const {data, error} = await API.addRole(payload)
      if (data.value) {
        close()
        emit('refresh');
      } else if (error.value) {
        isLoading.value = false
      }
    } else {
      payload.id = props.role.id
      const {data, error} = await API.updateRole(payload)
      if (data.value) {
        close()
        emit('refresh');
      } else if (error.value) {
        isLoading.value = false
      }
    }
  } catch (e) {
    close()
  } finally {
    isLoading.value = false
  }
};

function resetData() {
  id.value = null
  name.value = ''
  section.value = ''
  title.value = ''
  status.value = ''
  permissions.value = []
}

watch(() => props.role, async () => {
  if (props.role === undefined) {
    isAddMode.value = true
    resetData()
  } else {
    isAddMode.value = false
    id.value = props.role?.id
    name.value = props.role?.name
    title.value = props.role?.title
    status.value = statusList.find((item) => item.key === props.role?.status)
    section.value = sectionList.find((item) => item.key === props.role?.section)
    const {data: rolePermissions} = await API.listRolePermissionRequest({limit: 1000, role: props.role?.name})
    const init = (rolePermissions?.value?.data?.list?.map(item => item.resource))
    console.log(props.permissionList)
    permissions.value = props.permissionList.filter((per) => init.includes(per.key))

  }
}, {deep: true})

const permissions = ref([])
const modalTitle = computed(() => isAddMode.value ? $t('modal.add-role') : $t('modal.update-role'))

const handleSelectionChange = (selected) => {
  permissions.value = selected;
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
    <div class="max-h-[80vh] overflow-y-auto overflow-x-hidden">

      <Form :validation-schema="addRoleSchemaValidation" @submit="onSubmitAddRole" class="grid grid-cols-1 gap-2"
            id="add_role_form">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <TextInput class="flex-grow"
                     :label="$t('form.name')"
                     name="name"
                     v-model="name"/>
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
          <VSelect v-model="status"
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
        </div>
        <fieldset class="fieldset border p-4   rounded-xl">
          <legend class="fieldset-legend text-sm">
            {{ $t("general.access") }}
          </legend>
          <CollapsibleGrid
              v-model="permissions"
              :group-options="[{ label: $t('general.group-by-module'), value: 'module' }, { label: $t('general.group-by-section'), value: 'section' }]"
              :items="permissionList"
              item-display-field="title"
              groupBy="module"
              @selection-changed="handleSelectionChange"
          />
        </fieldset>
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