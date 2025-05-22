<script setup>
import {defineProps, defineEmits, ref, computed} from 'vue';
import Modal from "@/components/Modal.vue";
import {useI18n} from "vue-i18n";
import {InflowNodeType} from "@/constants/vueflow.js";
import ExtrinsicForm from "@/views/app/workflow/policy/detail/node-components/forms/ExtrinsicForm.vue";
import JSCodeForm from "@/views/app/workflow/policy/detail/node-components/forms/JSCodeForm.vue";
import GoToForm from "@/views/app/workflow/policy/detail/node-components/forms/GoToForm.vue";
import ReqularNodeForm from "@/views/app/workflow/policy/detail/node-components/forms/ReqularNodeForm.vue";
import RouterIfNodeForm from "@/views/app/workflow/policy/detail/node-components/forms/RouterIfNodeForm.vue";

const props = defineProps({
  node: Object,
  showUpdateDetailModalFlag: Boolean,
  updateDetailLoadingFlag: Boolean,
  modalId: {
    type: String,
    default: "update_detail_modal",
  }
});

const {t: $t} = useI18n()
const emit = defineEmits(['close', 'onSubmitUpdateDetail']);
const path = ref("")
path.value = props.node.path.join('.')

const resetUpdateDetailData = () => {
  emit('close');
}

const modalTitle = computed(() => {
  switch (props.node.nodeType) {
    case InflowNodeType.RestCallNode:
      return $t('modal.extrinsic')
  }
})

</script>

<template>
  <Modal
      @close="resetUpdateDetailData"
      :title="modalTitle"
      :id="modalId"
      :custom-style="'max-w-3xl text-start'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div class="max-h-[70vh] overflow-y-auto overflow-x-hidden z-50">
      <ExtrinsicForm :node="node" :modalId="modalId" v-if="node.nodeType === InflowNodeType.RestCallNode"/>
      <JSCodeForm :node="node" :modalId="modalId" v-if="node.nodeType === InflowNodeType.JsCodeNode"/>
      <GoToForm :node="node" :modalId="modalId" v-if="node.nodeType === InflowNodeType.GoToNode"/>
      <ReqularNodeForm :node="node" :modalId="modalId" v-if="node.nodeType === InflowNodeType.RegularNode"/>
      <RouterIfNodeForm :node="node" :modalId="modalId" v-if="node.nodeType === InflowNodeType.RouterIFNode"/>
    </div>
  </Modal>
</template>

<style scoped>

</style>