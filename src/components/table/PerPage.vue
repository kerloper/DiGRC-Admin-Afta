<script setup lang="ts">
import {defineProps, defineEmits, ref} from 'vue';
import DropDown from "@/components/DropDown.vue";
import { listSetting } from '@/constants/config';


const props = withDefaults(defineProps<{
  currentPage: number;
  totalPages: number;
  totalCount: number;
  perPage?: number;
  perPageOptions?: { key: number, value: string }[]
}>(), {
  perPage: listSetting.limit,
  perPageOptions: () => [
    {key: 10, value: "10"},
    {key: 20, value: "20"},
    {key: 50, value: "50"},
    {key: 100, value: "100"}
  ]
})


const emit = defineEmits<{
  (e: 'limit-change', {key: number, value: string}): void;
}>();


const limit = ref<number>(props.perPage);

const handleDropdownSelect = (selectedOption: { key: number; value: string }) => {
  if (limit.value !== selectedOption.key) {
    limit.value = selectedOption.key;
    emit('limit-change', selectedOption);
  }
};
</script>

<template>
  <div>
    <DropDown
        :options="perPageOptions"
        displayProperty="value"
        size="xs"
        @selectedOption="handleDropdownSelect"
    >
      {{ limit }}
    </DropDown>
    <span class="text-xs px-2" v-if="totalCount">
      {{
        ((currentPage - 1) * limit) + 1
      }} - {{
        Math.min(((currentPage - 1) * limit) + limit, totalCount)
      }} {{ $t('table.of') }} {{ totalCount }}
    </span>
  </div>
</template>

