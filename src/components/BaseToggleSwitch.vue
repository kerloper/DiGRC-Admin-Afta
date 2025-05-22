<script setup lang="ts">
import { defineProps, defineEmits,ref } from 'vue';
const props = withDefaults(defineProps<{
  isLoading?: boolean;
  toggleActive?: boolean;
  label?:string;
  prefixLabel?:string;
  suffixLabel?:string;
}>(), {
  toggleActive: false,
  isLoading: false,
  label: null,
  prefixLabel: null,
  suffixLabel: null,
})
const emit = defineEmits(['toggleAction']);
const toggleAction = () => {
  emit('toggleAction');
};
</script>

<template>
  <div>
    <span class="label-text ms-0.5" v-if="label">{{ label }}</span>
    <div class="flex">
      <div class="m-2 ms-0 min-w-20" :class="{'text-gray-300':toggleActive}" v-if="prefixLabel">
        {{prefixLabel}}
      </div>
      <div class="w-10 h-5 mt-3 flex items-center rounded-full p-1 duration-300 ease-in-out cursor-pointer"
           :class="{ 'bg-primary': toggleActive , 'bg-gray-300': !toggleActive}"
           @click="toggleAction()"
      >
        <div class="bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out" :class="{ 'translate-x-4': toggleActive,}"></div>
      </div>
      <div class="m-2 min-w-20" :class="{'text-gray-300':!toggleActive}" v-if="suffixLabel">
        {{suffixLabel}}
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>