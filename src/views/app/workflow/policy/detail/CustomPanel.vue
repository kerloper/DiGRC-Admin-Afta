<script setup>
import {Panel} from "@vue-flow/core";
import BaseButton from "@/components/BaseButton.vue";

const emit = defineEmits(["refresh","save","edit","time-configuration","export-data","import-data","screenshot"]);

function refresh() {
  emit("refresh");
}

function save() {
  emit("save");
}

function importData() {
  emit("import-data");
}

function exportData() {
  emit("export-data");
}

function edit() {
  emit("edit");
}

function timeConfiguration() {
  emit("time-configuration");
}

function screenshot() {
  emit("screenshot");
}

</script>

<template>
  <Panel position="top-right" class="controls vue-flow__controls">
    <div class="bg-base-300 gap-4 px-2">
      <BaseButton size="xs" class="btn btn-outline tooltip tooltip-bottom border-none"
                  @click="refresh"
                  :data-tip="$t('tooltip.refresh')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
        </svg>
      </BaseButton>
      <BaseButton size="xs" class="btn btn-outline tooltip tooltip-bottom border-none"
                  @click="edit"
                  :data-tip="$t('tooltip.edit')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>

      </BaseButton>
      <BaseButton size="xs" class="btn btn-outline tooltip tooltip-bottom border-none"
                  @click="timeConfiguration"
                  :data-tip="$t('tooltip.time-config')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
        </svg>
      </BaseButton>
      <BaseButton size="xs" class="btn btn-outline tooltip tooltip-bottom border-none"
                  :data-tip="$t('tooltip.screenshot')"
                  @click="screenshot"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"/>
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"/>
        </svg>
      </BaseButton>
      <BaseButton size="xs" class="btn btn-outline tooltip tooltip-bottom border-none"
                  :data-tip="$t('tooltip.import')"
                  @click="importData"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
        </svg>
      </BaseButton>
      <BaseButton size="xs" class="btn btn-outline tooltip tooltip-bottom border-none"
                  :data-tip="$t('tooltip.export')"
                  @click="exportData"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"/>
        </svg>
      </BaseButton>
      <BaseButton size="xs" class="btn btn-outline tooltip tooltip-bottom border-none"
                  :data-tip="$t('tooltip.save')"
                  @click="save"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"/>
        </svg>
      </BaseButton>
    </div>
  </Panel>
</template>

<style scoped>
</style>