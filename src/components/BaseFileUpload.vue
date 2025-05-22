<script setup>
import { toRef, watch } from 'vue';
import { useField } from 'vee-validate';
import TextInput from "@/components/TextInput.vue";

const props = defineProps({
  label: {
    type: String,
    required: false,
    default:''
  },
  hasLabel:{
    type: Boolean,
    required:false,
    default: false,
  },
  customClass: {
    type: String,
    default: '',
  },
  value: String,
  name: {
    type: String,
    required: true,
  },
  hasDefaultErrorMessage: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  modelValue: String | Number,
  placeholder: String
});

const emit = defineEmits(['handleFileChange']);
const name = toRef(props, 'name');
const {
  value,
  errorMessage,
} = useField(name, undefined, {
  syncVModel: true,
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    emit('handleFileChange', file)
  }
};
</script>

<template>
  <div>
    <span class="label-text ms-0.5" v-if="hasLabel">{{ label }}</span>
    <label class=" flex items-center gap-2"
           :class="{'tooltip tooltip-top tooltip-open tooltip-warning': errorMessage}"
           :data-tip="hasDefaultErrorMessage ? `${$t('message.' + errorMessage)}` : `${$t('form.' + name)} ${$t('form.field-required')}`"
    >
      <slot></slot>
      <input
          :name="name"
          :id="name"
          :disabled="isDisabled"
          type="file"
          @change="handleFileChange"
          class="file-input file-input-bordered file-input-sm w-full file-input-primary  file-input-text outline-primary"
          :class="customClass"
      />
    </label>
  </div>
</template>

<style scoped>
:deep(.file-input-bordered) {
  @apply border-gray-300 h-[33px] rounded-md
}
</style>
