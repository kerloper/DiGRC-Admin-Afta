<template>
  <BaseButton type="submit" class="btn btn-primary btn-outline mt-6">{{ props.label }}</BaseButton>
</template>

<script setup>
import BaseButton from "@/components/BaseButton.vue";

defineProps({
  props: Object,
});
</script>