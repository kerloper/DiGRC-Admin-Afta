<script setup>
import {Handle, Position} from '@vue-flow/core'
import {computed} from 'vue'
import BaseCard from "@/components/BaseCard.vue";

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
})

const sourceHandler = computed(() => ({
  backgroundColor: props.node.color,
  filter: 'invert(100%)',
}))


</script>
<template>
  <div>
    <BaseCard class="rounded-full w-32 text-center">
      <div class="text-xs">
        Start
      </div>
    </BaseCard>
    <Handle :id="props.node.vfId+'_out'" type="source" :position="Position.Right" :style="sourceHandler"
            connectable="single"/>
  </div>
</template>

<style scoped>
.vue-flow__handle {
  height: 24px;
  width: 10px;
  background: #aaa;
  border-radius: 4px
}
</style>
