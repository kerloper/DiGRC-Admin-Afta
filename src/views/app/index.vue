<script setup>

import AppLayout from "@/layouts/AppLayout.vue";

</script>

<template>
  <AppLayout>
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component"/>
      </Transition>
    </RouterView>
  </AppLayout>
</template>

<style scoped>

</style>