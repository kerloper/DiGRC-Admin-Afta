<script setup>
import BaseButton from "@/components/BaseButton.vue";

const props = defineProps({
  node: {
    type: Object,
    default:null
  }
})
const emit = defineEmits(['clone'])
</script>

<template>
  <BaseButton type="button" class="btn-primary" size="xs">
    <div>
      {{ $t('button.detail') }}
    </div>
  </BaseButton>
</template>

<style scoped>

</style>