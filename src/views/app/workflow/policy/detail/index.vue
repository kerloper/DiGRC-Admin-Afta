<script setup>
import {useRoute} from 'vue-router';
import BaseCard from "@/components/BaseCard.vue";
import API from "@/services/API.js";
import {onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import {MarkerType, useVueFlow, VueFlow} from "@vue-flow/core";
import {Controls} from "@vue-flow/controls";
import {Background} from "@vue-flow/background";
import CustomPanel from "./CustomPanel.vue";
import CustomNode from "./CustomNode.vue";
import DropzoneBackground from "./DropzoneBackground.vue";
import useDragAndDrop from "@/composables/dnd.js";
import SideBar from "./SideBar.vue";
import {InflowNodeType, rawRuleIFCondition, RouterIfNodeStyle} from "@/constants/vueflow.js";
import {useToast} from "vue-toastification";
import UpdatePolicyModal from "./UpdatePolicyModal.vue";
import TimeConfigurationModal from "@/components/Inflow/TimeConfigurationModal.vue";
import useClipboard from "vue-clipboard3";
import ImportPolicyModal from "./ImportPolicyModal.vue";
import {useScreenshot} from "@/composables/screenshot.ts";
import UpdateDetailModal from "@/views/app/workflow/policy/detail/node-components/UpdateDetailModal.vue";
import TemplateModal from "@/views/app/workflow/policy/detail/TemplateModal.vue";

const {toClipboard} = useClipboard();
const {t: $t} = useI18n()
const toast = useToast()
const route = useRoute()
const policyId = ref(route.params.policyId || null)
const isLoading = ref(true)
const templateModalId = 'template_modal_id'
const timeConfigurationModalId = 'time_configuration_modal'
const showTimeConfigurationModalFlag = ref(false)
const timeConfigurationLoadingFlag = ref(false)
const importPolicyModalId = 'import_policy_modal'
const showImportPolicyModalFlag = ref(false)
const importPolicyLoadingFlag = ref(false)
const updatePolicyModalId = 'update_policy_modal'
const showUpdatePolicyModalFlag = ref(false)
const updatePolicyLoadingFlag = ref(false)
const requestOptions = ref({
  policyId: policyId.value
})
const currentPolicy = ref({
  title: $t('title.undefined'),
  process_config: {
    http_req_ms_timeout: null,
    proc_second_timeout: null
  }
})
const tempPolicy = ref({
  title: null,
  description: null,
  id: null,
})
const processConfig = ref({
  http_req_ms_timeout: 6000,
  proc_second_timeout: 3600
})
const originalPolicy = ref({})
const policyDetailProcessing = ref(true)
const edgeType = ref("smoothstep")
const {
  setEdges,
  setNodes,
  findNode,
  getConnectedEdges,
  updateEdge,
  removeEdges,
  getEdges,
  onNodesChange,
  onConnect,
  addEdges,
  setViewport,
  toObject,
  addNodes,
  vueFlowRef,
  getNodes,
  getOutgoers,
} = useVueFlow()
const genId = function (salt = "") {
  return `i${salt}_node_${new Date().getTime() + Math.floor(Math.random() * 16)}`
}
const {capture} = useScreenshot();
const updateDetailModalId = 'update_detail_modal';
const temp = ref({})
const empty = {}
const updateDetailLoadingFlag = ref(false)
const showUpdateDetailModalFlag = ref(false)


function setInflowPolicyDetailProcessing(payload) {
  policyDetailProcessing.value = payload
}

function setInflowPolicyDetail(data) {
  if (data.edges) {
    data.edges.forEach(edge => {
      edge.type = "smoothstep"
    })
  }
  Object.assign(currentPolicy.value, data)
  Object.assign(originalPolicy.value, data)
}

async function policyDetailRequest() {
  setInflowPolicyDetailProcessing(true)
  const {data, error} = await API.detailPolicyRequest({...requestOptions.value})
  if (data.value) {
    setInflowPolicyDetail(JSON.parse(data.value).data)
    processApiResponse(currentPolicy.value);
  } else if (error.value) {
  }
  setInflowPolicyDetailProcessing(false)
}

async function screenshot() {
  if (!vueFlowRef.value) {
    console.warn('no any element on canvas');
    return;
  }
  await capture(vueFlowRef.value, {shouldDownload: true, type: 'png'});
}

function refreshData() {
  if (policyId.value) {
    Object.assign(currentPolicy.value, originalPolicy.value)
    policyDetailRequest()
  }
}

onMounted(() => {
  if (requestOptions.value.policyId) {
    policyDetailRequest()
  } else {
    setInflowPolicyDetailProcessing(false)
  }
})

const processApiResponse = (data) => {
  if (currentPolicy.value.nodes) {
    currentPolicy.value.nodes = data.nodes.map(node => ({
      ...node,
    }))
  }
  if (currentPolicy.value.edges) {
    currentPolicy.value.edges = data.edges.map(edge => ({
      ...edge,
      animated: true
    }))
  }
};

const {onDragOver, onDrop, onDragLeave, isDragOver} = useDragAndDrop()

onConnect((params) => {
  params.animated = true
  if (params.sourceHandle.slice(-3) === params.targetHandle.slice(-3)) return
  params.markerEnd = MarkerType.ArrowClosed
  params.type = edgeType.value
  addEdges(params)
})

function cloneNode(node) {
  const n = findNode(node.vfId)
  const newNodeId = genId("_c")
  const newNode = {
    id: newNodeId,
    label: `Node: ${newNodeId}`,
    type: 'custom',
    position: {x: n.computedPosition.x + 100, y: n.computedPosition.y + 100},
    data: JSON.parse(JSON.stringify(n.data))
  }
  newNode.data.vfId = newNodeId
  newNode.data.next = {policyId: "", rule: ""}
  newNode.data.title = "copy of " + n.data.title

  addNodes([newNode])
}

function onEdgeUpdate({edge, connection}) {
  if (connection.sourceHandle.slice(-3) === connection.targetHandle.slice(-3)) return
  return updateEdge(edge, connection)
}

// Function to change color of edges to green when a node is clicked
///TODO: set color for edges of node that clicked
function handleNodeClick(nodeId) {
  // currentPolicy.value.edges = currentPolicy.value.edges.map(edge => ({
  //   ...edge,
  //   style: {stroke: 'gray'}
  // }));
  // const node = findNode(nodeId); // Find the node by ID
  // if (!node) {
  //   return;
  // }
  // // Get the edges connected to the clicked node
  // const connectedEdges = getConnectedEdges([node], currentPolicy.value.edges);
  // if (connectedEdges.length > 0) {
  //   // Map over current edges to toggle only the connected edges
  //   const updatedEdges = currentPolicy.value.edges.map(edge => {
  //     // Check if the edge is connected to the clicked node
  //     if (connectedEdges.some(connectedEdge => connectedEdge.id === edge.id)) {
  //       // Toggle between green and the original color (if undefined, we assume black as default)
  //       const currentColor = edge.style?.stroke || 'gray'; // Default to black if no color is set
  //       const newColor = currentColor === 'gray' ? 'gray' : 'gray'; // Toggle between green and black
  //       return {
  //         ...edge,
  //         style: {stroke: newColor} // Update the stroke color
  //       };
  //     }
  //     return edge; // Keep other edges unchanged
  //   });
  //   setEdges(updatedEdges);
  // }
}

async function save() {
  try {
    let policy = diagramFlow()
    isLoading.value = true
    policy.process_config = currentPolicy.value.process_config
    policy = {
      ...policy, ...{
        title: currentPolicy.value.title,
        identifier: currentPolicy.value.identifier,
        description: currentPolicy.value.description
      }
    }
    const {data, error} = await API.addPolicyRequest(policy);
    if (data.value) {
      toast.success($t('message.update-policy-successful'), {
        timeout: 5000
      })
    }
    if (error.value) {
      toast.error(error.value.message, {
        timeout: 5000
      })
    }
  } catch (e) {

  } finally {
    isLoading.value = false
  }
}

Array.prototype.insert = function (index, ...items) {
  this.splice(index, 0, ...items);
};

function diagramFlow() {
  let ns = getNodes.value
  ns.map(v => {
    let out = getOutgoers(v.id)
    v.data.next = null
    if (v.data.proc_next?.rule === "") {
      v.data.proc_next = null
    }
    if (out.length === 1) {
      if (v.data.nodeType === InflowNodeType.RouterIFNode) {
        let nEdges = getConnectedEdges(v.data.vfId)
        nEdges.map(edge => {
          if (edge.sourceHandle.includes(v.id + "_out")) {
            v.data.proc_next = {policyId: "", rule: edge.targetNode.data.vfId}
          }
        })
      } else {
        v.data.next = {policyId: "", rule: out[0].id}
      }
    } else if (out.length === 2) {
      out.map(nextNode => {
        if (nextNode.data.nodeType === InflowNodeType.RouterIFNode) {
          v.data.next = {policyId: "", rule: nextNode.id}
        } else {
          let nEdges = getConnectedEdges(v.data.vfId)
          nEdges.map(edge => {
            if (edge.sourceHandle.includes("_else_out")) {
              v.data.next = {policyId: "", rule: edge.targetNode.data.vfId}
            } else if (edge.sourceHandle.includes(v.id + "_out")) {
              v.data.proc_next = {policyId: "", rule: edge.targetNode.data.vfId}
            }
          })
        }
      })
    } else {
      v.data.next = {policyId: "", rule: ""}
    }
  })
  let startNode = toObject().nodes.find(v => v.data.nodeType === InflowNodeType.StartNode)
  let {title, identifier, description} = currentPolicy
  let policy = {title, identifier, description, ...toObject()}
  policy.nodes = policy.nodes.filter(v => v.data.nodeType !== InflowNodeType.StartNode)

  if (startNode) {
    policy.nodes.insert(0, startNode)
  }
  return policy
}

function addNodeToParent(data) {
  let pNode = findNode(data.vfId)
  const nId = genId()
  const newNode = {
    id: nId,
    type: 'custom',
    label: `${nId} node`,
    parentNode: data.vfId,
    extent: 'parent',
    style: RouterIfNodeStyle,
    // data: { vfId: nId, nodeType: InflowNodeType.RouterIFNode }
    data: {
      ...rawRuleIFCondition,
      vfId: nId,
      nodeType: InflowNodeType.RouterIFNode,
      color: '#BEC23F',
      title: InflowNodeType.RouterIFNode
    }
  }

  let internalNodes = getNodes.value.filter(v => v.parentNode === data.vfId)
  const paramEdge = {
    source: internalNodes[internalNodes.length - 1].data.vfId,
    sourceHandle: internalNodes[internalNodes.length - 1].data.vfId + '_else_out',
    target: newNode.data.vfId,
    targetHandle: newNode.data.vfId + '_in',
    markerEnd: MarkerType.ArrowClosed
  }
  newNode.position = {
    x: internalNodes[internalNodes.length - 1].position.x,
    y: internalNodes[internalNodes.length - 1].position.y + 75
  }

  addNodes([newNode])
  let n = (Number(pNode.style.height.replace('px', ''))) + 75
  pNode.style.height = n + 'px'//(internalNodes[internalNodes.length-1].computedPosition.y+25)+'px'
  addEdges(paramEdge)

}

function edit() {
  Object.assign(tempPolicy.value, currentPolicy.value)
  showUpdatePolicyModal()
}

///start update policy methods
function showUpdatePolicyModal() {
  showUpdatePolicyModalFlag.value = true
  const modal = document.getElementById(updatePolicyModalId);
  modal.showModal();
}

function resetUpdatePolicyData() {
  //reset validation error message of update form
  showUpdatePolicyModalFlag.value = false
  updatePolicyLoadingFlag.value = false
  const modal = document.getElementById(updatePolicyModalId)
  modal.close()
}

function onSubmitUpdatePolicy() {
  if (!tempPolicy.value) {
    return
  } else {
    updatePolicyLoadingFlag.value = true
  }
  currentPolicy.value.title = tempPolicy.value.title
  currentPolicy.value.description = tempPolicy.value.description
  resetUpdatePolicyData()
}

///start import policy methods
async function importData() {
  showImportPolicyModal()
}

function showImportPolicyModal() {
  showImportPolicyModalFlag.value = true
  const modal = document.getElementById(importPolicyModalId);
  modal.showModal();
}

function resetImportPolicyData() {
  //reset validation error message of import form
  showImportPolicyModalFlag.value = false
  importPolicyLoadingFlag.value = false
  const modal = document.getElementById(importPolicyModalId)
  modal.close()
}

function onSubmitImportPolicy(jsonData) {
  if (!tempPolicy.value) {
    return
  } else {
    importPolicyLoadingFlag.value = true
  }
  try {
    let diag = JSON.parse(jsonData)
    OpenPolicy(diag)
  } catch (e) {
    toast.error($t('message.json-model-error'), {
      timeout: 5000
    })
  }
  resetImportPolicyData()
}

function OpenPolicy(flow) {
  try {
    if (flow) {
      const [x = 0, y = 0] = flow.position
      setNodes(flow.nodes)
      setEdges(flow.edges)
      setViewport({x, y, zoom: flow.zoom || 0})
    }
  } catch (e) {
    toast.error($t('message.data-model-error'), {
      timeout: 5000
    })
  }
}

///start time configuration methods
function timeConfiguration() {
  if (currentPolicy.value.process_config) {
    currentPolicy.value.process_config.http_req_ms_timeout =
        currentPolicy.value.process_config.http_req_ms_timeout > 0 ?
            currentPolicy.value.process_config.http_req_ms_timeout :
            6000
    currentPolicy.value.process_config.proc_second_timeout =
        currentPolicy.value.process_config.proc_second_timeout > 0 ?
            currentPolicy.value.process_config.proc_second_timeout :
            3600
    Object.assign(processConfig.value, currentPolicy.value.process_config)
  }
  showtimeConfigurationModal()
}

///start time configuration methods
function showtimeConfigurationModal() {
  showTimeConfigurationModalFlag.value = true
  setTimeout(function () {
    const modal = document.getElementById(timeConfigurationModalId);
    modal.showModal();
  }, 200)
}

function resetTimeConfigurationData() {
  //reset validation error message of import form
  showTimeConfigurationModalFlag.value = false
  timeConfigurationLoadingFlag.value = false
  const modal = document.getElementById(timeConfigurationModalId)
  modal.close()
}

function onSubmitTimeConfiguration() {
  if (!tempPolicy.value) {
    return
  } else {
    timeConfigurationLoadingFlag.value = true
  }
  Object.assign(
      currentPolicy.value.process_config,
      Object.fromEntries(
          Object.entries(processConfig.value).map(
              ([key, value]) => [key, Number(value)]
          )
      )
  )
  resetTimeConfigurationData()
}

async function exportData() {
  const diag = diagramFlow()
  const pack = (JSON.stringify(diag).replace(" ", ""))
  await toClipboard(pack);
  toast.success($t('message.export-data-successful'), {
    timeout: 5000
  })
}

onNodesChange(async (changes) => {
  for (const change of changes) {
    if (change.type === 'remove') {
      onRemoveNode(change.id)
    }
  }
})

function onRemoveNode(nodeId) {
  // Find all child nodes associated with the parent node
  const childNodes = getNodes.value.filter(node => node.parentNode === nodeId);

  // Get all node IDs (parent and child nodes) to be removed
  const nodeIdsToRemove = [nodeId, ...childNodes.map(childNode => childNode.id)];

  // Remove all associated edges
  const edgesToRemove = getEdges.value.filter(edge =>
      nodeIdsToRemove.includes(edge.source) || nodeIdsToRemove.includes(edge.target)
  );

  removeEdges(edgesToRemove.map(edge => edge.id));

  // Remove all child nodes
  childNodes.forEach(childNode => {
    removeNode(childNode.id);
  });

  // Remove the parent node itself
  removeNode(nodeId);

  // Check parent of node
  const currentNode = currentPolicy.value.nodes.find(node => node.id === nodeId);
  if (currentNode) {
    const comradeNodes = getNodes.value.filter(node => node.parentNode === currentNode.parentNode);
    if (comradeNodes.length === 0) {
      onRemoveNode(currentNode.parentNode)
    }
  }

}

function removeNode(nodeId) {
  // Use VueFlow's method to remove the node by id
  const index = getNodes.value.findIndex(node => node.id === nodeId);
  if (index !== -1) {
    getNodes.value.splice(index, 1);
  }
}

function resetUpdateDetailData() {
  const modal = document.getElementById(updateDetailModalId)
  modal.close()
  showUpdateDetailModalFlag.value = false
  Object.assign(temp.value, empty)
}

function showUpdateDetailModal(node) {
  temp.value = node


  if (node.nodeType === 'template') {
    showTemplate()
    return
  }
  showUpdateDetailModalFlag.value = true
  setTimeout(function () {
    const modal = document.getElementById(updateDetailModalId);
    modal.showModal();
  }, 100)
}

function closeTemplateModal() {
  document.getElementById(templateModalId).close()
  temp.value = null
}

function showTemplate() {
  document.getElementById(templateModalId).showModal()
}
</script>

<template>
  <div>
    <ImportPolicyModal
        :modalId="importPolicyModalId"
        :showImportPolicyModalFlag="showImportPolicyModalFlag"
        :tempPolicy="tempPolicy"
        :importPolicyLoadingFlag="importPolicyLoadingFlag"
        @resetImportPolicyData="resetImportPolicyData"
        @onSubmitImportPolicy="onSubmitImportPolicy"
    />

    <TemplateModal
        :modalId="templateModalId"
        :node="temp"
        @close="closeTemplateModal"
    />

    <UpdatePolicyModal
        :modalId="updatePolicyModalId"
        :showUpdatePolicyModalFlag="showUpdatePolicyModalFlag"
        :tempPolicy="tempPolicy"
        :updatePolicyLoadingFlag="updatePolicyLoadingFlag"
        @resetUpdatePolicyData="resetUpdatePolicyData"
        @onSubmitUpdatePolicy="onSubmitUpdatePolicy"
    />

    <div v-if="showTimeConfigurationModalFlag">
      <TimeConfigurationModal
          :modalId="timeConfigurationModalId"
          :showTimeConfigurationModalFlag="showTimeConfigurationModalFlag"
          :processConfig="processConfig"
          :updatePolicyLoadingFlag="timeConfigurationLoadingFlag"
          @resetTimeConfigurationData="resetTimeConfigurationData"
          @onSubmitTimeConfiguration="onSubmitTimeConfiguration"
      />
    </div>

    <BaseCard>
      <div class="flex justify-between border-b-2 pb-2">
        <div>
          <div class="skeleton my-2 h-2 w-28 rounded-full" v-if="policyDetailProcessing"></div>
          <div v-else>
             <span v-if="policyId">
                {{ currentPolicy.title }}
              </span>
            <hr v-if="currentPolicy.description"/>
            <span v-if="policyId" class="text-sm">
                {{ currentPolicy.description }}
              </span>
          </div>
        </div>
        <div class="flex gap-2">
        </div>
      </div>
      <div class="min-card-height-table">

        <progress class="progress progress-secondary w-full" v-show="policyDetailProcessing"
                  v-if="policyDetailProcessing"></progress>
        <div
            v-else class="w-full h-[70vh] dnd-flow" @drop.prevent="onDrop">
          <VueFlow
              delete-key-code="Delete"
              :edges-updatable="true"
              :nodes="currentPolicy.nodes"
              :edges="currentPolicy.edges"
              :fit-view="true"
              :default-viewport="{
                zoom: 0.2,
                 x: 300,
                 y: 0
              }"
              @edge-update="onEdgeUpdate"
              @dragover="onDragOver"
              @dragleave="onDragLeave"
          >
            <Background gap="8"/>
            <DropzoneBackground
                :style="{
                  backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
                  transition: 'background-color 0.2s ease',
                }"
            >
              <div v-if="isDragOver" class="w-full flex text-center items-center justify-center">
                <p>{{ $t('title.drag-here') }}</p>
              </div>
            </DropzoneBackground>
            <Controls position="bottom-right" class="controls">
            </Controls>
            <CustomPanel
                @refresh="refreshData"
                @save="save"
                @edit="edit"
                @screenshot="screenshot"
                @export-data="exportData"
                @import-data="importData"
                @time-configuration="timeConfiguration"
            />
            <SideBar/>

            <div v-if="showUpdateDetailModalFlag">
              <UpdateDetailModal
                  :modalId="updateDetailModalId"
                  :node="temp"
                  :showUpdateDetailModalFlag="showUpdateDetailModalFlag"
                  :updateDetailLoadingFlag="updateDetailLoadingFlag"
                  @close="resetUpdateDetailData"
              />
            </div>
            <template #node-custom="{ data }">
              <CustomNode
                  :node="data"
                  @clone="cloneNode"
                  @showUpdateDetailModal="showUpdateDetailModal"
                  @addNodeToParent="addNodeToParent"
                  @click="handleNodeClick(data.vfId)"
              />
            </template>
          </VueFlow>
        </div>
      </div>
    </BaseCard>

  </div>
</template>

<style>
.vue-flow__edges path {
  stroke-width: 5
}
</style>
<style scoped>
:deep(.vue-flow__panel) {
  @apply block mb-10
}

:deep(.vue-flow__node-custom ) {
  @apply bg-transparent
}

:deep(.vue-flow__node ) {
  @apply rounded-md border-2 border-primary
}

:deep(.vue-flow__controls-button ) {
  @apply bg-base-300 btn-primary border-none
}

.dnd-flow aside {
  color: #fff;
  font-weight: 700;
  border-right: 1px solid #eee;
  padding: 15px 10px;
  font-size: 12px;
  background: #10b981bf;
  -webkit-box-shadow: 0 5px 10px 0 rgba(0, 0, 0, .3);
  box-shadow: 0 5px 10px #0000004d
}

.dnd-flow aside .nodes > * {
  margin-bottom: 10px;
  cursor: grab;
  font-weight: 500;
  -webkit-box-shadow: 5px 5px 10px 2px rgba(0, 0, 0, .25);
  box-shadow: 5px 5px 10px 2px #00000040
}

.dnd-flow aside .description {
  margin-bottom: 10px
}

.dnd-flow .vue-flow-wrapper {
  flex-grow: 1;
  height: 100%
}

@media screen and (min-width: 640px) {
  .dnd-flow {
    flex-direction: row
  }

  .dnd-flow aside {
    min-width: 25%
  }
}

@media screen and (max-width: 639px) {
  .dnd-flow aside .nodes {
    display: flex;
    flex-direction: row;
    gap: 5px
  }
}

.dropzone-background {
  position: relative;
  height: 100%;
  width: 100%
}

.dropzone-background .overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  pointer-events: none
}

</style>