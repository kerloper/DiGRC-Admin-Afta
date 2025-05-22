<script setup>

defineProps({
  title: {
    type: String,
    default: ''
  },
  accept: {
    type: Function,
    required:true
  },
  deny: {
    type: Function,
    required:true
  },
})

</script>

<template>
  <dialog class="modal">
    <div class="modal-box overflow-visible rounded-md">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute end-2 top-2">✕</button>
      </form>
      <h3 class="font-bold text-lg mb-2  ">{{ title }}</h3>
      <main>
        <slot></slot>
      </main>
      <form method="dialog" class="flex gap-2 justify-end mt-6"  >
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn px-2 btn-xs text-xs btn-primary btn-outline text-white" @click="deny">{{$t('button.cancel')}}</button>
        <button class="btn px-2 btn-xs text-xs btn-primary text-white" @click="accept">{{$t('button.accept')}}</button>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button  >close</button>
    </form>
  </dialog>
</template>

<style scoped>

</style>