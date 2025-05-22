<script setup>

import {ref, watch} from "vue";
import BaseTable from "@/components/table/BaseTable.vue";
import {useI18n} from "vue-i18n";
import API from "@/services/API.js";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import BasePagination from "@/components/table/BasePagination.vue";
import PerPage from "@/components/table/PerPage.vue";
import FilterRoleModal from "./FilterRoleModal.vue";
import AddRoleModal from "./AddRoleModal.vue";
import UpdateRoleModal from "./UpdateRoleModal.vue";
import {scollToTop} from "@/composables/scoll-to-top.js";
import cleaner from "@/composables/clean-object.js";
import {listSetting} from "@/constants/config.js";
import BaseToggleSwitch from "@/components/BaseToggleSwitch.vue";

const {t: $t} = useI18n()
const RoleListProcessing = ref(false)
const RoleProcessing = ref(false)
const fetchError = ref(false)
const currentRoleList = ref([])
const statusList = [
  {'key': 1, 'title': 'Active'},
  {'key': 0, 'title': 'Inactive'}
]
const sectionList = [
  {'key': 'api', 'title': 'Api'},
  {'key': 'admin', 'title': 'Admin'}
]
const currentRole = ref({
  "name": null,
  "title": null,
  "section": null,
  "status": null,
})
const defaultRole = ref({
  "name": null,
  "title": null,
  "section": null,
  "status": null,
})
const newRole = ref({
  "name": null,
  "title": null,
  "section": null,
  "status": null,
})
const tableHeaders = [
  {label: "table.id", key: "id"},
  {label: "table.key", key: "key"},
  {label: "table.resource", key: "resource"},
  {label: "table.section", key: "section"},
  {label: "table.module", key: "module"},
  {label: "table.role", key: "role"},
  {label: "table.status", key: "status"},
  // {label: "table.action", key: "action"}
]
const pageOptions = ref({
  limit: listSetting.limit,
  page: 1,
  count: 0,
  totalPage: 1,
})
const limit = ref(10)
const page = ref(1)
//for handle validation error in filter page list
const filterRoleModalId = "filter_role_modal"
const showFilterRoleModalFlag = ref(false)
const filterRoleLoadingFlag = ref(false)
const filterDataDefault = {
  "resource": "",
  "key": "",
  "module": "",
  "role": "",
  "section": null,
}
const filterData = ref({
  "resource": "",
  "key": "",
  "module": "",
  "role": "",
  "section": null,
})
const filterDataTemp = ref({
  "resource": "",
  "key": "",
  "module": "",
  "role": "",
  "section": null,
})
const addRoleModalId = 'add_role_modal'
const showAddRoleModalFlag = ref(false)
const addRoleLoadingFlag = ref(false)
//for handle validation error in update Role
const updateRoleModalId = 'update_role_modal'
const showUpdateRoleModalFlag = ref(false)
const updateRoleLoadingFlag = ref(false)
const totalPages = ref(1);
const totalCount = ref(0)
const {scrollToTop} = scollToTop()
const handlePageChange = (newPage) => {
  pageOptions.value.page = newPage
  listRoleRequest()
  scrollToTop()
};
const onLimitChange = (newLimit) => {
  pageOptions.value.page = 1
  pageOptions.value.limit = newLimit.value
  listRoleRequest()
  scrollToTop()
};

function setRoleListProcessing(payload) {
  RoleListProcessing.value = payload
  fetchError.value = null
}

function clearFetchError() {
  fetchError.value = null
}

function setFetchError(payload) {
  fetchError.value = payload
  currentRoleList.value = []
  Object.assign(currentRole.value, defaultRole.value);
  RoleProcessing.value = false
  RoleListProcessing.value = false
}

function setRoleList(payload) {
  currentRoleList.value = payload
  RoleListProcessing.value = false
  fetchError.value = null
}

async function listRoleRequest() {
  clearFetchError()
  setRoleListProcessing(true)
  filterData.value.section = filterData.value.section ? filterData.value.section.key : null
  const {data, error} = await API.listRolePermissionRequest({...pageOptions.value,...cleaner(filterData.value)})
  if (data.value) {
    pageOptions.value = data.value.data.paginator
    pageOptions.value.totalPage = Math.ceil(pageOptions.value.count / pageOptions.value.limit)
    Object.assign(filterData.value, filterDataTemp.value)
    setRoleList(data.value.data.list)
    if (showFilterRoleModalFlag.value) {
      const modal = document.getElementById(filterRoleModalId)
      modal.close()
    }
  } else if (error.value) {
    setFetchError(error.value)
  }
  setRoleListProcessing(false)
}

function showAddRoleModal() {
  Object.assign(newRole.value, {})
  Object.assign(currentRole.value, {})
  showAddRoleModalFlag.value = true
  const modal = document.getElementById(addRoleModalId);
  modal.showModal();
}

async function addRole(role) {
  if (role == null) {
    resetAddRoleData();
  }
  ///TODO: kerloper: link to api
  resetAddRoleData();
  removeFilterData()
  await listRoleRequest()
}

function onSubmitAddRole() {
  if (!newRole.value) {
    return
  } else {
    addRoleLoadingFlag.value = true
  }
  Object.assign(currentRole.value, newRole.value);
  currentRole.value.status = currentRole.value.status ? currentRole.value.status.key : 0;
  currentRole.value.section = currentRole.value.section ? currentRole.value.section.key : 'api';
  addRole(currentRole.value);
}

///TODO: kerloper: resolve reset form value after add or cancel in add role form
function resetAddRoleData() {
  showAddRoleModalFlag.value = false
  addRoleLoadingFlag.value = false
  const modal = document.getElementById(addRoleModalId);
  modal.close();
}

///start update Role methods
function showUpdateRoleModal(role) {
  Object.assign(currentRole.value, role)
  currentRole.value.status = statusList.find(status => status.key === role.status)
  currentRole.value.section = sectionList.find(section => section.key === role.section)
  showUpdateRoleModalFlag.value = true
  const modal = document.getElementById(updateRoleModalId);
  modal.showModal();
}

function resetUpdateRoleData() {
  //reset validation error message of update form
  showUpdateRoleModalFlag.value = false
  updateRoleLoadingFlag.value = false
  const modal = document.getElementById(updateRoleModalId)
  modal.close()
}

function onSubmitUpdateRole() {
  if (!currentRole.value) {
    return
  } else {
    updateRoleLoadingFlag.value = true
  }
  updateRole({
    "id": currentRole.value.id,
    "title": currentRole.value.title,
  })
}

async function updateRole(Role) {
  if (Role == null) {
    resetUpdateRoleData()
  }
  ///Todo: kerloper: link to api
  resetUpdateRoleData()
}

///start filter role list
function showFilterRoleModal() {
  Object.assign(filterDataTemp.value, filterData.value)
  showFilterRoleModalFlag.value = true
  const modal = document.getElementById(filterRoleModalId);
  modal.showModal();
}

function resetFilterRoleData() {
  showFilterRoleModalFlag.value = false
  filterRoleLoadingFlag.value = false
  const modal = document.getElementById(filterRoleModalId)
  modal.close()
}

function onSubmitFilterRole() {
  pageOptions.value.page = 1
  Object.assign(filterData.value, filterDataTemp.value)
  filterRoleLoadingFlag.value = true
  listRoleRequest()
}

function removeFilterData() {
  pageOptions.value.page = 1
  Object.assign(filterData.value, filterDataDefault)
  Object.assign(filterDataTemp.value, filterDataDefault)
  filterRoleLoadingFlag.value = true
  listRoleRequest()
}

function resetDeleteRole() {
  const modal = document.getElementById('confirmation_delete_role');
  modal.close();
}

//reset form data of add role
watch(showAddRoleModalFlag, () => {
  Object.assign(newRole.value, defaultRole.value)
})

listRoleRequest()

</script>

<template>
  <div>

    <!--  modal of filter page list  -->
    <FilterRoleModal
        :modalId="filterRoleModalId"
        :showFilterRoleModalFlag="showFilterRoleModalFlag"
        :filterDataTemp="filterDataTemp"
        :sectionList="sectionList"
        :filterRoleLoadingFlag="filterRoleLoadingFlag"
        @resetFilterRoleData="resetFilterRoleData"
        @onSubmitFilterRole="onSubmitFilterRole"
        @removeFilterData="removeFilterData"
    />
    <!--  modal of add role  -->
    <AddRoleModal
        :modalId="addRoleModalId"
        :showAddRoleModalFlag="showAddRoleModalFlag"
        :newRole="newRole"
        :sectionList="sectionList"
        :statusList="statusList"
        :addRoleLoadingFlag="addRoleLoadingFlag"
        @resetAddRoleData="resetAddRoleData"
        @onSubmitAddRole="onSubmitAddRole"
    />
    <!--  modal of update role  -->

    <UpdateRoleModal
        :modalId="updateRoleModalId"
        :currentRole="currentRole"
        :statusList="statusList"
        :sectionList="sectionList"
        :showUpdateRoleModalFlag="showUpdateRoleModalFlag"
        :updateRoleLoadingFlag="updateRoleLoadingFlag"
        @onSubmitUpdateRole="onSubmitUpdateRole"
        @close="resetUpdateRoleData"
    />

    <!--  modal of delete confirmation  -->
    <ConfirmationModal
        :accept="resetDeleteRole"
        :deny="resetDeleteRole"
        id="confirmation_delete_role"
    >
      {{ $t('message.delete-page-confirmation') }} ?
    </ConfirmationModal>

    <BaseCard>
      <div class="flex justify-between border-b-2 pb-2">
        <div>
          <PerPage
              class="w-64"
              :totalCount="pageOptions.count"
              :currentPage="pageOptions.page"
              :totalPages="pageOptions.totalPage"
              @limit-change="onLimitChange"
          />
        </div>
        <div class="flex gap-2">
<!--          <BaseButton class="btn-primary text-white" size="xs" :onclick="showAddRoleModal">-->
<!--            <div class="flex">-->
<!--              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"-->
<!--                   stroke="currentColor" class="size-5">-->
<!--                <path stroke-linecap="round" stroke-linejoin="round"-->
<!--                      d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"/>-->
<!--              </svg>-->
<!--              <span class="p-1">-->
<!--                {{ $t("button.add-role") }}-->
<!--              </span>-->
<!--            </div>-->
<!--          </BaseButton>-->
          <BaseButton class="btn-secondary text-white" size="xs" @click="showFilterRoleModal">
            <div class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"/>
              </svg>
              <span class="p-1">
                {{ $t("button.filter") }}
              </span>
            </div>
          </BaseButton>
        </div>
      </div>
      <div class="min-card-height-table">
        <BaseTable
            :is-loading="RoleListProcessing"
            :data="currentRoleList"
            :headers="tableHeaders"
        >
          <template v-slot:cell(status)="{data,index}">
            <BaseToggleSwitch
                :toggleActive="true"
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
                  class="btn-error tooltip text-white"
                  onclick="confirmation_delete_role.show()"
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
      <template v-slot:actions>
        <BasePagination
            class="w-full md:max-w-[100%] lg:max-w-[100%] py-6"
            :currentPage="pageOptions.page"
            :totalPages="pageOptions.totalPage"
            @page-change="handlePageChange"
        />
      </template>
    </BaseCard>
  </div>
</template>

<style scoped>

</style>