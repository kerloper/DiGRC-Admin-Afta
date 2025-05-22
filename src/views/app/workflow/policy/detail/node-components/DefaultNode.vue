<script setup>
import {Handle, Position} from '@vue-flow/core'
import NodeBottom from "@/views/app/workflow/policy/detail/node-components/NodeBottom.vue";
import BaseCard from "@/components/BaseCard.vue";
import NodeHeader from "@/views/app/workflow/policy/detail/node-components/NodeHeader.vue";

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(["clone","showUpdateDetailModal"]);
function cloneNode() {
  emit('clone')
}

function showUpdateDetailModal() {
  emit('showUpdateDetailModal',props.node)
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
    <NodeHeader :node="node" @clone="cloneNode"/>
    <div class="text-center py-3">
      {{ node.title }}
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