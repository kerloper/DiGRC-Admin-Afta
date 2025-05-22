<script setup>

import {computed, ref, watch} from "vue";
import BaseTable from "@/components/table/BaseTable.vue";
import {useI18n} from "vue-i18n";
import {useLocaleStore} from "@/stores/locale.js";
import API from "@/services/API.js";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import Modal from "@/components/Modal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import AddPackageModal from "./AddPackageModal.vue";
import UpdatePackageModal from "./UpdatePackageModal.vue";
import BaseToggleSwitch from "@/components/BaseToggleSwitch.vue";

const {t: $t} = useI18n()
const packageCompanyListProcessing = ref(false)
const packageCompanyProcessing = ref(false)
const fetchError = ref(false)
const currentPackageCompanyList = ref([])
const typeList = [
  {'key': 'full', 'title': 'Full'},
  {'key': 'limited', 'title': 'Limited'}
]
const expireList = [
  {'key': '+2 weeks', 'title': '+2 Weeks'},
  {'key': '+4 weeks', 'title': '+4 Weeks'},
  {'key': '+2 months', 'title': '+2 Months'},
  {'key': '+4 months', 'title': '+4 Months'},
]
const statusList = [
  {'key': 1, 'title': 'Active'},
  {'key': 0, 'title': 'Inactive'}
]
const currentPackageCompany = ref({
  "title": null,
  "status": null,
  "type": {'key': 'limited', 'title': 'Limited'},
  "expire": null,
  "access": []
})
const defaultPackageCompany = ref({
  "title": null,
  "status": null,
  "type": {'key': 'limited', 'title': 'Limited'},
  "expire": null,
  "access": []
})
const newPackageCompany = ref({
  "title": null,
  "status": null,
  "type": {'key': 'limited', 'title': 'Limited'},
  "expire": null,
  "access": []
})
const tableHeaders = [
  {label: "table.id", key: "id"},
  {label: "table.title", key: "title"},
  {label: "table.type", key: "type"},
  {label: "table.expire", key: "expire"},
  {label: "table.status", key: "status"},
  {label: "table.action", key: "action"}
]
const showAddPackageCompanyModalFlag = ref(false)
const addPackageCompanyModalId = 'add_package_company_modal'
const addPackageCompanyLoadingFlag = ref(false)
const showViewPackageCompanyModalFlag = ref(false)
const resourceListProcessing = ref(true)
const resourceList = ref([])
//for handle validation error in update packageCompany
const showUpdatePackageCompanyModalFlag = ref(false)
const updatePackageCompanyLoadingFlag = ref(false)
const updatePackageCompanyModalId = 'update_package_company_modal'

function setPackageCompanyListProcessing(payload) {
  packageCompanyListProcessing.value = payload
  fetchError.value = null
}

function clearFetchError() {
  fetchError.value = null
}

function setFetchError(payload) {
  fetchError.value = payload
  currentPackageCompanyList.value = []
  Object.assign(currentPackageCompany.value, defaultPackageCompany.value);
  packageCompanyProcessing.value = false
  packageCompanyListProcessing.value = false
}

function setPackageCompanyList(payload) {
  currentPackageCompanyList.value = payload
  packageCompanyListProcessing.value = false
  fetchError.value = null
}

async function listPackageCompanyRequest() {
  clearFetchError()
  setPackageCompanyListProcessing(true)
  const request = {}
  const {data, error} = await API.listPackageCompanyRequest(request)
  if (data.value) {
    setPackageCompanyList(data.value.data)
  } else if (error.value) {
    setFetchError(error.value)
  }
  setPackageCompanyListProcessing(false)
}

function showAddPackageCompanyModal() {
  if (resourceListProcessing.value)
    return
  showAddPackageCompanyModalFlag.value = true
  const modal = document.getElementById(addPackageCompanyModalId);
  modal.showModal();
}

async function addPackageCompany(packageCompany) {
  if (packageCompany == null) {
    resetAddPackageCompanyData();
  }
  const {data, error} = await API.addPackageCompanyRequest(JSON.stringify(packageCompany))
  if (data.value) {
    setPackageCompanyListProcessing(true)
    resetAddPackageCompanyData()
    await listPackageCompanyRequest()
  } else if (error.value) {
    addPackageCompanyLoadingFlag.value = false
    ///TODO:set alert for error in delete member
  }
}

function confirmUpdateStatusPackageCompany(packageCompany) {
  Object.assign(currentPackageCompany.value, packageCompany)
  const modal = document.getElementById('confirmation_update_status_package_company');
  modal.showModal();
}

function cancelUpdateStatusPackageCompany() {
  Object.assign(currentPackageCompany.value, defaultPackageCompany.value);
}

function updateStatusPackageCompany() {
  setPackageCompanyListProcessing(true)
  currentPackageCompany.value.status = 1 - currentPackageCompany.value.status
  ///TODO: kerloper: remove extra fields after check via backend
  updatePackageCompany({
    "package_id": currentPackageCompany.value.id,
    "status": currentPackageCompany.value.status,
    "title": currentPackageCompany.value.title,
    "type": currentPackageCompany.value.information.type,
    "expire": currentPackageCompany.value.information.expire,
    "access": currentPackageCompany.value.information.access,
  })
}

function onSubmitAddPackageCompany() {
  if (!newPackageCompany.value) {
    return
  } else {
    addPackageCompanyLoadingFlag.value = true
  }
  Object.assign(currentPackageCompany.value, newPackageCompany.value);
  if (currentPackageCompany.value.access && currentPackageCompany.value.type) {
    if (currentPackageCompany.value.type.key !== 'limited') {
      currentPackageCompany.value.access = [];
    }
  } else {
    currentPackageCompany.value.access = [];
  }
  currentPackageCompany.value.status = currentPackageCompany.value.status ? currentPackageCompany.value.status.key : null;
  currentPackageCompany.value.type = currentPackageCompany.value.type ? currentPackageCompany.value.type.key : null;
  currentPackageCompany.value.expire = currentPackageCompany.value.expire ? currentPackageCompany.value.expire.key : null;
  addPackageCompany(currentPackageCompany.value);
}

function resetAddPackageCompanyData() {
  //reset validation error message of form
  showAddPackageCompanyModalFlag.value = false
  addPackageCompanyLoadingFlag.value = false
  const modal = document.getElementById(addPackageCompanyModalId);
  modal.close();
}

///start update packageCompany methods
function showUpdatePackageCompanyModal(packageCompany) {
  Object.assign(currentPackageCompany.value, packageCompany)
  currentPackageCompany.value.access = currentPackageCompany.value.information.access;
  currentPackageCompany.value.status = statusList.find(status => status.key === packageCompany.status)
  currentPackageCompany.value.type = typeList.find(type => type.key === packageCompany.information.type)
  currentPackageCompany.value.expire = expireList.find(expire => expire.key === packageCompany.information.expire)
  currentPackageCompany.value.package_id = packageCompany.id
  showUpdatePackageCompanyModalFlag.value = true
  const modal = document.getElementById(updatePackageCompanyModalId);
  modal.showModal();
}

function resetUpdatePackageCompanyData() {
  //reset validation error message of update form
  showUpdatePackageCompanyModalFlag.value = false
  updatePackageCompanyLoadingFlag.value = false
  Object.assign(currentPackageCompany.value, defaultPackageCompany.value);
  const modal = document.getElementById(updatePackageCompanyModalId)
  modal.close()
}

function onSubmitUpdatePackageCompany() {
  if (!currentPackageCompany.value) {
    return
  } else {
    updatePackageCompanyLoadingFlag.value = true
  }
  updatePackageCompany({
    "package_id": currentPackageCompany.value.package_id,
    "title": currentPackageCompany.value.title,
    "status": currentPackageCompany.value.status.key,
    "type": currentPackageCompany.value.type.key,
    "expire": currentPackageCompany.value.expire.key,
    "access": currentPackageCompany.value.access??[]
  })
}

async function updatePackageCompany(packageCompany) {
  if (packageCompany == null) {
    resetUpdatePackageCompanyData()
  }
  const {data, error} = await API.updatePackageCompanyRequest(JSON.stringify(packageCompany))
  if (data.value) {
    setPackageCompanyListProcessing(true)
    resetUpdatePackageCompanyData();
    await listPackageCompanyRequest();
  } else if (error.value) {
    updatePackageCompanyLoadingFlag.value = false
    ///TODO:set error handler for update member
  }
}

//reset form data of add packageCompany
watch(showAddPackageCompanyModalFlag, () => {
  Object.assign(newPackageCompany.value, defaultPackageCompany.value)
})

///start view packageCompany methods
function showViewPackageCompanyModal(packageCompany) {
  Object.assign(currentPackageCompany.value, packageCompany)
  showViewPackageCompanyModalFlag.value = true
  const modal = document.getElementById('view_package_company_modal');
  modal.showModal();
}

async function listResourceRequest() {
  resourceListProcessing.value = true
  const {data, error} = await API.listResourcePermissionRequest({'section': 'api', 'limit': 500})
  if (data.value) {
    resourceList.value = data.value.data.list
  } else if (error.value) {
  }
  resourceListProcessing.value = false
}

//reset form data of add packageCompany
watch(showUpdatePackageCompanyModalFlag, () => {
})

listPackageCompanyRequest()
listResourceRequest()

</script>

<template>
  <div>

    <!--  modal of add packageCompany  -->
    <AddPackageModal
        :modalId="addPackageCompanyModalId"
        :showAddPackageCompanyModalFlag="showAddPackageCompanyModalFlag"
        :newPackageCompany="newPackageCompany"
        :typeList="typeList"
        :expireList="expireList"
        :statusList="statusList"
        :resourceList="resourceList"
        :addPackageCompanyLoadingFlag="addPackageCompanyLoadingFlag"
        @resetAddPackageCompanyData="resetAddPackageCompanyData"
        @onSubmitAddPackageCompany="onSubmitAddPackageCompany"
    />

    <!--  modal of update packageCompany  -->
    <UpdatePackageModal
        :modalId="updatePackageCompanyModalId"
        :showUpdatePackageCompanyModalFlag="showUpdatePackageCompanyModalFlag"
        :currentPackageCompany="currentPackageCompany"
        :typeList="typeList"
        :expireList="expireList"
        :statusList="statusList"
        :resourceList="resourceList"
        :updatePackageCompanyLoadingFlag="updatePackageCompanyLoadingFlag"
        @resetUpdatePackageCompanyData="resetUpdatePackageCompanyData"
        @onSubmitUpdatePackageCompany="onSubmitUpdatePackageCompany"
    />

    <!--  modal of show package company  -->
    <Modal
        :title="`${currentPackageCompany?currentPackageCompany.title??'':''} ${$t('table.package')}`"
        id="view_package_company_modal"
        v-if="currentPackageCompany"
    >
      <div class="flex gap-2 min-h-48 justify-center items-center">
        <span>
          {{ $t('general.no-data-available') }}
        </span>
      </div>
      <div class="flex justify-end mt-3 gap-2">
        <BaseButton class="btn-outline btn-primary text-white" size="xs" onclick="view_package_company_modal.close()"
                    type="button">
          {{ $t('button.close') }}
        </BaseButton>
      </div>
    </Modal>

    <!--  modal of update status confirmation  -->
    <ConfirmationModal
        :accept="updateStatusPackageCompany"
        :deny="cancelUpdateStatusPackageCompany"
        id="confirmation_update_status_package_company"
    >
      {{ $t('message.update-package-confirmation') }} {{ currentPackageCompany ? currentPackageCompany.title : '' }}?
    </ConfirmationModal>

    <BaseCard>
      <div class="flex justify-between border-b-2 pb-2">
        <div></div>
        <div class="flex gap-2">
          <BaseButton class="btn-primary text-white" size="xs" :onclick="showAddPackageCompanyModal">
            <div class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/>
              </svg>
              <span class="p-1">
                {{ $t("button.add-package") }}
              </span>
            </div>
          </BaseButton>
        </div>
      </div>
      <div class="min-card-height-table">
        <BaseTable
            :is-loading="packageCompanyListProcessing"
            :data="currentPackageCompanyList"
            :headers="tableHeaders"
        >
          <template v-slot:cell(status)="{data,index}">
            <BaseToggleSwitch
                :toggleActive="data.item.status===1"
                @toggleAction="confirmUpdateStatusPackageCompany(data.item)"
            />
          </template>
          <template v-slot:cell(type)="{data,index}">
            <span class="text-xs font-medium">
              {{ data.item.information.type }}
            </span>
          </template>
          <template v-slot:cell(expire)="{data,index}">

               <span class="text-xs font-medium">
                {{ data.item.information.expire }}
               </span>
          </template>
          <template v-slot:cell(action)="{data,index}">
            <div class="flex gap-2">
              <BaseButton
                  size="xs"
                  @click="showUpdatePackageCompanyModal(data.item)"
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
                  @click="showViewPackageCompanyModal(data.item)"
                  class="bg-gray-600 hover:bg-gray-800 text-white tooltip"
                  :data-tip="$t('tooltip.view')"
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
    </BaseCard>
  </div>
</template>

<style scoped>

</style>