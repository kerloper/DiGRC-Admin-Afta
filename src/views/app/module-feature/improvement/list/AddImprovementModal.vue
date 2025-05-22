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
  showAddImprovementModalFlag: Boolean,
  newImprovement: Object,
  statusList: Array,
  frameworkList: Array,
  domainList: Array,
  controlList: Array,
  addImprovementLoadingFlag: Boolean,
  modalId: {
    type: String,
    default: "add_improvement_company_modal",
  }
});
const {t: $t} = useI18n()
const emit = defineEmits(['resetAddImprovementData', 'onSubmitAddImprovement']);
const tabIndex = ref(0)
const statements = ref([])
const validationList = ref([ ])
//for handle validation error in add controlCompany
const addImprovementSchemaValidation = ref(
    object(
        validate(validationList.value)
    )
)
const domainListFiltered = ref([])
const controlListFiltered = ref([])
const resetAddImprovementData = () => {
  emit('resetAddImprovementData');
};

function onSubmitAddImprovement() {
  props.newImprovement.remediation_tasks = statements.value
  emit('onSubmitAddImprovement');
}


function setValidationObjects() {
  validationList.value = ['domain', 'framework', 'control', 'title', ...validationList.value]
  addImprovementSchemaValidation.value = object(
      validate(validationList.value)
  )
}


const frameworkRef = toRef(props.newImprovement, 'framework');
const domainRef = toRef(props.newImprovement, 'domain');

watch(domainRef, (newValue) => {
  if (newValue) {
    props.newImprovement.control = null
    controlListFiltered.value = props.controlList.filter(control => {
      return control.domain_id === newValue.id
    });
  }
});
watch(frameworkRef, (newValue) => {
  if (newValue) {
    props.newImprovement.domain = null
    domainListFiltered.value = props.domainList.filter(domain => {
      return domain.framework_id === newValue.id
    });
  }
});

onMounted(() => {
  statements.value = []
  for (let i = 0; i < 4; i++) {
    statements.value.push({
      value: null,
    });
    validationList.value.push('statement' + (i))
  }
  setValidationObjects()
})

</script>

<template>
  <Modal
      @close="resetAddImprovementData"
      :title="$t('modal.add-improvement')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div class=" max-h-[70vh] overflow-y-auto overflow-x-hidden">
      <Form :validation-schema="addImprovementSchemaValidation" @submit="onSubmitAddImprovement"
            v-if="showAddImprovementModalFlag">


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
              :aria-label="$t('title.task')"
              @click="tabIndex=1"
          />

        </div>


        <div class="grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-2" :class="{'hidden':tabIndex===1}">
          <VSelect class="col-span-1"
                   v-model="newImprovement.framework"
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
                   v-model="newImprovement.domain"
                   name="domain"
                   track-by="name"
                   tracked-by="id"
                   :id="'id'"
                   :has-default-error-message="true"
                   deselect-label=""
                   :is-multiple="false"
                   :title="$t('form.domain')"
                   label="title"
                   :is-disabled="!newImprovement.framework"
                   :placeholder="''"
                   :options="domainListFiltered"
                   :searchable="false"
                   :allow-empty="false"
                   :is-preselect-first="false"
          />
          <VSelect class="col-span-2"
                   v-model="newImprovement.control"
                   name="control"
                   track-by="name"
                   tracked-by="id"
                   :id="'id'"
                   :has-default-error-message="true"
                   deselect-label=""
                   :is-multiple="false"
                   :title="$t('form.control')"
                   label="title"
                   :is-disabled="!newImprovement.domain"
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
                     v-model="newImprovement.title"/>
        </div>

        <div class="grid md:grid-cols-1 lg:grid-cols-1 grid-cols-1" :class="{'hidden':tabIndex===0}">
          <div class="grid grid-cols-1 overflow-y-auto max-h-[500px] gap-2 p-1">
            <TextInput class="flex-grow relative"
                       v-for="(statement,index) in statements" :key="index"
                       :label="$t('form.title')"
                       :custom-class="(index=== statements.length-1)?'pe-10':'pe-4'"
                       :name="'statement'+(index)"
                       :has-default-error-message="true"
                       v-model="statement.value">
            </TextInput>
          </div>
        </div>

        <div class="py-[6px]" v-if="addImprovementLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton class="btn-outline btn-primary text-white" size="xs" :onclick="modalId+'.close()'"
                      type="button">
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