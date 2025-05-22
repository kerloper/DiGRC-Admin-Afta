<script setup>
import Modal from "@/components/Modal.vue";
import TextInput from "@/components/TextInput.vue";
import {object} from "yup";
import VSelect from "@/components/VSelect.vue";
import BaseButton from "@/components/BaseButton.vue";
import {useI18n} from "vue-i18n";
import {Form} from "vee-validate";
import validate from "@/composables/validate.js";
import TextareaInput from "@/components/TextareaInput.vue";
import {onMounted, ref, toRef, watch} from "vue";

const props = defineProps({
  showUpdateImprovementModalFlag: Boolean,
  currentImprovement: Object,
  statusList: Array,
  frameworkList: Array,
  domainList: Array,
  controlList: Array,
  updateImprovementLoadingFlag: Boolean,
  modalId: {
    type: String,
    default: "update_improvement_company_modal",
  }
});

const validationList = ref([])
const {t: $t} = useI18n()
const emit = defineEmits(['resetUpdateImprovementData', 'onSubmitUpdateImprovement']);
//for handle validation error in update improvementCompany
const updateImprovementSchemaValidation = ref(
    object(
        validate(validationList.value)
    )
)
const tabIndex = ref(0)
const statements = ref([])
const domainListFiltered = ref([])
const controlListFiltered = ref([])
const resetUpdateImprovementData = () => {
  emit('resetUpdateImprovementData');
};

function onSubmitUpdateImprovement() {
  emit('onSubmitUpdateImprovement');
}
function setValidationObjects(){
  validationList.value = ['domain', 'framework', 'control', 'title' ,'statement0','statement1','statement2','statement3' ,...validationList.value]
  updateImprovementSchemaValidation.value = object(
      validate(validationList.value)
  )
}

const frameworkRef = toRef(props.currentImprovement, 'framework');
const domainRef = toRef(props.currentImprovement, 'domain');

watch(domainRef, (currentValue) => {
  if (currentValue) {
    props.currentImprovement.control = null
    controlListFiltered.value = props.controlList.filter(control => {
      return control.domain_id === currentValue.id
    });
  }
});
watch(frameworkRef, (currentValue) => {
  if (currentValue) {
    props.currentImprovement.domain = null
    domainListFiltered.value = props.domainList.filter(domain => {
      return domain.framework_id === currentValue.id
    });
  }
});

onMounted(() => {
  setValidationObjects()
})

</script>

<template>
  <Modal
      @close="resetUpdateImprovementData"
      :title="$t('modal.update-improvement')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div class=" max-h-[70vh] overflow-y-auto overflow-x-hidden">
      <Form :validation-schema="updateImprovementSchemaValidation" @submit="onSubmitUpdateImprovement" v-if="showUpdateImprovementModalFlag">

        <div class="tabs tabs-bordered w-full mb-4">
          <input
              type="radio"
              name="my_tabs_1"
              role="tab"
              class="tab tab-lifted w-full"
              :aria-label="$t('title.information')"
              checked="checked"
              @click="tabIndex=0"
          />
          <input
              type="radio"
              name="my_tabs_1"
              role="tab"
              class="tab tab-lifted w-full"
              :aria-label="$t('title.statement')"
              @click="tabIndex=1"
          />

        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2" :class="{'hidden':tabIndex===1}">
          <VSelect class="col-span-1"
                   v-model="currentImprovement.framework"
                   name="framework"
                   deselect-label=""
                   :is-multiple="false"
                   track-by="name"
                   tracked-by="id"
                   :track-by="'id'"
                   :id="'id'"
                   :has-default-error-message="true"
                   :title="$t('form.framework')"
                   label="title"
                   :placeholder="''"
                   :options="frameworkList"
                   :searchable="false"
                   :allow-empty="false"
                   :is-preselect-first="false"
          />
          <VSelect class="col-span-1"
                   v-model="currentImprovement.domain"
                   name="domain"
                   track-by="name"
                   tracked-by="id"
                   :id="'id'"
                   :has-default-error-message="true"
                   deselect-label=""
                   :is-multiple="false"
                   :title="$t('form.domain')"
                   label="title"
                   :is-disabled="!currentImprovement.framework"
                   :placeholder="''"
                   :options="domainListFiltered"
                   :searchable="false"
                   :allow-empty="false"
                   :is-preselect-first="false"
          />
          <VSelect class="col-span-2"
                   v-model="currentImprovement.control"
                   name="control"
                   track-by="name"
                   tracked-by="id"
                   :id="'id'"
                   :has-default-error-message="true"
                   deselect-label=""
                   :is-multiple="false"
                   :title="$t('form.control')"
                   label="title"
                   :is-disabled="!currentImprovement.domain"
                   :placeholder="''"
                   :options="controlListFiltered"
                   :searchable="false"
                   :allow-empty="false"
                   :is-preselect-first="false"
          />
          <TextInput class="flex-grow col-span-2"
                     :label="$t('form.title')"
                     name="title"
                     :has-default-error-message="true"
                     v-model="currentImprovement.title"/>
        </div>
        <div class="grid md:grid-cols-1 lg:grid-cols-1 grid-cols-1" :class="{'hidden':tabIndex===0}">
          <div class="grid grid-cols-1 overflow-y-auto max-h-[500px] gap-2 p-1">
            <TextInput class="flex-grow relative"
                       v-for="(statement,index) in currentImprovement.remediation_tasks" :key="index"
                       :label="$t('form.title')"
                       :custom-class="(index=== statements.length-1)?'pe-10':'pe-4'"
                       :name="'statement'+(index)"
                       :has-default-error-message="true"
                       v-model="statement.value">
              <div class="absolute end-2 flex gap-2">
              </div>
            </TextInput>
          </div>
        </div>

        <div class="py-[6px]" v-if="updateImprovementLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton class="btn-outline btn-primary text-white" size="xs" :onclick="modalId+'.close()'"
                      type="button">
            {{ $t('button.cancel') }}
          </BaseButton>
          <BaseButton class="btn-primary text-white" size="xs" type="submit">
            {{ $t('button.update') }}
          </BaseButton>
        </div>
      </Form>
    </div>
  </Modal>
</template>

<style scoped>

</style>