<script setup>

import {ref} from "vue";
import BaseTable from "@/components/table/BaseTable.vue";
import {useI18n} from "vue-i18n";
import API from "@/services/API.js";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import BaseCountdown from "@/components/BaseCountdown.vue";
import Modal from "@/components/Modal.vue";
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import {listSetting} from "@/constants/config.js";

const {t: $t} = useI18n()
const cacheListProcessing = ref(false)
const cacheProcessing = ref(false)
const fetchError = ref(false)
const currentCacheList = ref([])
const detailCache = ref({})
const detailCacheLoadingFlag = ref(true)
//for handle validation error in filter caches list
const tableHeaders = [
  {label: "table.key", key: "key"},
  {label: "table.status", key: "status"},
  {label: "table.ttl", key: "ttl"},
  {label: "table.action", key: "action"}
]
const pageOptions = ref({
  limit: listSetting.limit,
  page: 1,
  count: 0,
  totalPage: 1,
})
//for handle validation error in update cache
const limit = ref(1000)
const page = ref(1)
const showDataModalFlag = ref(false)
const currentCache = ref({})
const defaultCache = ref({})

function setCacheListProcessing(payload) {
  cacheListProcessing.value = payload
  fetchError.value = null
}

function clearFetchError() {
  fetchError.value = null
}

function setFetchError(payload) {
  fetchError.value = payload
  currentCacheList.value = []
  Object.assign(currentCache.value, defaultCache.value);
  cacheProcessing.value = false
  cacheListProcessing.value = false
}

function setCacheList(payload) {
  currentCacheList.value = payload
  cacheListProcessing.value = false
  fetchError.value = null
}

async function listCacheRequest() {
  clearFetchError()
  setCacheListProcessing(true)
  const {data, error} = await API.listCacheRequest({...pageOptions})
  if (data.value) {
    setCacheList(data.value.data.list)
  } else if (error.value) {
    setFetchError(error.value)
  }
  setCacheListProcessing(false)
}

async function detailCacheRequest() {
  const request = {
    "key": currentCache.value.key,
  }
  const {data, error} = await API.detailCacheRequest(JSON.stringify(request))
  if (data.value) {
    detailCache.value = data.value.data
    detailCacheLoadingFlag.value = false
  } else if (error.value) {
  }
  detailCacheLoadingFlag.value = false
}

function confirmDeleteCache(cache) {
  Object.assign(currentCache.value, cache);
  const modal = document.getElementById('confirmation_delete_cache');
  modal.showModal();
}

function cancelDeleteCache() {
  Object.assign(currentCache.value, defaultCache);
}

function deleteCache() {
  deleteCacheRequest(currentCache.value);
}

async function deleteCacheRequest(cache) {
  if (cache == null) {
    cancelDeleteCache();
  }
  setCacheListProcessing(true)
  const {data, error} = await API.deleteCacheRequest(JSON.stringify({"key": cache.key}))
  if (data.value) {
    await listCacheRequest();
  } else if (error.value) {
    ///TODO:set alert for error in delete cache
  }
}

function confirmPersistCache(cache) {
  Object.assign(currentCache.value, cache);
  const modal = document.getElementById('confirmation_persist_cache');
  modal.showModal();
}

function cancelPersistCache() {
  Object.assign(currentCache.value, defaultCache);
}

function persistCache() {
  persistCacheRequest(currentCache.value);
}

async function persistCacheRequest(cache) {
  if (cache == null) {
    cancelDeleteCache();
  }
  setCacheListProcessing(true)
  const {data, error} = await API.persistCacheRequest(JSON.stringify({"key": cache.key}))
  if (data.value) {
    await listCacheRequest();
  } else if (error.value) {
    ///TODO:set alert for error in delete cache
  }
}

function showDataModal(data) {
  detailCacheLoadingFlag.value = true
  Object.assign(currentCache.value, data)
  detailCacheRequest()
  showDataModalFlag.value = true
  const modal = document.getElementById('cache_data_modal');
  modal.showModal();
}

function resetDetailData() {
  detailCache.value = {}
  currentCache.value = {}
}

listCacheRequest()

</script>

<template>
  <div>

    <!--  modal of persist confirmation  -->
    <ConfirmationModal
        :accept="persistCache"
        :deny="cancelPersistCache"
        id="confirmation_persist_cache"
    >
      {{ $t('message.persist-cache-confirmation') }} {{ currentCache ? currentCache.key : '' }}?
    </ConfirmationModal>

    <!--  modal of delete confirmation  -->
    <ConfirmationModal
        :accept="deleteCache"
        :deny="cancelDeleteCache"
        id="confirmation_delete_cache"
    >
      {{ $t('message.delete-cache-confirmation') }} {{ currentCache ? currentCache.key : '' }}?
    </ConfirmationModal>

    <!--  modal of show cache data  -->
    <Modal
        @close="resetDetailData"
        :title="currentCache?currentCache.key:$t('modal.cache')"
        id="cache_data_modal"
        :custom-style="'max-w-2xl'"
        :close-btn="false"
        :close-backdrop="true"
        :close-icon="true"
    >

      <div>
        <div class="overflow-auto h-96">
          <vue-json-pretty :data="detailCache" v-if="!detailCacheLoadingFlag" dir="ltr"/>
          <progress v-else class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2">
          <BaseButton class="btn-outline btn-primary text-white" size="xs" onclick="cache_data_modal.close()"
                      type="button">
            {{ $t('button.cancel') }}
          </BaseButton>
        </div>
      </div>
    </Modal>


    <BaseCard>
      <div class="flex justify-between border-b-2 pb-2">
        <div class="flex gap-2">
        </div>
      </div>
      <div class="min-card-height-table">
        <BaseTable
            :is-loading="cacheListProcessing"
            :data="currentCacheList"
            :headers="tableHeaders"
        >
          <template v-slot:cell(ttl)="{data,index}">
            <BaseCountdown :ttl="data.item.ttl" v-if="data.item.ttl>0"/>
            <strong v-else>
              -
            </strong>
          </template>
          <template v-slot:cell(action)="{data,index}">
            <div class="flex gap-2">
              <BaseButton
                  size="xs"
                  @click="showDataModal(data.item)"
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
              <BaseButton
                  size="xs"
                  @click="confirmPersistCache(data.item)"
                  class="bg-gray-600 hover:bg-gray-800 text-white tooltip"
                  :data-tip="$t('tooltip.persist')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
              </BaseButton>
              <BaseButton
                  size="xs"
                  @click="confirmDeleteCache(data.item)"
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