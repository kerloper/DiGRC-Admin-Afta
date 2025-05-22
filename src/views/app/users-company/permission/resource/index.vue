<script setup>

import {computed, ref, shallowRef, watch} from "vue";
import BaseTable from "@/components/table/BaseTable.vue";
import {useI18n} from "vue-i18n";
import API from "@/services/API.js";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import Modal from "@/components/Modal.vue";
import BasePagination from "@/components/table/BasePagination.vue";
import PerPage from "@/components/table/PerPage.vue";
import FilterResourceModal from "./FilterResourceModal.vue";
import AddResourceModal from "./AddResourceModal.vue";
import {scollToTop} from "@/composables/scoll-to-top.js";
import cleaner from "@/composables/clean-object.js";
import {listSetting} from "@/constants/config.js";
import BaseToggleSwitch from "@/components/BaseToggleSwitch.vue";
import VSelect from "@/components/VSelect.vue";
import TextInput from "@/components/TextInput.vue";

const {t: $t} = useI18n()
const resourceListProcessing = shallowRef(false)
const resourceProcessing = shallowRef(false)
const fetchError = shallowRef(false)
const currentResourceList = ref([])
const addResourceModalId = 'add_resource_modal'
const sectionList = [
  {'key': 'api', 'title': 'Api'},
  {'key': 'admin', 'title': 'Admin'}
]
const statusList = [
  {'key': 1, 'title': 'Active'},
  {'key': 0, 'title': 'Inactive'}
]
const currentResource = ref({
  "key": null,
  "title": null,
  "status": null,
  "section": null,
  "module": null,
  "type": null,
})
const defaultResource = ref({
  "key": null,
  "title": null,
  "status": null,
  "section": null,
  "module": null,
  "type": null,
})
const newResource = ref({
  "key": null,
  "title": null,
  "status": null,
  "section": null,
  "module": null,
  "type": null,
})
const rolesTableHeaders = [
  {
    label: "table.key",
    key: "key",
  },
  {
    label: "table.section",
    key: "section",
  },
  {
    label: "table.role",
    key: "role",
  },
]
const tableHeaders = [
  {
    label: "table.id",
    key: "id",
  },
  {
    label: "table.title",
    key: "title",
  },
  {
    label: "table.key",
    key: "key",
  },
  {
    label: "table.section",
    key: "section",
  },
  {
    label: "table.module",
    key: "module",
  },
  {
    label: "table.type",
    key: "type",
  },
  {
    label: "table.status",
    key: "status",
  },
  {
    label: "table.action",
    key: "action",
  },
]
//for handle show role resource list
const showRoleResourceModalFlag = shallowRef(false)
const roleResourceLoadingFlag = shallowRef(false)
const addRoleLoadingFlag = shallowRef(false)
const roleList = ref([])
//for handle validation error in filter resource list
const showFilterResourceModalFlag = shallowRef(false)
const filterResourceLoadingFlag = shallowRef(false)
const filterResourceModalId = 'filter_resource_modal'
const filterDataDefault = {
  "title": null,
  "key": null,
  "module": null,
  "section": null,
}
const filterData = ref({
  "title": null,
  "key": null,
  "module": null,
  "section": null,
})
const filterDataTemp = ref({
  "title": null,
  "key": null,
  "module": null,
  "section": null,
})
const showAddResourceModalFlag = shallowRef(false)
const addResourceLoadingFlag = shallowRef(false)
const showAddRoleModalFlag = shallowRef(false)
const pageOptions = ref({
  limit: listSetting.limit,
  page: 1,
  count: 0,
  totalPage: 1,
})
const {scrollToTop} = scollToTop()
const handlePageChange = (newPage) => {
  pageOptions.value.page = newPage
  listResourceRequest()
  scrollToTop()
};
const onLimitChange = (newLimit) => {
  pageOptions.value.page = 1
  pageOptions.value.limit = newLimit.value
  listResourceRequest()
  scrollToTop()
};

const {data: rolesList} = API.roleList()
const allRoleList = computed(() => rolesList?.value?.data?.list || [])
const selectedRole = ref(null)
const selectiveRoleList = ref([])

function setResourceListProcessing(payload) {
  resourceListProcessing.value = payload
  fetchError.value = null
}

function clearFetchError() {
  fetchError.value = null
}

function setFetchError(payload) {
  fetchError.value = payload
  currentResourceList.value = []
  Object.assign(currentResource.value, defaultResource.value);
  resourceProcessing.value = false
  resourceListProcessing.value = false
}

function setResourceList(payload) {
  currentResourceList.value = payload
  resourceListProcessing.value = false
  fetchError.value = null
}

async function listResourceRequest() {
  clearFetchError()
  setResourceListProcessing(true)
  filterData.value.section = filterData.value.section ? filterData.value.section.key : null

  const {data, error} = await API.listResourcePermissionRequest({...pageOptions.value, ...cleaner(filterData.value)})
  if (data.value) {
    pageOptions.value = data.value.data.paginator
    pageOptions.value.totalPage = Math.ceil(pageOptions.value.count / pageOptions.value.limit)
    setResourceList(data.value.data.list)
    if (showFilterResourceModalFlag.value) {
      const modal = document.getElementById(filterResourceModalId)
      modal.close()
    }
  } else if (error.value) {
    setFetchError(error.value)
  }
  setResourceListProcessing(false)
  filterResourceLoadingFlag.value = false
}

function showAddResourceModal() {
  showAddResourceModalFlag.value = true
  const modal = document.getElementById(addResourceModalId);
  modal.showModal();
}

async function addResource(resource) {
  if (resource == null) {
    resetAddResourceData();
  }
  ///TODO: kerloper: link to api
  setResourceListProcessing(true)
  resetAddResourceData();
  removeFilterData()
  await listResourceRequest();
}

function onSubmitAddResource() {
  if (!newResource.value) {
    return
  } else {
    addResourceLoadingFlag.value = true
  }
  Object.assign(currentResource.value, newResource.value);
  currentResource.value.status = currentResource.value.status ? currentResource.value.status.key : 0;
  currentResource.value.section = currentResource.value.section ? currentResource.value.section.key : 'api';
  addResource(currentResource.value);
}

function resetAddResourceData() {
  //reset validation error message of form
  showAddResourceModalFlag.value = false
  addResourceLoadingFlag.value = false
  const modal = document.getElementById(addResourceModalId);
  modal.close();
}

///start filter resources list
function showFilterResourceModal() {
  showFilterResourceModalFlag.value = true
  const modal = document.getElementById(filterResourceModalId);
  modal.showModal();
}

function resetFilterResourceData() {
  showFilterResourceModalFlag.value = false
  filterResourceLoadingFlag.value = false
  const modal = document.getElementById(filterResourceModalId)
  modal.close()
}

function onSubmitFilterResource() {
  pageOptions.value.page = 1
  Object.assign(filterData.value, filterDataTemp.value)
  filterResourceLoadingFlag.value = true
  listResourceRequest()
}

function removeFilterData() {
  pageOptions.value.page = 1
  Object.assign(filterData.value, filterDataDefault)
  Object.assign(filterDataTemp.value, filterDataDefault)
  filterResourceLoadingFlag.value = true
  listResourceRequest()
}

///start filter resources list
function showRoleResourceModal(resource = null) {
  if (resource) {
    Object.assign(currentResource.value, resource)
  }
  roleList.value = []
  showRoleResourceModalFlag.value = true
  roleResourceLoadingFlag.value = true
  const modal = document.getElementById('role_resource_modal');
  modal.showModal();
  listRoleRequest();
}

function resetRoleResourceData() {
  showRoleResourceModalFlag.value = false
  roleResourceLoadingFlag.value = false
  const modal = document.getElementById('role_resource_modal')
  modal.close()
  roleList.value = []
}

//section of get role list of a resource
async function listRoleRequest() {
  let request = {
    "limit": 100,
    "page": 1,
    "resource": currentResource.value.key,
  }
  const {data, error} = await API.listRolePermissionRequest(request)
  if (data.value) {
    roleList.value = data.value.data.list
    roleResourceLoadingFlag.value = false
    selectiveRoleList.value = allRoleList.value.filter((item) => roleList.value.map(role => role.key).indexOf(`${item.name}-${currentResource.value.key}`) === -1)

  } else if (error.value) {
    resetRoleResourceData()
  }
}

function showAddRoleModal() {
  const modal = document.getElementById('add_role_modal');
  modal.showModal();
}

async function submitAddRole() {
  addRoleLoadingFlag.value = true
  const role = {...selectedRole.value}
  const resource = {...currentResource.value}
  let requestParams = {
    key: `${role.name}-${resource.key}`,
    resource: resource.key,
    module: resource.module,
    role: role.name,
    section: resource.section,
    status: 1,
  }

  try {
    const {data} = await API.addPermissionResourceRole(requestParams)
    if (data.value) {
      resetAddRole()
    }
  } catch (error) {
  } finally {
    addRoleLoadingFlag.value = false
  }
}

function resetAddRole() {
  showAddRoleModalFlag.value = false
  addRoleLoadingFlag.value = false
  const modal = document.getElementById('add_role_modal')
  modal.close()
  showRoleResourceModal()
  roleList.value = []
}

//reset form data of add resource
watch(showAddResourceModalFlag, () => {
  Object.assign(newResource.value, defaultResource.value)
})

listResourceRequest()


</script>

<template>
  <div>
    <!--  modal of filter resource list  -->
    <FilterResourceModal
        :modalId="filterResourceModalId"
        :showFilterResourceModalFlag="showFilterResourceModalFlag"
        :filterDataTemp="filterDataTemp"
        :sectionList="sectionList"
        :filterResourceLoadingFlag="filterResourceLoadingFlag"
        @resetFilterResourceData="resetFilterResourceData"
        @onSubmitFilterResource="onSubmitFilterResource"
        @removeFilterData="removeFilterData"
    />

    <!--  modal of add resource  -->
    <AddResourceModal
        :modalId="addResourceModalId"
        :showAddResourceModalFlag="showAddResourceModalFlag"
        :newResource="newResource"
        :sectionList="sectionList"
        :statusList="statusList"
        :addResourceLoadingFlag="addResourceLoadingFlag"
        @resetAddResourceData="resetAddResourceData"
        @onSubmitAddResource="onSubmitAddResource"
    />
    <!--  modal of show role resource  -->
    <Modal
        @close="resetRoleResourceData"
        :title="currentResource?currentResource.title:$t('modal.role-list')"
        id="role_resource_modal"
        :custom-style="'max-w-2xl'"
        :close-btn="false"
        :close-backdrop="true"
        :close-icon="true"
    >
      <div>
        <div class="min-h-48  max-h-[70vh] overflow-auto pe-2 relative">
          <div class="flex flex-wrap gap-2" v-if="!showAddResourceModalFlag">
            <BaseTable class="w-full" :data="roleList" :headers="rolesTableHeaders">
            </BaseTable>
          </div>
          <div class="absolute bottom-0 w-full" v-if="roleResourceLoadingFlag">
            <progress class="progress w-full progress-primary"></progress>
          </div>
        </div>
        <div class="flex justify-end mt-3 gap-2">
          <BaseButton class="btn-outline btn-primary text-white" size="xs" onclick="role_resource_modal.close()"
                      type="button">
            {{ $t('button.close') }}
          </BaseButton>
          <BaseButton class="btn-primary text-white" size="xs" @click="showAddRoleModal"
                      type="button">
            {{ $t('button.add-role') }}
          </BaseButton>
        </div>
      </div>
    </Modal>

    <!--  modal of add role  -->
    <Modal
        @close="resetAddRole"
        :title="$t('modal.add-role')"
        id="add_role_modal"
        :custom-style="'max-w-2xl'"
        :close-btn="false"
        :close-backdrop="true"
        :close-icon="true"
    >
      <div>
        <div class="   pe-2 relative">
          <div class="grid grid-cols-2 gap-2">

            <VSelect v-model="selectedRole"
                     name="role"
                     :title="$t('form.role')"
                     :has-default-error-message="true"
                     class="col-span-1"
                     deselect-label=""
                     :allow-empty="false"
                     :is-multiple="false"
                     label="title"
                     tracked-by="id"
                     :options="selectiveRoleList"
                     :searchable="true"
            />
            <TextInput class="flex-grow"
                       :label="$t('form.resource')"
                       name="resource"
                       :is-disabled="true"
                       :has-default-error-message="true"
                       v-model="currentResource.title"/>

            <TextInput class="flex-grow"
                       :label="$t('form.module')"
                       name="module"
                       :is-disabled="true"
                       :has-default-error-message="true"
                       v-model="currentResource.module"/>
            <TextInput class="flex-grow"
                       :label="$t('form.section')"
                       name="section"
                       :is-disabled="true"
                       :has-default-error-message="true"
                       v-model="currentResource.section"/>
          </div>
        </div>
        <div class="pt-4 w-full" v-if="addRoleLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton class="btn-outline btn-primary text-white" size="xs" onclick="add_role_modal.close()"
                      type="button">
            {{ $t('button.close') }}
          </BaseButton>
          <BaseButton class="btn-primary text-white" :disabled="!selectedRole" size="xs" @click="submitAddRole"
                      type="button">
            {{ $t('button.submit') }}
          </BaseButton>
        </div>
      </div>
    </Modal>

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
          <!--          <BaseButton class="btn-primary text-white" size="xs" :onclick="showAddResourceModal">-->
          <!--            <div class="flex">-->
          <!--              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"-->
          <!--                   stroke="currentColor" class="size-5">-->
          <!--                <path stroke-linecap="round" stroke-linejoin="round"-->
          <!--                      d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"/>-->
          <!--              </svg>-->
          <!--              <span class="p-1">-->
          <!--                {{ $t("button.add-resource") }}-->
          <!--              </span>-->
          <!--            </div>-->
          <!--          </BaseButton>-->
          <BaseButton class="btn-secondary text-white" size="xs" @click="showFilterResourceModal">
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
            :is-loading="resourceListProcessing"
            :data="currentResourceList"
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
                  @click="showRoleResourceModal(data.item)"
                  class="bg-gray-600 hover:bg-gray-800 text-white tooltip"
                  :data-tip="$t('tooltip.view-roles')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
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