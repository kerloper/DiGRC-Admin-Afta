<script setup>
import UpdateHeaderModal from "./UpdateHeaderModal.vue";
import {ref} from "vue";

const props = defineProps({
  node: {
    type: Object,
    default: null
  }
})
const emit = defineEmits(['clone'])
const updateHeaderModalId = 'update_header_modal'
const showUpdateHeaderModalFlag = ref(false)
const updateHeaderLoadingFlag = ref(false)
const temp = ref({})
const empty = {}

function onSubmitUpdateHeader() {
  props.node.title = temp.value.title
  props.node.description = temp.value.description
  props.node.path = temp.value.path
  resetUpdateHeaderData()
}

function resetUpdateHeaderData() {
  const modal = document.getElementById(updateHeaderModalId)
  modal.close()
  showUpdateHeaderModalFlag.value = false
  Object.assign(temp.value, empty)
}

function showUpdateHeaderModal() {
  Object.assign(temp.value, props.node)
  showUpdateHeaderModalFlag.value = true
  setTimeout(function () {
    const modal = document.getElementById(updateHeaderModalId);
    modal.showModal();
  }, 100)
}

function cloneNode() {
  emit('clone')
}

</script>

<template>
  <div>
    <div v-if="showUpdateHeaderModalFlag">
      <!--  modal of update header  -->
      <UpdateHeaderModal
          :modalId="updateHeaderModalId"
          :node="temp"
          :showUpdateHeaderModalFlag="showUpdateHeaderModalFlag"
          :updateHeaderLoadingFlag="updateHeaderLoadingFlag"
          @onSubmitUpdateHeader="onSubmitUpdateHeader"
          @close="resetUpdateHeaderData"
      />
    </div>
    <div class="flex flex-row border-b pb-2 border-primary">
      <div class="w-full">
        <div class="cursor-pointer" @click="showUpdateHeaderModal">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5"/>
          </svg>
        </div>
      </div>
      <div>
        <div class="cursor-pointer" @click="cloneNode">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>