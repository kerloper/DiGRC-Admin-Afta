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
  showAddControlModalFlag: Boolean,
  newControl: Object,
  statusList: Array,
  frameworkList: Array,
  domainList: Array,
  addControlLoadingFlag: Boolean,
  modalId: {
    type: String,
    default: "add_control_company_modal",
  }
});
const {t: $t} = useI18n()
const emit = defineEmits(['resetAddControlData', 'onSubmitAddControl']);
const resetAddControlData = () => {
  emit('resetAddControlData');
};

function onSubmitAddControl() {
  props.newControl.statement = statements.value
  emit('onSubmitAddControl');
}

const validationList = ref([ ])

//for handle validation error in add controlCompany
const addControlSchemaValidation = ref(
    object(
        validate(validationList.value)
    )
)
const tabIndex = ref(0)
const statements = ref([])
const domainListFiltered = ref([])

function addStatement() {
  statements.value.push({
    value: null,
  });
  validationList.value.push('statement' + (statements.value.length-1))
  setValidationObjects()
}

function removeStatement(statement) {
  statements.value.splice(statements.value.indexOf(statement), 1);
  validationList.value.splice(validationList.value.length-1, 1);
  setValidationObjects()
}

function setValidationObjects(){
  validationList.value = ['domain', 'framework', 'title', 'description', 'quick_win', 'status', 'number',...validationList.value]
  addControlSchemaValidation.value = object(
      validate(validationList.value)
  )
}

const frameworkRef = toRef(props.newControl, 'framework');

watch(frameworkRef, (newValue) => {
  if (newValue) {
    props.newControl.domain = null
    domainListFiltered.value = props.domainList.filter(domain => {
      return domain.framework_id === newValue.id
    });
  }
});

onMounted(() => {
  statements.value = []
  for (let i = 0; i < 5; i++) {
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
      @close="resetAddControlData"
      :title="$t('modal.add-control')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div class=" max-h-[70vh] overflow-y-auto overflow-x-hidden">
      <Form :validation-schema="addControlSchemaValidation" @submit="onSubmitAddControl" v-if="showAddControlModalFlag">

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
                   v-model="newControl.framework"
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
                   v-model="newControl.domain"
                   name="domain"
                   track-by="name"
                   tracked-by="id"
                   :id="'id'"
                   :has-default-error-message="true"
                   deselect-label=""
                   :is-multiple="false"
                   :title="$t('form.domain')"
                   label="title"
                   :is-disabled="!newControl.framework"
                   :placeholder="''"
                   :options="domainListFiltered"
                   :searchable="false"
                   :allow-empty="false"
                   :is-preselect-first="false"
          />
          <TextInput class="flex-grow"
                     :label="$t('form.number')"
                     name="number"
                     :has-default-error-message="true"
                     v-model="newControl.number"/>
          <VSelect v-model="newControl.status"
                   name="status"
                   deselect-label=""
                   :is-multiple="false"
                   :has-default-error-message="true"
                   track-by="key"
                   :title="$t('form.status')"
                   label="title"
                   :placeholder="''"
                   :options="statusList"
                   :searchable="false"
                   :allow-empty="false"
                   :is-preselect-first="false"
          />
          <TextInput class="flex-grow col-span-2"
                     :label="$t('form.title')"
                     name="title"
                     :has-default-error-message="true"
                     v-model="newControl.title"/>

          <TextareaInput class="flex-grow col-span-2"
                         :label="$t('form.description')"
                         :min-h="'min-h-24'"
                         name="description"
                         :has-default-error-message="true"
                         v-model="newControl.description"/>

          <TextareaInput class="flex-grow col-span-2"
                         :label="$t('form.quick-win')"
                         :min-h="'min-h-24'"
                         name="quick_win"
                         :has-default-error-message="true"
                         v-model="newControl.quick_win"/>
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
              <div class="absolute end-2 flex gap-2">
                <div class="cursor-pointer " @click="addStatement()" v-if="index=== statements.length-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                       stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                  </svg>
                </div>
                <div class="cursor-pointer" @click="removeStatement(statement)" v-if="statements.length>1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                       stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                  </svg>
                </div>
              </div>
            </TextInput>
          </div>
        </div>
        <div class="py-[6px]" v-if="addControlLoadingFlag">
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