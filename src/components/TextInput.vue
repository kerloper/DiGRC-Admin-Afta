<script setup>
import {toRef} from 'vue';
import {useField} from 'vee-validate';

const props = defineProps({
  label: String,
  type: {
    type: String,
    default: 'text',
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
  modelValue: String|Number,
  placeholder:String
});

const name = toRef(props, 'name');
const {
  value,
  errorMessage,
} = useField(name, undefined, {
  syncVModel: true,
});

</script>

<template>

  <div>
    <span class="label-text ms-0.5" v-if="label">{{ label }}</span>
    <label class="input input-bordered input-sm rounded-md  flex items-center gap-2 "
           :class="{'tooltip tooltip-top tooltip-open tooltip-warning':errorMessage}"
           :data-tip="hasDefaultErrorMessage?`${$t('message.'+errorMessage)}`:`${$t('form.'+name)} ${$t('form.field-required')}`"
    >
      <slot></slot>
      <input
          :name="name"
          :id="name"
          :type="type"
          :disabled="isDisabled"
          :value="modelValue"
          :placeholder="placeholder"
          @input="$emit('update:modelValue', $event.target.value)"
          class="bg-base-content placeholder-base-content placeholder-opacity-80 text-base-content w-full"
          :class="customClass"
          @focus="$emit('focus')"
          @blur="$emit('blur')"
      />

    </label>
  </div>

</template>

<style scoped>

</style>
