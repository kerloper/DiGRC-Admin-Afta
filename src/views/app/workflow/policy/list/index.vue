<script setup>

import {ref} from "vue";
import BaseTable from "@/components/table/BaseTable.vue";
import {useI18n} from "vue-i18n";
import API from "@/services/API.js";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import router from "@/router/index.js";
import PerPage from "@/components/table/PerPage.vue";
import BasePagination from "@/components/table/BasePagination.vue";
import AddPolicyModal from "@/views/app/workflow/policy/list/AddPolicyModal.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import {listSetting} from "@/constants/config.js";

const {t: $t} = useI18n()
const inflowPolicyListProcessing = ref(false)
const inflowPolicyProcessing = ref(false)
const fetchError = ref(false)
const currentInflowPolicyList = ref([])
const tableHeaders = [
  {label: "table.id", key: "id"},
  {label: "table.title", key: "title"},
  {label: "table.identifier", key: "identifier"},
  {label: "table.action", key: "action"},
]
const pageOptions = ref({
  limit: listSetting.limit,
  page: 1,
  count: 0,
  totalPage: 1,
})

//for handle validation error in add policy
const showAddPolicyModalFlag = ref(false)
const addPolicyModalId = 'add_policy_modal'
const addPolicyLoadingFlag = ref(false)
const currentPolicy = ref({
  title: null,
  id: null,
  description: null
})
const defaultPolicy = {
  title: null,
  id: null,
  description: null
}
const newPolicy = ref({
  title: null,
  id: null,
  description: null
})

function showAddPolicyModal() {
  Object.assign(currentPolicy.value,defaultPolicy)
  Object.assign(newPolicy.value,defaultPolicy)
  showAddPolicyModalFlag.value = true
  const modal = document.getElementById(addPolicyModalId);
  modal.showModal();
}

async function addPolicy(policy) {
  if (policy == null) {
    resetAddPolicyData();
  }
  var request = {
    description: currentPolicy.value.description,
    identifier: currentPolicy.value.id,
    rules: [],
    title: currentPolicy.value.title,
  }
  const {data, error} = await API.addPolicyRequest(request)
  if (data.value) {
    resetAddPolicyData()
  } else if (error.value) {
    addPolicyLoadingFlag.value = false
    ///TODO:set alert for error in delete policy
  }
  await listInflowPolicyRequest()
}

function onSubmitAddPolicy() {
  if (!newPolicy.value) {
    return
  } else {
    addPolicyLoadingFlag.value = true
  }
  Object.assign(currentPolicy.value, newPolicy.value);
  addPolicy(currentPolicy.value);
}

function resetAddPolicyData() {
  showAddPolicyModalFlag.value = false
  addPolicyLoadingFlag.value = false
  const modal = document.getElementById(addPolicyModalId);
  modal.close();
}

function setInflowPolicyListProcessing(payload) {
  inflowPolicyListProcessing.value = payload
  fetchError.value = null
}

function clearFetchError() {
  fetchError.value = null
}

function setFetchError(payload) {
  fetchError.value = payload
  currentInflowPolicyList.value = []
  inflowPolicyProcessing.value = false
  inflowPolicyListProcessing.value = false
}

function setInflowPolicyList(payload) {
  currentInflowPolicyList.value = payload
  inflowPolicyListProcessing.value = false
  fetchError.value = null
}

async function listInflowPolicyRequest() {
  clearFetchError()
  setInflowPolicyListProcessing(true)
  const {data, error} = await API.listInflowPolicyRequest({...pageOptions.value})
  if (data.value) {
    let resp = JSON.parse(data.value).data
    pageOptions.value.count = resp.count
    pageOptions.value.totalPage = Math.ceil(resp.count / pageOptions.value.limit)
    setInflowPolicyList(resp.list)
  } else if (error.value) {
    setFetchError(error.value)
  }
  setInflowPolicyListProcessing(false)
}

function showInflow(data) {
  router.push({
    path: `/app/workflow/policy/policy-detail/${data.id}`
  });
}

const handlePageChange = (newPage) => {
  pageOptions.value.page = newPage
  listInflowPolicyRequest()
  scrollToTop()
};
const onLimitChange = (newLimit) => {
  pageOptions.value.page = 1
  pageOptions.value.limit = newLimit.value
  listInflowPolicyRequest()
  scrollToTop()
};


function confirmDeletePolicy(policy) {
  Object.assign(currentPolicy.value, policy);
  const modal = document.getElementById('confirmation_delete_policy');
  modal.showModal();
}

function cancelDeletePolicy() {
  Object.assign(currentPolicy.value, defaultPolicy);
}

function deletePolicy() {
  deletePolicyRequest(currentPolicy.value);
}

async function deletePolicyRequest(policy) {
  if (policy == null) {
    cancelDeletePolicy();
  }
  setInflowPolicyListProcessing(true)
  const {data, error} = await API.deletePolicyRequest(policy.id)
  if (data.value) {
    await listInflowPolicyRequest();
  } else if (error.value) {
    ///TODO:set alert for error in delete policy
  }
}

listInflowPolicyRequest()
</script>

<template>
  <div>

    <!--  modal of add policy  -->
    <AddPolicyModal
        :modalId="addPolicyModalId"
        :showAddPolicyModalFlag="showAddPolicyModalFlag"
        :newPolicy="newPolicy"
        :addPolicyLoadingFlag="addPolicyLoadingFlag"
        @resetAddPolicyData="resetAddPolicyData"
        @onSubmitAddPolicy="onSubmitAddPolicy"
    />
    <!--  modal of delete confirmation  -->
    <ConfirmationModal
        :accept="deletePolicy"
        :deny="cancelDeletePolicy"
        id="confirmation_delete_policy"
    >
      {{ $t('message.delete-policy-confirmation') }} {{ currentPolicy ? currentPolicy.title : '' }}?
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
          <BaseButton class="btn-primary text-white" size="xs" :onclick="showAddPolicyModal">
            <div class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                   stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"/>
              </svg>
              <span class="p-1">
                {{ $t("button.add-policy") }}
              </span>
            </div>
          </BaseButton>
        </div>
      </div>
      <div class="min-card-height-table">
        <BaseTable
            :is-loading="inflowPolicyListProcessing"
            :data="currentInflowPolicyList"
            :headers="tableHeaders"
        >
          <template v-slot:cell(status)="{data,index}">
            <BaseButton
                class="w-20 btn-xs text-xs btn-outline btn-success cursor-default"
                size="xs"
            >
               <span class="text-xs font-medium">
                {{ $t('table.active') }}
               </span>
            </BaseButton>
          </template>
          <template v-slot:cell(action)="{data,index}">
            <div class="flex gap-2">
              <BaseButton
                  size="xs"
                  @click="showInflow(data.item)"
                  class=" btn btn-outline tooltip"
                  :data-tip="$t('tooltip.view')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                </svg>
              </BaseButton>
              <BaseButton
                  size="xs"
                  @click="confirmDeletePolicy(data.item)"
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