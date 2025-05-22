<script setup>
import {Handle, Position} from '@vue-flow/core'
import {ref, computed} from 'vue'
import {useI18n} from "vue-i18n";
import NodeHeader from "@/views/app/workflow/policy/detail/node-components/NodeHeader.vue";
import NodeBottom from "@/views/app/workflow/policy/detail/node-components/NodeBottom.vue";
import BaseCard from "@/components/BaseCard.vue";
import RouterNodeIfHeader from "@/views/app/workflow/policy/detail/node-components/RouterNodeIfHeader.vue";
import UpdateDetailModal from "@/views/app/workflow/policy/detail/node-components/UpdateDetailModal.vue";

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
})
const targetHandler = ((node) => ({
  backgroundColor: node.color,
  filter: 'invert(100%)',
  bottom: '10px',
  top: 'auto',
}))
const emit = defineEmits(["showUpdateDetailModal"]);

function showUpdateDetailModal() {
  emit('showUpdateDetailModal',props.node)
}

</script>
<template>
  <div
      class="min-w-52 text-center"
  >
    <RouterNodeIfHeader :node="node" @showUpdateDetailModal="showUpdateDetailModal"/>
    <Handle :id="node.vfId + '_out'" type="source" :position="Position.Right" :style="targetHandler(node)"
            connectable="single"/>
    <Handle :id="node.vfId + '_in'" type="target" :position="Position.Top"/>
    <Handle :id="node.vfId + '_else_out'" type="source" :position="Position.Bottom" connectable="single"/>
    {{ node.title }}
  </div>
</template>

<style scoped>
.vue-flow__handle {
  height:10px;
  width:24px;
  background:#aaa;
  border-radius:4px
}
</style>