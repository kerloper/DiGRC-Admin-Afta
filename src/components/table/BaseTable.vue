<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface Header {
  key: string;
  label?: string;
}

interface DataItem {
  [key: string]: any;
}


const props = withDefaults(defineProps<{
  headers: Header[];
  data: DataItem[];
  isLoading?: boolean;
  headClass?:string;
  headRowClass?:string;
  bodyClass?:string;
  bodyRowClass?:string;
}>(), {
  isLoading: false,
})



const emit = defineEmits<{
  (e: 'on-row-clicked', payload: { item: DataItem; index: number }): void;
}>();

function onRowClicked(item: DataItem, index: number) {
  emit('on-row-clicked', { item, index });
}
</script>

<template>
  <div class=" ">
    <table class="table min-w-full">
      <thead :class="headClass">
      <tr>
        <th
            v-for="(header, i) in headers"
            :key="`${header.key}-${i}`"
            class="header-item text-start"
            :class="headRowClass"
        >
          <slot :name="`header(${header.key})`" :data="data">
            <span v-if="header.label">{{ $t(header.label) }}</span>
          </slot>
        </th>
      </tr>
      </thead>
      <tbody v-show="!isLoading" :class="bodyClass">
      <tr
          v-for="(item, index) in data"
          :key="`item-${index}`"
          class="table-rows text-start"
          :class="[bodyRowClass ? bodyRowClass(item) : '']"
          @click="onRowClicked(item, index)"
      >
        <td
            v-for="(header, i) in headers"
            :key="`${header.key}-${i}`"
        >
          <slot :name="`cell(${header.key})`" :data="{ item, index }">
            {{ item[header.key] }}
          </slot>
        </td>
      </tr>
      </tbody>
    </table>
    <progress class="progress progress-secondary w-full" v-show="isLoading"></progress>
  </div>
</template>

<style scoped>


</style>
