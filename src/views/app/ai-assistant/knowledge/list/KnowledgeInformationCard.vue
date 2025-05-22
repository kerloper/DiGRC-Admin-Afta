<script setup>
import {useConvertTimestamp} from "@/composables/convert-timestamp.js";

const {getTimestamp} = useConvertTimestamp();
const props = defineProps({
  knowledge: {type: Object, default: null},
})

</script>

<template>
  <div v-if="knowledge">
    <div class="">
      <div class="flex flex-row mb-1">
        <div class="w-44 font-bold text-xs text-end flex flex-row gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"/>
          </svg>
          <div class="mt-0.5 cursor-default text-xs font-semibold ">
            {{ knowledge.meta?.bucket }}
          </div>
        </div>
        <div class="w-full text-xs font-semibold text-end pe-1">
          {{ getTimestamp(knowledge.createdAt) }}
        </div>
      </div>
      <div v-if="knowledge?.libraries?.length > 0">
        <div class="overflow-y-auto border border-gray-200 rounded-md mb-8">
          <table class="table text-xs">
            <thead>
            <tr>
              <th class="w-full">
                {{ $t("table.lib-id") }}
              </th>
              <th>
                {{ $t("table.process") }}
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(library, index) in knowledge.libraries" :key="index">
              <td>{{ library.libId }}</td>
              <td
                  :class="{
                      'text-success':library.process==='completed',
                      'text-secondary':library.process==='inProgress',
                      'text-yellow-500':library.process==='pending',
                      'text-red-800':library.process==='failed',
                  }"
                  class="min-w-28 text-xs font-semibold">{{ $t(`tooltip.${library.process}`) }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else>
        <div class="py-2 text-base font-semibold text-gray-500">
          <span>
            {{$t("message.not-added-to-any-library")}} !
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
