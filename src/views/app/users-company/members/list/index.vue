<script setup>

import {ref, watch} from "vue";
import BaseTable from "@/components/table/BaseTable.vue";
import {useI18n} from "vue-i18n";
import API from "@/services/API.js";
import BaseCard from "@/components/BaseCard.vue";
import BasePagination from "@/components/table/BasePagination.vue";
import BaseButton from "@/components/BaseButton.vue";
import Modal from "@/components/Modal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import FilterMemberModal from "./FilterMemberModal.vue";
import AddMemberModal from "./AddMemberModal.vue";
import UpdateMemberModal from "./UpdateMemberModal.vue";
import UpdateMemberPasswordModal from "./UpdateMemberPasswordModal.vue";
import PerPage from "@/components/table/PerPage.vue";
import {scollToTop} from "@/composables/scoll-to-top.js";
import UserLogHistoryModal from "@/components/log/UserLogHistoryModal.vue";
import cleaner from "@/composables/clean-object.js";
import {isMultiRoles, listSetting} from "@/constants/config.js";
import BaseToggleSwitch from "@/components/BaseToggleSwitch.vue";

const {t: $t} = useI18n()
const memberListProcessing = ref(false)
const roleListProcessing = ref(true)
const memberProcessing = ref(false)
const fetchError = ref(false)
const currentMemberList = ref([])
const roleList = ref([])
const statusList = [
  {'key': 1, 'title': 'Active'},
  {'key': 0, 'title': 'Inactive'}
]
const password = ref(null)
const retypePassword = ref(null)
const currentMember = ref({})
const defaultMember = {
  "first_name": null,
  "last_name": null,
  "email": null,
  "mobile": null,
  "roles": null,
  "status": true,
}
const newMember = ref({
  "first_name": null,
  "last_name": null,
  "email": null,
  "mobile": null,
  "roles": null,
  "status": true,
})
const tableHeaders = [
  {label: "table.id", key: "id"},
  {label: "table.name", key: "name"},
  {label: "table.email", key: "email"},
  {label: "table.mobile", key: "mobile"},
  {label: "table.status", key: "status"},
  {label: "table.roles", key: "roles"},
  {label: "table.time-created", key: "time_created_view"},
  {label: "table.action", key: "action"}
]
const pageOptions = ref({
  limit: listSetting.limit,
  page: 1,
  count: 0,
  totalPage: 1,
})
const {scrollToTop} = scollToTop()
const handlePageChange = (newPage) => {
  pageOptions.value.page = newPage
  listMemberRequest()
  scrollToTop()
};
const onLimitChange = (newLimit) => {
  pageOptions.value.page = 1
  pageOptions.value.limit = newLimit.value
  listMemberRequest()
  scrollToTop()
};

//for handle validation error in add member
const showAddMemberModalFlag = ref(false)
const addMemberModalId = 'add_member_modal'
const addMemberLoadingFlag = ref(false)
//for handle validation error in update member
const showUpdateMemberModalFlag = ref(false)
const updateMemberModalId = 'update_member_modal'
const updateMemberLoadingFlag = ref(false)
//for handle show user log history
const showUserLogHistoryModalFlag = ref(false)
const userLogHistoryModalId = 'user_log_history_modal'
//for handle validation error in update member password
const showUpdateMemberPasswordModalFlag = ref(false)
const updateMemberPasswordModalId = 'update_member_password_modal'
const updateMemberPasswordLoadingFlag = ref(false)
//for handle validation error in filter members list
const showFilterMemberModalFlag = ref(false)
const filterMemberLoadingFlag = ref(false)
const filterDataDefault = {
  "name": null,
  "email": null,
  "status": null,
}
const filterData = ref({
  "name": null,
  "email": null,
  "status": null,
})
const filterDataTemp = ref({
  "name": null,
  "email": null,
  "status": null,
})

function setMemberListProcessing(payload) {
  memberListProcessing.value = payload
  fetchError.value = null
}

function clearFetchError() {
  fetchError.value = null
}

function setFetchError(payload) {
  fetchError.value = payload
  currentMemberList.value = []
  Object.assign(currentMember.value, defaultMember);
  memberProcessing.value = false
  memberListProcessing.value = false
}

function setMemberList(payload) {
  currentMemberList.value = payload
  memberListProcessing.value = false
  fetchError.value = null
}

async function listMemberRequest() {
  clearFetchError()
  setMemberListProcessing(true)
  filterData.value.status = filterData.value.status ? filterData.value.status.key : null
  const {data, error} = await API.listMemberRequest({...pageOptions.value, ...cleaner(filterData.value)})
  if (data.value) {
    pageOptions.value = data.value.data.paginator
    pageOptions.value.totalPage = Math.ceil(pageOptions.value.count / pageOptions.value.limit)
    Object.assign(filterData.value, filterDataTemp.value)
    setMemberList(data.value.data.list)
    //if list api call from filter modal
    if (showFilterMemberModalFlag.value) {
      const modal = document.getElementById('filter_member_modal')
      modal.close()
    }
  } else if (error.value) {
    setFetchError(error.value)
  }
  setMemberListProcessing(false)
}

async function listRoleRequest() {
  roleListProcessing.value = true
  const {data, error} = await API.roleList()
  if (data.value) {
    roleList.value = data.value.data.list
  } else if (error.value) {
  }
  roleListProcessing.value = false
}

function showAddMemberModal() {
  showAddMemberModalFlag.value = true
  setTimeout(function(){
    const modal = document.getElementById(addMemberModalId);
    modal.showModal();
  },100)
}

function confirmDeleteMember(member) {
  Object.assign(currentMember.value, member);
  const modal = document.getElementById('confirmation_delete_member');
  modal.showModal();
}

function cancelDeleteMember() {
  Object.assign(currentMember.value, defaultMember);
}

function deleteMember() {
  deleteMemberRequest(currentMember.value);
}

async function deleteMemberRequest(member) {
  if (member == null) {
    cancelDeleteMember();
  }
  setMemberListProcessing(true)
  const {data, error} = await API.deleteMemberRequest(JSON.stringify({"user_id": member.id}))
  if (data.value) {
    Object.assign(currentMember.value, defaultMember);
    await listMemberRequest();
  } else if (error.value) {
    ///TODO:set alert for error in delete member
  }
  resetAddMemberData()
}

async function addMember(member) {
  if (member == null) {
    resetAddMemberData();
  }
  const {data, error} = await API.addMemberRequest(JSON.stringify(member))
  if (data.value) {
    setMemberListProcessing(true)
    resetAddMemberData()
    removeFilterData()
  } else if (error.value) {
    addMemberLoadingFlag.value = false
    ///TODO:set alert for error in delete member
  }
  filterMemberLoadingFlag.value = false
}


function confirmUpdateStatusMember(member) {
  Object.assign(currentMember.value, member)
  const modal = document.getElementById('confirmation_update_status_member');
  modal.showModal();
}

function cancelUpdateStatusMember() {
  Object.assign(currentMember.value, defaultMember);
}

function updateStatusMember() {
  currentMember.value.status = 1 - currentMember.value.status
  updateStatusMemberRequest(currentMember.value);
}

async function updateStatusMemberRequest(member) {
  if (member == null) {
    cancelUpdateStatusMember();
  }
  setMemberListProcessing(true)
  const {data, error} = await API.updateStatusMemberRequest(JSON.stringify({
    "user_id": member.id,
    "status": member.status
  }))
  if (data.value) {
    await listMemberRequest();
  } else if (error.value) {
    ///TODO:set alert for error in delete member
  }
}

function showMemberRolesDialog(member) {
  Object.assign(currentMember.value, member);
  const modal = document.getElementById('member_roles_list');
  modal.showModal();
}

function onSubmitAddMember() {
  if (!newMember.value) {
    return
  } else {
    addMemberLoadingFlag.value = true
  }
  const requestParams = {...newMember.value};
  if (requestParams.roles) {
    if(isMultiRoles){
      requestParams.roles = requestParams.roles.map(({name}) => name);
    }else{
      requestParams.roles = [ requestParams.roles.name ]
    }
  } else {
    requestParams.roles = "";
  }
  requestParams.status = newMember.value.status===true?1:0
  addMember(requestParams);
}

function resetAddMemberData() {
  Object.assign(currentMember.value,defaultMember)
  Object.assign(newMember.value,defaultMember)
  addMemberLoadingFlag.value = false
  if(showAddMemberModalFlag.value){
    const modal = document.getElementById(addMemberModalId);
    modal.close();
  }
  showAddMemberModalFlag.value = false
}


///start update member methods
function showUpdateMemberModal(member) {
  Object.assign(currentMember.value, member)
  if (roleList.value.length > 0) {
    const memberRoles = currentMember.value.roles
    currentMember.value.roles = roleList.value.filter(item => {
      const roles = memberRoles[item.section] || [];
      return roles.some(role => role.role === item.name);
    })
  } else {
    currentMember.value.roles = [];
  }
  showUpdateMemberModalFlag.value = true
  const modal = document.getElementById(updateMemberModalId);
  modal.showModal();
}

function resetUpdateMemberData() {
  Object.assign(currentMember.value,defaultMember)
  Object.assign(newMember.value,defaultMember)
  showUpdateMemberModalFlag.value = false
  updateMemberLoadingFlag.value = false
  const modal = document.getElementById(updateMemberModalId)
  modal.close()
}

function onSubmitUpdateMember() {
  if (!currentMember.value) {
    return
  } else {
    updateMemberLoadingFlag.value = true
  }
  let roles = ""
  if (currentMember.value.roles) {
    if(isMultiRoles){
      roles = currentMember.value.roles.map(({name}) => name);
    }else{
      roles = [currentMember.value.roles.name]
    }
  }
  updateMember({
    "user_id": currentMember.value.id,
    "first_name": currentMember.value.first_name,
    "last_name": currentMember.value.last_name,
    "roles": roles
  })
}

async function updateMember(member) {
  if (member == null) {
    resetUpdateMemberData()
  }
  const {data, error} = await API.updateMemberRequest(member)
  if (data.value) {
    setMemberListProcessing(true)
    resetUpdateMemberData();
    await listMemberRequest();
  } else if (error.value) {
    updateMemberLoadingFlag.value = false
    ///TODO:set error handler for update member
  }
}

///start show user log history
function showUserLogHistoryModal(member) {
  Object.assign(currentMember.value, member)
  showUserLogHistoryModalFlag.value = true
}

function closeUserLogHistoryModal() {
  showUserLogHistoryModalFlag.value = false
  const modal = document.getElementById(userLogHistoryModalId)
  modal.close()
}

///start update member password
function showUpdateMemberPasswordModal(member) {
  Object.assign(currentMember.value, member)
  showUpdateMemberPasswordModalFlag.value = true
  const modal = document.getElementById(updateMemberPasswordModalId);
  modal.showModal();
}

function resetUpdateMemberPasswordData() {
  //reset validation error message of update password form
  showUpdateMemberPasswordModalFlag.value = false
  updateMemberPasswordLoadingFlag.value = false
  const modal = document.getElementById(updateMemberPasswordModalId)
  modal.close()
}

function onSubmitUpdateMemberPassword() {
  if (!currentMember.value) {
    return
  } else {
    updateMemberPasswordLoadingFlag.value = true
  }
  updateMemberPassword({
    "user_id": currentMember.value.id,
    "credential": currentMember.value.password,
  })
}

async function updateMemberPassword(member) {
  if (member == null) {
    resetUpdateMemberPasswordData()
  }
  const {data, error} = await API.updateMemberPasswordRequest(JSON.stringify(member))
  if (data.value) {
    resetUpdateMemberPasswordData();
  } else if (error.value) {
    ///TODO:set error handler for update member password
    resetUpdateMemberPasswordData();
  }
}

///start filter members list
function showFilterMemberModal() {
  showFilterMemberModalFlag.value = true
  const modal = document.getElementById('filter_member_modal');
  modal.showModal();
}

function resetFilterMemberData() {
  showFilterMemberModalFlag.value = false
  filterMemberLoadingFlag.value = false
  const modal = document.getElementById('filter_member_modal')
  modal.close()
}

function onSubmitFilterMember() {
  pageOptions.value.page = 1
  Object.assign(filterData.value, filterDataTemp.value)
  filterMemberLoadingFlag.value = true
  listMemberRequest()
}

function removeFilterData() {
  pageOptions.value.page = 1
  password.value = null
  retypePassword.value = null
  Object.assign(filterData.value, filterDataDefault)
  Object.assign(filterDataTemp.value, filterDataDefault)
  filterMemberLoadingFlag.value = true
  listMemberRequest()
}

//clean methods section
function cleanMfa() {
  if (!currentMember.value) {
    return
  } else {
    updateMemberLoadingFlag.value = true
  }
  clean({
    type: 'mfa',
    user_id: currentMember.value.id
  })
}

function cleanPassword() {
  if (!currentMember.value) {
    return
  } else {
    updateMemberPasswordLoadingFlag.value = true
  }
  clean({
    type: 'password',
    user_id: currentMember.value.id
  })
}

function cleanAvatar() {
  if (!currentMember.value) {
    return
  } else {
    updateMemberLoadingFlag.value = true
  }
  clean({
    type: 'avatar',
    user_id: currentMember.value.id
  })
}

async function clean(request) {
  const {data, error} = await API.cleanMemberRequest(request)
  if (data.value) {
    setMemberListProcessing(true)
    resetUpdateMemberData()
    resetUpdateMemberPasswordData()
    await listMemberRequest()
  } else if (error.value) {
    updateMemberLoadingFlag.value = false
  }
}

//reset form data of add member
watch(showAddMemberModalFlag, () => {
  Object.assign(newMember.value, defaultMember)
})

watch(showUserLogHistoryModalFlag, () => {
  if (showUserLogHistoryModalFlag.value) {
    setTimeout(() => {
      const modal = document.getElementById(userLogHistoryModalId);
      modal.showModal();
    }, 100)
  }
})
listMemberRequest()

///TODO: kerloper: move to method for when need
listRoleRequest()


</script>

<template>
  <div>
    <UserLogHistoryModal
        v-if="showUserLogHistoryModalFlag"
        :modalId="userLogHistoryModalId"
        :showLogHistoryModalFlag="showUserLogHistoryModalFlag"
        :currentUser="currentMember"
        @close="closeUserLogHistoryModal"
    />

    <!--  modal of filter members list  -->
    <FilterMemberModal
        :showFilterMemberModalFlag="showFilterMemberModalFlag"
        :filterDataTemp="filterDataTemp"
        :statusList="statusList"
        :filterMemberLoadingFlag="filterMemberLoadingFlag"
        @resetFilterMemberData="resetFilterMemberData"
        @onSubmitFilterMember="onSubmitFilterMember"
        @removeFilterData="removeFilterData"
    />

    <!--  modal of add member  -->
    <div v-if="showAddMemberModalFlag">
      <AddMemberModal
          :modalId="addMemberModalId"
          :showAddMemberModalFlag="showAddMemberModalFlag"
          :newMember="newMember"
          :statusList="statusList"
          :roleList="roleList"
          :addMemberLoadingFlag="addMemberLoadingFlag"
          @resetAddMemberData="resetAddMemberData"
          @onSubmitAddMember="onSubmitAddMember"
      />
    </div>


    <!--  modal of update member  -->
    <UpdateMemberModal
        :modalId="updateMemberModalId"
        :currentMember="currentMember"
        :roleList="roleList"
        :showUpdateMemberModalFlag="showUpdateMemberModalFlag"
        :updateMemberLoadingFlag="updateMemberLoadingFlag"
        @onSubmitUpdateMember="onSubmitUpdateMember"
        @cleanAvatar="cleanAvatar"
        @cleanMfa="cleanMfa"
        @close="resetUpdateMemberData"
    />

    <!--  modal of update member password  -->
    <UpdateMemberPasswordModal
        :modalId="updateMemberPasswordModalId"
        :currentMember="currentMember"
        :showUpdateMemberPasswordModalFlag="showUpdateMemberPasswordModalFlag"
        :updateMemberPasswordLoadingFlag="updateMemberPasswordLoadingFlag"
        @onSubmitUpdateMemberPassword="onSubmitUpdateMemberPassword"
        @cleanPassword="cleanPassword"
        @close="resetUpdateMemberPasswordData"
    />

    <!--  modal of show members roles  -->
    <Modal
        :title="`${currentMember?currentMember.name??'':''} ${$t('table.roles')}`"
        id="member_roles_list"
        v-if="currentMember"
    >
      <div class="flex gap-2">
        <BaseCard
            class="w-full"
            v-for="(section,key) in currentMember.roles"
            :title="$t(`table.${key}`)"
            :key="key"
        >
          <div class="flex gap-2 flex-wrap">
            <BaseButton size="xs"
                        class="btn-outline"
                        v-for="role in section"
                        :key="role.id"
            >
              {{ role.title }}
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </Modal>

    <!--  modal of delete confirmation  -->
    <ConfirmationModal
        @close="cancelDeleteMember"
        :accept="deleteMember"
        :deny="cancelDeleteMember"
        id="confirmation_delete_member"
    >
      {{ $t('message.delete-member-confirmation') }} {{ currentMember ? currentMember.name : '' }}?
    </ConfirmationModal>

    <!--  modal of update status confirmation  -->
    <ConfirmationModal
        :accept="updateStatusMember"
        :deny="cancelUpdateStatusMember"
        id="confirmation_update_status_member"
    >
      {{ $t('message.update-member-confirmation') }} {{ currentMember ? currentMember.name : '' }}?
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
          <BaseButton class="btn-primary text-white" size="xs" :onclick="showAddMemberModal">
            <div class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"/>
              </svg>
              <span class="p-1">
                {{ $t("button.add-member") }}
              </span>
            </div>
          </BaseButton>
          <BaseButton class="btn-secondary text-white" size="xs" @click="showFilterMemberModal">
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
            :data="currentMemberList"
            :is-loading="memberListProcessing"
            :headers="tableHeaders"
        >
          <template v-slot:cell(status)="{data,index}">
            <BaseToggleSwitch
                :toggleActive="data.item.status===1"
                @toggleAction="confirmUpdateStatusMember(data.item)"
            />
          </template>

          <template v-slot:cell(roles)="{data,index}">
            <BaseButton
                size="xs"
                class="bg-gray-600 hover:bg-gray-800 text-white tooltip"
                @click="showMemberRolesDialog(data.item)"
                :data-tip="$t('tooltip.view')"
                v-if="isMultiRoles"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
              </svg>
            </BaseButton>
            <div
                v-else
            >
              <div>
                <div v-for="section in data.item.roles" :key="section">
<!--                  <p>{{ section.map(item => item).map(item => item.title).join(', ') }}</p>-->
                 <p>{{ [...section.map(item => item)].map(item => item.title)[1]}}</p>
                </div>
              </div>
            </div>
          </template>

          <template v-slot:cell(action)="{data,index}">
            <div class="flex gap-2">
              <BaseButton
                  size="xs"
                  @click="showUpdateMemberModal(data.item)"
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
                  @click="showUserLogHistoryModal(data.item)"
                  :data-tip="$t('tooltip.log-history')"
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
                  class="bg-gray-600 hover:bg-gray-800 text-white tooltip"
                  @click="showUpdateMemberPasswordModal(data.item)"
                  :data-tip="$t('tooltip.change-password')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/>
                </svg>
              </BaseButton>
              <BaseButton
                  size="xs"
                  @click="confirmDeleteMember(data.item)"
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