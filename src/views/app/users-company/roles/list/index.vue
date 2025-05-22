<script setup>
///KERLOPER:UPDATE 2025MAY15

import {computed, ref} from "vue";
import BaseTable from "@/components/table/BaseTable.vue";
import {useI18n} from "vue-i18n";
import API from "@/services/API.js";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import AddRoleModal from "./AddRoleModal.vue";
import BaseToggleSwitch from "@/components/BaseToggleSwitch.vue";

const {t: $t} = useI18n()
const addRoleModalId = 'add_role_modal'

const currentRole = ref({
  "name": null,
  "title": null,
  "section": null,
  "status": null,
})
const defaultRole = {
  "name": null,
  "title": null,
  "section": null,
  "status": null,
}
const tableHeaders = [
  {label: "table.id", key: "id",},
  {label: "table.title", key: "title",},
  {label: "table.name", key: "name",},
  {label: "table.section", key: "section",},
  {label: "table.status", key: "status",},
  {label: "table.action", key: "action",},
]
//for handle validation error in add role
const showAddRoleModalFlag = ref(false)

const {data: roles, isFetching: roleListProcessing, execute} = API.roleList()
const currentRoleList = computed(() => roles?.value?.data?.list || [])

const {data: permissions, isFetching: permissionListProcess, execute:permissionExecute} = API.listResourcePermissionRequest({limit:1000})
const permissionList = computed(() => permissions?.value?.data?.list || [])

function showAddRoleModal() {
  showAddRoleModalFlag.value = true
  currentRole.value = undefined
  showModalById('add_role_modal')
}


function cancelUpdateStatusRole() {
  Object.assign(currentRole.value, defaultRole);
}

function updateStatusRole() {
  currentRole.value.status = 1 - currentRole.value.status
  updateStatusRoleRequest(currentRole.value);
}

async function updateStatusRoleRequest(role) {
  if (role == null) {
    cancelUpdateStatusRole();
  }
  const {data, error} = await API.updateRole({
    "name": role.name,
    "status": role.status
  })
  if (data.value) {
    execute()
  } else if (error.value) {
  }
}

function confirmDeleteRole(role) {
  Object.assign(currentRole.value, role)
  const modal = document.getElementById('confirmation_delete_role');
  modal.showModal();
}

function cancelDeleteRole() {
  Object.assign(currentRole.value, defaultRole);
}

function deleteRole() {
  deleteRoleRequest(currentRole.value);
}

async function deleteRoleRequest(role) {
  if (role == null) {
    cancelDeleteRole();
  }
  const {data, error} = await API.deleteRole({name: role.name})
  if (data.value) {
    execute()
  } else if (error.value) {
  }
}


///start update role methods
function showUpdateRoleModal(role) {
  currentRole.value = {...role}
  showModalById(addRoleModalId)
}

function showModalById(modalId) {
  document.getElementById(modalId).showModal()
}

function closeModalById(modalId) {
  document.getElementById(modalId).close()
}

function closeRoleModal() {
  closeModalById(addRoleModalId)
}

</script>

<template>
  <div>

    <AddRoleModal
        :role="currentRole"
        :permission-list="permissionList"
        :modalId="addRoleModalId"
        :currentRole="currentRole"
        @refresh="execute"
        @close="closeRoleModal"
    />

    <!--  modal of update status confirmation  -->
    <ConfirmationModal
        :accept="updateStatusRole"
        :deny="cancelUpdateStatusRole"
        id="confirmation_update_status_role"
    >
      {{ $t('message.update-role-confirmation') }} {{ currentRole ? currentRole.title : '' }}?
    </ConfirmationModal>

    <!--  modal of delete confirmation  -->
    <ConfirmationModal
        :accept="deleteRole"
        :deny="cancelDeleteRole"
        id="confirmation_delete_role"
    >
      {{ $t('message.delete-role-confirmation') }}
    </ConfirmationModal>

    <BaseCard>
      <div class="flex justify-between border-b-2 pb-2">
        <div></div>
        <div class="flex gap-2">
          <BaseButton class="btn-primary text-white" size="xs" :onclick="showAddRoleModal">
            <div class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"/>
              </svg>
              <span class="p-1">
                {{ $t("button.add-role") }}
              </span>
            </div>
          </BaseButton>
        </div>
      </div>
      <div class="min-card-height-table">

        <BaseTable
            :is-loading="roleListProcessing"
            :data="currentRoleList"
            :headers="tableHeaders"
        >
          <template v-slot:cell(status)="{data,index}">
            <BaseToggleSwitch
                :toggleActive="data.item.status===1"
            />
          </template>
          <template v-slot:cell(action)="{data,index}">
            <div class="flex gap-2">
              <BaseButton
                  size="xs"
                  @click="showUpdateRoleModal(data.item)"
                  class="btn-primary tooltip text-white"
                  :data-tip="$t('tooltip.edit')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                </svg>
              </BaseButton>
              <BaseButton
                  size="xs"
                  @click="confirmDeleteRole(data.item)"
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
          </template>
        </BaseTable>

      </div>
    </BaseCard>
  </div>
</template>

<style scoped>

</style>