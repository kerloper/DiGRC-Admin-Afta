<script setup>

import {computed, ref, watch} from "vue";
import BaseTable from "@/components/table/BaseTable.vue";
import {useI18n} from "vue-i18n";
import API from "@/services/API.js";
import BaseCard from "@/components/BaseCard.vue";
import BasePagination from "@/components/table/BasePagination.vue";
import BaseButton from "@/components/BaseButton.vue";
import Modal from "@/components/Modal.vue";
import FilterMemberModal from "./FilterMemberModal.vue";
import AddMemberModal from "./AddMemberModal.vue";
import UpdateMemberModal from "./UpdateMemberModal.vue";
import UpdateMemberPasswordModal from "./UpdateMemberPasswordModal.vue";
import PerPage from "@/components/table/PerPage.vue";
import {scollToTop} from "@/composables/scoll-to-top.js";
import UserLogHistoryModal from "@/components/log/UserLogHistoryModal.vue";
import { useRoute } from 'vue-router';
import cleaner from "@/composables/clean-object.js";
import {isMultiRoles, listSetting} from "@/constants/config.js";

const route = useRoute();
const companyId = route.params.companyId || null;
const companyName = route.query.companyName;
const {t: $t} = useI18n()
const memberListProcessing = ref(false)
const memberProcessing = ref(false)
const fetchError = ref(false)
const currentMemberList = ref([])
const currentMember = ref({})
const defaultMember = {
  "user": null,
  "company_id": companyId,
}
const newMember = ref({
  "user": null,
  "company_id": companyId,
})
const tableHeaders = [
  {label: "table.id", key: "id"},
  {label: "table.name", key: "user_name"},
  {label: "table.email", key: "user_email"},
  {label: "table.mobile", key: "user_mobile"},
  {label: "table.status", key: "status"},
  {label: "table.roles", key: "roles"},
  {label: "table.time-created", key: "time_create_view"},
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
const showUserLogHistoryModalFlag = ref(false)
const userLogHistoryModalId = 'user_log_history_modal'
const showFilterMemberModalFlag = ref(false)
const filterMemberLoadingFlag = ref(false)
const filterDataDefault = {
  "name": null,
  "email": null,
  "company_id": companyId,
}
const filterData = ref({
  "name": null,
  "email": null,
  "company_id": companyId,
})
const filterDataTemp = ref({
  "name": null,
  "email": null,
  "company_id": companyId,
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
  const {data, error} = await API.listCompanyMemberRequest({...pageOptions.value,...cleaner(filterData.value)})
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

function showAddMemberModal() {
  showAddMemberModalFlag.value = true
  setTimeout(function(){
    const modal = document.getElementById(addMemberModalId);
    modal.showModal();
  },100)
}

async function addMember(member) {
  if (member == null) {
    resetAddMemberData();
  }
  member.company_id= companyId
  const {data, error} = await API.addCompanyMemberRequest({company_id:companyId,user_id:member.user.id})
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

function onSubmitAddMember() {
  if (!newMember.value) {
    return
  } else {
    addMemberLoadingFlag.value = true
  }
  const requestParams = {...newMember.value};
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
  Object.assign(filterData.value, filterDataDefault)
  Object.assign(filterDataTemp.value, filterDataDefault)
  filterMemberLoadingFlag.value = true
  listMemberRequest()
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

const {data:allMembers} = API.listMemberRequest({limit:1000,page:1})
const unregisterMemberList = computed(()=>allMembers?.value?.data?.list||[])

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
          :addMemberLoadingFlag="addMemberLoadingFlag"
          :memberList="unregisterMemberList"
          @resetAddMemberData="resetAddMemberData"
          @onSubmitAddMember="onSubmitAddMember"
      />
    </div>

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

    <BaseCard>
      <div class="grid grid-cols-3 border-b-2 pb-2">
        <div>
          <PerPage
              class="w-64"
              :totalCount="pageOptions.count"
              :currentPage="pageOptions.page"
              :totalPages="pageOptions.totalPage"
              @limit-change="onLimitChange"
          />
        </div>
        <div class="items-center justify-center text-center">
          {{companyName}}
        </div>
        <div class="flex gap-2 items-end justify-end">
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
            <BaseButton
                class="w-20 btn-xs text-xs btn-outline"
                size="xs"
                :class="{'btn-success':(data.item.status===1),'':!(data.item.status===1)}"
            >
               <span class="text-xs font-medium">
                {{ data.item.status === 1 ? $t('table.active') : $t('table.inactive') }}
               </span>
            </BaseButton>
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
                  <p>{{ section.map(item => item).map(item => item.title).join(', ') }}</p>
                </div>
              </div>
            </div>
          </template>

          <template v-slot:cell(action)="{data,index}">
            <div class="flex gap-2">
<!--              <BaseButton-->
<!--                  size="xs"-->
<!--                  @click="showUpdateMemberModal(data.item)"-->
<!--                  class="btn-primary tooltip text-white"-->
<!--                  :data-tip="$t('tooltip.edit')"-->
<!--              >-->
<!--                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"-->
<!--                     stroke="currentColor" class="size-4">-->
<!--                  <path stroke-linecap="round" stroke-linejoin="round"-->
<!--                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>-->
<!--                </svg>-->
<!--              </BaseButton>-->
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
<!--              <BaseButton-->
<!--                  size="xs"-->
<!--                  class="bg-gray-600 hover:bg-gray-800 text-white tooltip"-->
<!--                  @click="showUpdateMemberPasswordModal(data.item)"-->
<!--                  :data-tip="$t('tooltip.change-password')"-->
<!--              >-->
<!--                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"-->
<!--                     stroke="currentColor" class="size-4">-->
<!--                  <path stroke-linecap="round" stroke-linejoin="round"-->
<!--                        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/>-->
<!--                </svg>-->
<!--              </BaseButton>-->
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