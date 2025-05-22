<script setup>
import {defineProps, defineEmits, ref} from 'vue';
import Modal from "@/components/Modal.vue";
import {Form} from "vee-validate";
import TextInput from "@/components/TextInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import {object} from "yup";
import {useI18n} from "vue-i18n";
import validate from "@/composables/validate.js";
import TextareaInput from "@/components/TextareaInput.vue";
import {InflowNodeType} from "@/constants/vueflow.js";

const props = defineProps({
  node: Object,
  showUpdateHeaderModalFlag: Boolean,
  updateHeaderLoadingFlag: Boolean,
  modalId: {
    type: String,
    default: "update_header_modal",
  }
});
const {t: $t} = useI18n()
const emit = defineEmits(['close', 'onSubmitUpdateHeader']);
const updateHeaderSchemaValidation = object(
    validate(['title']),
);
const hasPath =props.node.nodeType !== InflowNodeType.RegularNode && props.node.nodeType !== InflowNodeType.GoToNode;
const path = ref("")
path.value = props.node.path.join('.')

const resetUpdateHeaderData = () => {
  emit('close');
};
const onSubmitUpdateHeader = () => {
  props.node.path = path.value.split('.').filter(v => v !== "")
  emit('onSubmitUpdateHeader');
};

</script>

<template>
  <Modal
      @close="resetUpdateHeaderData"
      :title="$t('modal.scope')"
      :id="modalId"
      :custom-style="'max-w-3xl text-start'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form :validation-schema="updateHeaderSchemaValidation" @submit="onSubmitUpdateHeader" class=""
            v-if="showUpdateHeaderModalFlag">
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2">
          <!--     for disable autocomplete     -->
          <input type="text" class="hidden"/>
          <!--     for disable autocomplete     -->
          <input type="password" class="hidden"/>
          <TextInput class="flex-grow"
                     :class="{'col-span-2':!hasPath}"
                     :label="$t('form.title')"
                     name="title"
                     :has-default-error-message="true"
                     v-model="node.title"/>
          <TextInput class="flex-grow"
                     v-if="hasPath"
                     :label="$t('form.point-path')"
                     name="slug"
                     :has-default-error-message="true"
                     v-model="path"/>
          <TextareaInput class="flex-grow col-span-2"
                         :label="$t('form.description')"
                         name="header_text"
                         :has-default-error-message="true"
                         v-model="node.description"/>
        </div>
        <div class="py-[6px]" v-if="updateHeaderLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton class="btn-outline btn-primary" size="xs" :onclick="modalId+'.close()'" type="button">
            {{ $t('button.cancel') }}
          </BaseButton>
          <BaseButton class="btn-primary text-white" size="xs" type="submit">
            {{ $t('button.save') }}
          </BaseButton>
        </div>
      </Form>
    </div>
  </Modal>
</template>

<style scoped>

</style>