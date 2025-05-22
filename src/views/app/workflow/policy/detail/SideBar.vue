<script setup>
import {Panel} from "@vue-flow/core";
import BaseButton from "@/components/BaseButton.vue";
import useDragAndDrop from "@/composables/dnd.js";
import {InflowNodeType} from "@/constants/vueflow.js"
import API from "@/services/API.js";
import {computed, ref} from "vue";

const {onDragStart} = useDragAndDrop()
const emit = defineEmits(["refresh"]);
const {data, isFetching, execute} = API.contextLightList()
const templateList = ref(computed(() => data.value?.data|| []));


</script>

<template>
  <Panel position="top-left" class="controls vue-flow__controls">
    <div class="card bg-base-300 gap-4 py-2">
      <BaseButton size="xs" class="btn btn-outline tooltip tooltip-bottom border-none"
                  :data-tip="$t('tooltip.start')"
                  :draggable="true" @dragstart="onDragStart($event, InflowNodeType.StartNode)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
             class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/>
        </svg>
      </BaseButton>

      <BaseButton size="xs" class="btn btn-outline tooltip tooltip-bottom border-none"
                  :data-tip="$t('tooltip.policy')"
                  :draggable="true" @dragstart="onDragStart($event, InflowNodeType.RegularNode)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
             class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"/>
        </svg>
      </BaseButton>

      <BaseButton size="xs" class="btn btn-outline tooltip tooltip-bottom border-none"
                  :data-tip="$t('tooltip.router')"
                  :draggable="true" @dragstart="onDragStart($event, InflowNodeType.RouterNode)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
             class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/>
        </svg>
      </BaseButton>

      <BaseButton size="xs" class="btn btn-outline tooltip tooltip-bottom border-none"
                  :data-tip="$t('tooltip.rest-call')"
                  :draggable="true" @dragstart="onDragStart($event, InflowNodeType.RestCallNode)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
             class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
        </svg>
      </BaseButton>

      <BaseButton size="xs" class="btn btn-outline tooltip tooltip-bottom border-none"
                  :data-tip="$t('tooltip.go-to')"
                  :draggable="true" @dragstart="onDragStart($event, InflowNodeType.GoToNode)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
             class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"/>
        </svg>
      </BaseButton>

      <BaseButton size="xs" class="btn btn-outline tooltip tooltip-bottom border-none"
                  :data-tip="$t('tooltip.js-code')"
                  :draggable="true" @dragstart="onDragStart($event, InflowNodeType.JsCodeNode)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
             class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"/>
        </svg>
      </BaseButton>

      <div class="border-b-2 border-gray-200 mx-0.5">
      </div>

      <div class="text-center" v-show="isFetching" >
        <span class="loading loading-spinner text-primary"></span>
      </div>
      <BaseButton size="xs" class="btn btn-outline tooltip tooltip-bottom border-none" v-for="template in templateList"
                  :data-tip="template.title"
                  :draggable="true" @dragstart="onDragStart($event, 'template',template)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
             class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"/>
        </svg>
      </BaseButton>


    </div>
  </Panel>
</template>

<style scoped>
:deep(.vue-flow__controls) {
  @apply flex
}

:deep(.vue-flow__node-custom ) {
  @apply bg-transparent
}

:deep(.vue-flow__node ) {
  @apply rounded-md border-2 border-primary
}
</style>