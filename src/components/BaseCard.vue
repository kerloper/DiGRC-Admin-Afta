<script setup>

defineProps({
  title: String,
  noPadding: {
    type: Boolean,
    default: false,
  },
  cardClass: String
})
</script>

<template>
  <div class="card bg-base-300 rounded-md shadow-xl static">
    <div class="card-body px-4"
         :class="[{'pb-2':!noPadding,'pt-3':title && !noPadding,'pt-2':!title && !noPadding , 'p-0':noPadding},cardClass]">
      <h2 class="text-sm lg:text-base">{{ title }}</h2>
      <slot></slot>
      <div class="card-actions justify-end">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>