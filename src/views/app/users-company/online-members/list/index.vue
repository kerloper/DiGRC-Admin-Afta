<script setup>

import {computed, ref, watch} from "vue";
import BaseTable from "@/components/table/BaseTable.vue";
import {useI18n} from "vue-i18n";
import API from "@/services/API.js";
import BaseCard from "@/components/BaseCard.vue";
import BaseButton from "@/components/BaseButton.vue";
import DropDown from "@/components/DropDown.vue";

const {t: $t} = useI18n()
const tableHeaders = [
  {label: "table.id", key: "id"},
  {label: "table.name", key: "name"},
  {label: "table.email", key: "email"},
  {label: "table.time-created", key: "time_created_view"},
  {label: "table.sessions-count", key: "sessions_count"},
  {label: "", key: "action"}
]
const {data,isFetching , execute} = API.onlineMembers()
const currentMemberList = computed(()=>data?.value?.data||[])

async function terminate(session) {
  isFetching.value = true
  const {isFetching: update} = await API.terminateMembers({user_id: session.id, token_id: session.token_id})
  isFetching.value = update
  execute()
}

</script>

<template>
  <div>

    <BaseCard>
      <div class="flex justify-between">
        <div>
        </div>
        <div class="flex gap-2">
        </div>
      </div>
      <div class="min-card-height-table">
        <BaseTable
            :data="currentMemberList"
            :is-loading="isFetching"
            :headers="tableHeaders"
        >
          <template v-slot:cell(action)="{data,index}">
            <div class="flex justify-end">
              <DropDown class="dropdown-end" size="xs" content-width="w-96">
                <span>
                  {{$t('button.action')}}
                </span>
                <template #actions>
                  <li class="my-1 flex flex-col gap-1" v-for="session in data.item.sessions">
                    <div class="flex flex-row gap-2">
                      <div class="w-56">
                        IP: {{session.ip}}
                      </div>
                      <div class="w-full">
                        {{session.last_active_view}}
                      </div>
                      <div class="">
                        <BaseButton class="btn btn-outline tooltip" size="xs" :data-tip="$t('tooltip.terminate-session')" @click="terminate(session)">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.181 8.68a4.503 4.503 0 0 1 1.903 6.405m-9.768-2.782L3.56 14.06a4.5 4.5 0 0 0 6.364 6.365l3.129-3.129m5.614-5.615 1.757-1.757a4.5 4.5 0 0 0-6.364-6.365l-4.5 4.5c-.258.26-.479.541-.661.84m1.903 6.405a4.495 4.495 0 0 1-1.242-.88 4.483 4.483 0 0 1-1.062-1.683m6.587 2.345 5.907 5.907m-5.907-5.907L8.898 8.898M2.991 2.99 8.898 8.9" />
                          </svg>
                        </BaseButton>
                      </div>
                    </div>
                  </li>
                </template>
              </DropDown>
            </div>
          </template>
        </BaseTable>
      </div>
      <template v-slot:actions>

      </template>
    </BaseCard>
  </div>
</template>

<style scoped>

</style>