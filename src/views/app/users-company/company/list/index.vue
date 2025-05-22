<script setup>

import {onMounted, ref, watch} from "vue";
import BaseTable from "@/components/table/BaseTable.vue";
import {useI18n} from "vue-i18n";
import API from "@/services/API.js";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import Modal from "@/components/Modal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import VSelect from "@/components/VSelect.vue";
import {Form} from "vee-validate";
import {object} from "yup";
import BasePagination from "@/components/table/BasePagination.vue";
import PerPage from "@/components/table/PerPage.vue";
import UpdateCompanyModal from "./UpdateCompanyModal.vue";
import FilterCompanyModal from "./FilterCompanyModal.vue";
import AddCompanyModal from "./AddCompanyModal.vue";
import BaseDatePicker from "@/components/BaseDatePicker.vue";
import {scollToTop} from "@/composables/scoll-to-top.js";
import router from "@/router/index.js";
import cleaner from "@/composables/clean-object.js";
import {industryList} from "@/constants/industry.js";
import {listSetting} from "@/constants/config.js";
import BaseToggleSwitch from "@/components/BaseToggleSwitch.vue";

const {t: $t} = useI18n()
const companyListProcessing = ref(false)
const companyProcessing = ref(false)
const fetchError = ref(false)
const currentCompanyList = ref([])
const packageList = ref([])
const packageListProcessing = ref(false)
const memberList = ref([])
const statusList = [
  {'key': 1, 'title': 'Active'},
  {'key': 0, 'title': 'Inactive'}
]
const setupList = ref([
  {'key': true, 'title': 'Yes'},
  {'key': false, 'title': 'No'}
])
const defaultCompanyPackage = {
  "company_id": null,
  "package_expire": null,
  "package": null,
}
const currentCompanyPackage = ref({
  "company_id": null,
  "package_expire": null,
  "package": null,
})
const currentCompany = ref({
  "title": null,
  "industry": null,
  "industry_id": null,
  "package": null,
  "package_id": null,
  "user": null,
  "user_id": null,
  "email": null,
  "mobile": null,
})
const defaultCompany = {
  "title": null,
  "industry": null,
  "industry_id": null,
  "package": null,
  "package_id": null,
  "user": null,
  "user_id": null,
  "email": null,
  "mobile": null,
}
const tempCompany = {
  "title": null,
  "industry": null,
  "industry_id": null,
  "package": null,
  "package_id": null,
  "user": null,
  "user_id": null,
  "email": null,
  "mobile": null,
}
const newCompany = ref({
  "title": null,
  "industry": null,
  "industry_id": null,
  "package": null,
  "package_id": null,
  "user": null,
  "user_id": null,
  "email": null,
  "mobile": null,
})
let request = {
  "title": null,
  "industry_id": null,
  "package_id": null,
  "user_id": null,
  "email": null,
  "mobile": null,
}

//for handle validation error in filter members list
const filterCompanyModalId = 'filter_company_modal'
const showFilterCompanyModalFlag = ref(false)
const filterCompanyLoadingFlag = ref(false)
const filterDataDefault = {
  "title": ""
}
const filterData = ref({
  "title": ""
})
const filterDataTemp = ref({
  "title": ""
})
const tableHeaders = [
  {label: "table.id", key: "id"},
  {label: "table.title", key: "title"},
  {label: "table.package-title", key: "package_title"},
  {label: "table.user-name", key: "user_name"},
  {label: "table.email", key: "user_email"},
  {label: "table.status", key: "status"},
  {label: "table.is-company-setup", key: "is_company_setup"},
  {label: "table.last-renew", key: "time_renew_view"},
  {label: "table.expire", key: "time_expire_view"},
  {label: "table.action", key: "action"}
]
//for handle validation error in add company
const addCompanyModalId = "add_company_modal"
const showAddCompanyModalFlag = ref(false)
const addCompanyLoadingFlag = ref(false)
//for handle validation error in update company
const updateCompanyModalId = "update_company_modal"
const showUpdateCompanyModalFlag = ref(false)
const updateCompanyLoadingFlag = ref(false)
//for handle validation error in update company package
const showUpdateCompanyPackageModalFlag = ref(false)
const updateCompanyPackageLoadingFlag = ref(false)
const updateCompanyPackageSchemaValidation = object({});
const {scrollToTop} = scollToTop()
const pageOptions = ref({
  limit: listSetting.limit,
  page: 1,
  count: 0,
  totalPage: 1,
})
const handlePageChange = async (newPage) => {
  pageOptions.value.page = newPage
  setCompanyList(await listCompanyRequest())
  scrollToTop()
};
const onLimitChange = async (newLimit) => {
  pageOptions.value.page = 1
  pageOptions.value.limit = newLimit.value
  setCompanyList(await listCompanyRequest())
  scrollToTop()
};
const handleDateUpdate = (newDate) => {
  currentCompanyPackage.value.package_expire = newDate;
};

function setCompanyListProcessing(payload) {
  companyListProcessing.value = payload
  fetchError.value = null
}

function clearFetchError() {
  fetchError.value = null
}

function setFetchError(payload) {
  fetchError.value = payload
  currentCompanyList.value = []
  Object.assign(currentCompany.value, defaultCompany);
  companyProcessing.value = false
  companyListProcessing.value = false
}

function setCompanyList(payload) {
  currentCompanyList.value = payload
  companyListProcessing.value = false
  fetchError.value = null
}

async function listCompanyRequest() {
  setCompanyListProcessing(true)
  const {data, error} = await API.listCompanyRequest({...pageOptions.value, ...cleaner(filterData.value)})
  if (data.value) {
    pageOptions.value = data.value.data.paginator
    pageOptions.value.totalPage = Math.ceil(pageOptions.value.count / pageOptions.value.limit)
    Object.assign(filterData.value, filterDataTemp.value)
    //if list api call from filter modal
    if (showFilterCompanyModalFlag.value) {
      const modal = document.getElementById(filterCompanyModalId)
      modal.close()
    }
    setCompanyListProcessing(false)
    return await data.value.data.list
  } else if (error.value) {
    setCompanyListProcessing(false)
    setFetchError(error.value)
    return []
  }
  setCompanyListProcessing(false)
  return []
}

async function listPackageRequest() {
  packageListProcessing.value = true
  const {data, error} = await API.listPackageCompanyRequest({})
  if (data.value) {
    return await data.value.data
  } else if (error.value) {
    return []
  }
  packageListProcessing.value = false
}

function showAddCompanyModal() {
  showAddCompanyModalFlag.value = true
  setTimeout(function () {
    const modal = document.getElementById(addCompanyModalId);
    modal.showModal();
  }, 100)
}

async function addCompany(request) {
  ///TODO: kerloper: link to api
  delete request['package']
  delete request['industry']
  delete request['user']

  setCompanyListProcessing(true)
  const {data, error} = await API.addCompanyRequest(request)
  if (data.value) {
    await removeFilterData()
    resetAddCompanyData();
    filterCompanyLoadingFlag.value = false
  } else if (error.value) {
    updateCompanyLoadingFlag.value = false
    ///TODO:set error handler for update company
    await removeFilterData()
    resetAddCompanyData();
  }
}

function confirmUpdateStatusCompany(company) {
  Object.assign(currentCompany.value, company)
  const modal = document.getElementById('confirmation_update_status_company');
  modal.showModal();
}

function cancelUpdateStatusCompany() {
  Object.assign(currentCompany.value, defaultCompany);
}

async function updateStatusCompany() {
  setCompanyListProcessing(true)
  currentCompany.value.status = 1 - currentCompany.value.status
  const requestParams =
      {
        "company_id": currentCompany.value.id,
        "status": currentCompany.value.status,
      }
  const {data, error} = await API.updateCompanyRequest(requestParams)
  if (data.value) {
    setCompanyListProcessing(true)
    setCompanyList(await listCompanyRequest())
  } else if (error.value) {
    updateCompanyLoadingFlag.value = false
  }

}

function onSubmitAddCompany() {
  if (!newCompany.value) {
    return
  } else {
    addCompanyLoadingFlag.value = true
  }
  newCompany.value.user_id = newCompany.value.user ? newCompany.value.user.id : 0;
  newCompany.value.industry_id = newCompany.value.industry ? newCompany.value.industry.id : 0;
  newCompany.value.package_id = newCompany.value.package ? newCompany.value.package.id : 0;
  Object.assign(request, newCompany.value)
  addCompany(request);
}

function resetAddCompanyData() {
  //reset validation error message of form
  showAddCompanyModalFlag.value = false
  addCompanyLoadingFlag.value = false
  const modal = document.getElementById(addCompanyModalId);
  modal.close();
}

///start update company methods
function showUpdateCompanyModal(company) {
  Object.assign(currentCompany.value, company)
  currentCompany.value.industry = industryList.find(industry => industry.id === company.industry_id)
  currentCompany.value.package = packageList.value.find(item => item.id === company.package_id)
  currentCompany.value.user = memberList.value.find(member => member.id === company.user_id)
  setTimeout(function () {
    const modal = document.getElementById(updateCompanyModalId);
    modal.showModal();
  }, 100)
  showUpdateCompanyModalFlag.value = true
}

function resetUpdateCompanyData() {
  //reset validation error message of update form
  showUpdateCompanyModalFlag.value = false
  updateCompanyLoadingFlag.value = false
  const modal = document.getElementById(updateCompanyModalId);
  modal.close()
}

function onSubmitUpdateCompany() {
  if (!currentCompany.value) {
    return
  } else {
    updateCompanyLoadingFlag.value = true
  }
  updateCompany(currentCompany.value)
}

async function updateCompany(company) {
  if (company == null) {
    resetUpdateCompanyData()
  }
  const requestParams = {
    company_id: company.id,
    industry_id: company.industry.id,
    title: company.title,
    company_phone: company.phone,
    company_website: company.website,
    company_email: company.email,
  }
  if(company.email){
    requestParams['email']=company.email
  }
  if(company.mobile){
    requestParams['mobile']=company.mobile
  }
  const {data, error} = await API.updateCompanyRequest(requestParams)
  if (data.value) {
    setCompanyListProcessing(true)
    resetUpdateCompanyData();
    setCompanyList(await listCompanyRequest())
  } else if (error.value) {
    updateCompanyLoadingFlag.value = false
    ///TODO:set error handler for update company
  }
}

function showCompanyMemberModal(company) {
  router.push({
    path: `/app/users-company/company/member-list/${company.id}`,
    query: {
      companyName: company.title
    }
  });
}

function showCompanyViewModal(company) {
  Object.assign(currentCompany.value, company)
  const modal = document.getElementById('company_view_modal')
  modal.show()
}

///start update package company methods
function showUpdateCompanyPackageModal(company) {
  Object.assign(currentCompany.value, company)
  showUpdateCompanyPackageModalFlag.value = true
  const modal = document.getElementById('update_company_package_modal');
  modal.showModal();
}

function resetUpdateCompanyPackageData() {
  //reset validation error message of update form

  Object.assign(currentCompany.value, defaultCompany)
  showUpdateCompanyPackageModalFlag.value = false
  updateCompanyPackageLoadingFlag.value = false
  const modal = document.getElementById('update_company_package_modal')
  modal.close()
}

function onSubmitUpdateCompanyPackage() {
  if (!currentCompany.value) {
    return
  } else {
    updateCompanyPackageLoadingFlag.value = true
  }
  updateCompanyPackage(currentCompany.value)
}

async function updateCompanyPackage(company) {
  if (company == null) {
    resetUpdateCompanyData()
  }
  const requestParams = {
    "company_id": currentCompany.value.id,
    "package_expire": currentCompanyPackage.value.package_expire,
    "package_id": currentCompanyPackage.value.package.id,
  }
  const {data, error} = await API.updateCompanyPackageRequest(requestParams)
  if (data.value) {
    setCompanyListProcessing(true)
    resetUpdateCompanyPackageData();
    setCompanyList(await listCompanyRequest())
  } else if (error.value) {
    updateCompanyPackageLoadingFlag.value = false
    ///TODO:set error handler for update company
  }
}

///start filter members list
function showFilterCompanyModal() {
  showFilterCompanyModalFlag.value = true
  const modal = document.getElementById(filterCompanyModalId);
  modal.showModal();
}

function resetFilterCompanyData() {
  showFilterCompanyModalFlag.value = false
  filterCompanyLoadingFlag.value = false
  const modal = document.getElementById(filterCompanyModalId)
  modal.close()
}

async function onSubmitFilterCompany() {
  pageOptions.value.page = 1
  Object.assign(filterData.value, filterDataTemp.value)
  filterCompanyLoadingFlag.value = true
  setCompanyList(await listCompanyRequest())
}

async function removeFilterData() {
  pageOptions.value.page = 1
  Object.assign(filterDataTemp.value, filterDataDefault)
  Object.assign(filterData.value, filterDataDefault)
  filterCompanyLoadingFlag.value = true
  setCompanyList(await listCompanyRequest())
}

async function listMemberRequest() {
  const {data, error} = await API.listMemberRequest({limit: 1000, page: 1})
  if (data.value) {
    return data.value.data.list
  } else if (error.value) {
    return []
  }
}


//reset form data of add company
watch(showAddCompanyModalFlag, () => {
  Object.assign(newCompany.value, tempCompany)
})

//reset form data of add company package
watch(showUpdateCompanyPackageModalFlag, (value) => {
  if(value){
    currentCompanyPackage.value.package = packageList.value.find(item=>item.id === currentCompany.value.package_id)
  }else{
    Object.assign(currentCompanyPackage.value, defaultCompanyPackage)
  }
})

const fetchData = async () => {
  try {
    const [companyData, memberData, packageData] = await Promise.all([
      listCompanyRequest(),
      listMemberRequest(),
      listPackageRequest(),
    ]);
    setCompanyList(companyData)
    memberList.value = memberData;
    packageList.value = packageData
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
  }
};

// Fetch data when the component mounts
onMounted(fetchData);
</script>

<template>
  <div>

    <!--  modal of filter company list  -->
    <FilterCompanyModal
        :modalId="filterCompanyModalId"
        :showFilterCompanyModalFlag="showFilterCompanyModalFlag"
        :filterDataTemp="filterDataTemp"
        :filterCompanyLoadingFlag="filterCompanyLoadingFlag"
        @resetFilterCompanyData="resetFilterCompanyData"
        @onSubmitFilterCompany="onSubmitFilterCompany"
        @removeFilterData="removeFilterData"
    />

    <!--  modal of update company  -->
    <UpdateCompanyModal
        v-if="showUpdateCompanyModalFlag"
        :modalId="updateCompanyModalId"
        :showUpdateCompanyModalFlag="showUpdateCompanyModalFlag"
        :currentCompany="currentCompany"
        :memberList="memberList"
        :packageList="packageList"
        :updateCompanyLoadingFlag="updateCompanyLoadingFlag"
        @resetUpdateCompanyData="resetUpdateCompanyData"
        @onSubmitUpdateCompany="onSubmitUpdateCompany"
    />

    <!--  modal of show member  -->
    <AddCompanyModal
        v-if="showAddCompanyModalFlag"
        :modalId="addCompanyModalId"
        :showAddCompanyModalFlag="showAddCompanyModalFlag"
        :newCompany="newCompany"
        :memberList="memberList"
        :packageList="packageList"
        :addCompanyLoadingFlag="addCompanyLoadingFlag"
        @resetAddCompanyData="resetAddCompanyData"
        @onSubmitAddCompany="onSubmitAddCompany"
    />

    <!--  modal of view company  -->
    <Modal
        :title="currentCompany?currentCompany.title??'':$t('modal.view')"
        id="company_view_modal"
        v-if="currentCompany"
    >
      <div class="flex gap-2 min-h-48 justify-center items-center">
        <span>
          {{ $t('general.no-data-available') }}
        </span>
      </div>
      <div class="flex justify-end mt-3 gap-2">
        <BaseButton class="btn-outline btn-primary text-white" size="xs" onclick="company_view_modal.close()"
                    type="button">
          {{ $t('button.close') }}
        </BaseButton>
      </div>
    </Modal>

    <!--  modal of update company package -->
    <Modal
        @close="resetUpdateCompanyPackageData"
        :title="currentCompany?currentCompany.title??'':$t('modal.view')"
        id="update_company_package_modal"
        :custom-style="'max-w-3xl'"
        v-if="currentCompany"
        :close-btn="false"
        :close-backdrop="true"
        :close-icon="true"
    >
      <div>
        <Form :validation-schema="updateCompanyPackageSchemaValidation"
              @submit="onSubmitUpdateCompanyPackage" class=""
              v-if="showUpdateCompanyPackageModalFlag">
          <fieldset class="fieldset border p-4 mb-4 rounded-xl">
            <legend class="fieldset-legend">
              {{ $t("title.information") }}
            </legend>

            <div class="grid grid-cols-2 gap-4">
              <!-- Package Name -->
              <div class="font-medium text-sm text-gray-500">{{$t('title.package-title')}}</div>
              <div class="text-sm text-gray-700">{{ currentCompany.package_title }}</div>

              <!-- Start Date -->
              <div class="font-medium text-sm text-gray-500">{{$t('title.start-date')}}</div>
              <div class="text-sm text-gray-700">{{ currentCompany.setting?.package.time_start_view }}</div>

              <!-- Renew Date -->
              <div class="font-medium text-sm text-gray-500">{{$t('title.renew-date')}}</div>
              <div class="text-sm text-gray-700">{{ currentCompany.setting?.package.time_renew_view }}</div>

              <!-- Expire Date -->
              <div class="font-medium text-sm text-gray-500">{{$t('title.expire-date')}}</div>
              <div class="text-sm text-gray-700">{{ currentCompany.setting?.package.time_expire_view }}</div>
            </div>

          </fieldset>
          <fieldset class="fieldset border p-4 mb-4 rounded-xl">
            <legend class="fieldset-legend">
              {{ $t("title.new-package") }}
            </legend>
            <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
              <BaseDatePicker
                  :label="$t('form.expire')"
                  :selectedDate="currentCompany?.setting?.package?.time_expire_format??''"
                  @update:selectedDate="handleDateUpdate"
                  name="package_expire"
              />
              <VSelect v-model="currentCompanyPackage.package"
                       name="package"
                       deselect-label=""
                       track-by="id"
                       tracked-by="id"
                       :title="$t('form.package')"
                       label="title"
                       :placeholder="$t('form.select-package-placeholder')"
                       :options="packageList"
                       :searchable="false"
                       :allow-empty="false"
              />
            </div>
          </fieldset>
          <div class="py-[6px]" v-if="updateCompanyPackageLoadingFlag">
            <progress class="progress w-full progress-primary"></progress>
          </div>
          <div class="flex justify-end mt-3 gap-2" v-else>
            <BaseButton class="btn-outline btn-primary text-white" size="xs"
                        onclick="update_company_package_modal.close()"
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

    <!--  modal of update status confirmation  -->
    <ConfirmationModal
        :accept="updateStatusCompany"
        :deny="cancelUpdateStatusCompany"
        id="confirmation_update_status_company"
    >
      {{ $t('message.update-company-confirmation') }} {{ currentCompany ? currentCompany.title : '' }}?
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
          <BaseButton class="btn-primary text-white" size="xs" :onclick="showAddCompanyModal">
            <div class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/>
              </svg>
              <span class="p-1">
                {{ $t("button.add-company") }}
              </span>
            </div>
          </BaseButton>
          <BaseButton class="btn-secondary text-white" size="xs" @click="showFilterCompanyModal">
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
            :data="currentCompanyList"
            :is-loading="companyListProcessing"
            :headers="tableHeaders"
        >
          <template v-slot:cell(status)="{data,index}">
            <BaseToggleSwitch
                :toggleActive="data.item.status===1"
                @toggleAction="confirmUpdateStatusCompany(data.item)"
            />
<!--            <BaseButton-->
<!--                class="w-20 btn-xs text-xs btn-outline"-->
<!--                size="xs"-->
<!--                :class="{'btn-success':(data.item.status===1),'':!(data.item.status===1)}"-->
<!--                @click="confirmUpdateStatusCompany(data.item)"-->
<!--            >-->
<!--               <span class="text-xs font-medium">-->
<!--                {{ data.item.status === 1 ? $t('table.active') : $t('table.inactive') }}-->
<!--               </span>-->
<!--            </BaseButton>-->
          </template>
          <template v-slot:cell(is_company_setup)="{data,index}">
            <BaseButton
                class="w-10 btn-xs text-xs btn-outline cursor-default"
                size="xs"
                :class="{'btn-success':(data.item.is_company_setup),'':!(data.item.is_company_setup)}"
            >
               <span class="text-xs font-medium">
                {{ data.item.is_company_setup ? $t('table.yes') : $t('table.no') }}
               </span>
            </BaseButton>
          </template>
          <template v-slot:cell(time_renew_view)="{data,index}">
            {{ data.item.setting.package.time_renew_view }}
          </template>
          <template v-slot:cell(time_expire_view)="{data,index}">
            {{ data.item.setting.package.time_expire_view }}
          </template>
          <template v-slot:cell(action)="{data,index}">
            <div class="flex gap-2">
              <BaseButton
                  size="xs"
                  @click="showUpdateCompanyModal(data.item)"
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
                  class="bg-gray-600 hover:bg-gray-800 text-white tooltip"
                  @click="showCompanyMemberModal(data.item)"
                  :data-tip="$t('tooltip.member')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>
                </svg>
              </BaseButton>
              <BaseButton
                  size="xs"
                  class="bg-gray-400 hover:bg-gray-600 text-white tooltip"
                  @click="showCompanyViewModal(data.item)"
                  :data-tip="$t('tooltip.view')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                </svg>
              </BaseButton>
              <BaseButton
                  size="xs"
                  class="bg-gray-200 hover:bg-gray-400 text-gray-800 tooltip hover:text-gray-200"
                  @click="showUpdateCompanyPackageModal(data.item)"
                  :data-tip="$t('tooltip.package')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"/>
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