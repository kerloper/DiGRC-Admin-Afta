<script setup>
import {useRouter} from "vue-router";
import {adminRoot, topNavItemsKey} from "@/constants/config.js";
import {useStorage} from "@vueuse/core";

const  router = useRouter()
const goBack = () => router.push(adminRoot)
const defaultValue = {
  id: '',
  label: '',
  roles: [],
  subs: [],
  to: '',
}
const topNavItems = useStorage(topNavItemsKey, defaultValue)
topNavItems.value = defaultValue
</script>

<template>
  <div>
    <div class="flex justify-center items-center w-full user-background">
      <div class="card glass">
        <div class="card-body text-white">
          <h2 class="card-title">{{ $t("pages.error-title") }} </h2>
          <p></p>
          <div class="card-actions justify-center">
            <button class="btn btn-primary" @click="goBack">{{ $t("pages.go-back-home") }}</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>