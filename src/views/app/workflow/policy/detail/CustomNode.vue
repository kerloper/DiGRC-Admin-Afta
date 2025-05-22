<script setup>
import StartNode from "@/views/app/workflow/policy/detail/node-components/StartNode.vue";
import DefaultNode from "@/views/app/workflow/policy/detail/node-components/DefaultNode.vue";
import RouterNodeIf from "@/views/app/workflow/policy/detail/node-components/RouterNodeIf.vue";
import RouterNodeType from "@/views/app/workflow/policy/detail/node-components/RouterNodeType.vue";
import {computed} from "vue";
import {InflowNodeType} from "@/constants/vueflow.js"
import TemplateNodeType from "@/views/app/workflow/policy/detail/node-components/TemplateNodeType.vue";

const props = defineProps({
  node: {type: Object, required: true},
})
const emit = defineEmits(["clone","showUpdateDetailModal"]);
const defaultOwner = ['regularNodeType', 'restNodeType', 'gotoNodeType', 'jsNodeType','template']

const currentComponent = computed(() => {
  switch (props.node.nodeType) {
    case InflowNodeType.StartNode:
      return StartNode;
    case InflowNodeType.RouterIFNode:
      return RouterNodeIf;
    case InflowNodeType.RouterNode:
      return RouterNodeType;
    case InflowNodeType.Template:
      return TemplateNodeType;
    default:
      return defaultOwner.includes(props.node.nodeType) ? DefaultNode : null;
  }
})

function cloneNode() {
  emit('clone', props.node)
}

function cloneRouter() {
  emit('addNodeToParent',props.node )
}

function showUpdateDetailModal() {
  emit('showUpdateDetailModal',props.node)
}
</script>

<template>
  <component
      v-if="currentComponent"
      :is="currentComponent"
      :node="node"
      @clone="cloneNode"
      @showUpdateDetailModal="showUpdateDetailModal"
      @cloneRouter="cloneRouter"
  />
</template>

<style scoped>

</style>