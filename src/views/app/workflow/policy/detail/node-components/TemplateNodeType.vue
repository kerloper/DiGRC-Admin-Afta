<script setup>
import {Handle, Position} from '@vue-flow/core'
import NodeBottom from "@/views/app/workflow/policy/detail/node-components/NodeBottom.vue";
import BaseCard from "@/components/BaseCard.vue";

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(["clone", "showUpdateDetailModal"]);

function showUpdateDetailModal() {
  emit('showUpdateDetailModal', props.node)
}

</script>
<template>
  <BaseCard
      class="min-w-52 text-center"
  >
    <Handle
        :id="node.vfId + '_out'" type="source"
        :position="Position.Right"
        connectable="single"/>
    <Handle
        :id="node.vfId + '_in'"
        type="target"
        :position="Position.Left"/>
    <div class="text-center flex flex-row py-3" v-if="node">
      <div class="w-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
             class="text-primary size-6">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"/>
        </svg>
      </div>
      <div class="w-full text-start ">
        {{ (node.data.title) }}
      </div>
    </div>
    <NodeBottom :node="node" @click="showUpdateDetailModal"/>
  </BaseCard>
</template>

<style scoped>
.vue-flow__handle {
  height: 24px;
  width: 10px;
  background: #aaa;
  border-radius: 4px
}
</style>