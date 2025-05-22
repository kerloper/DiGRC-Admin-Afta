<script setup>
import {toRef} from 'vue';
import {useField} from 'vee-validate';

const props = defineProps({
  label: String,
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
  minH: {
    type: String,
    default: "min-h-44",
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
    <label class=" flex items-center gap-2 "
           :class="{'tooltip tooltip-top tooltip-open tooltip-warning':errorMessage}"
           :data-tip="hasDefaultErrorMessage?`${$t('message.'+errorMessage)}`:`${$t('form.'+name)} ${$t('form.field-required')}`"
    >
      <slot></slot>
      <textarea
          :name="name"
          :id="name"
          :disabled="isDisabled"
          :value="modelValue"
          :placeholder="placeholder"
          @input="$emit('update:modelValue', $event.target.value)"
          class="bg-transparent placeholder-base-content placeholder-opacity-80 text-base-content w-full input input-bordered input-sm rounded-md"
          :class="minH"
      />

    </label>
  </div>

</template>

<style scoped>
textarea {
  outline: none; /* Remove the blue border */
}

textarea:focus {
  outline: none; /* Ensure no outline on focus */
  box-shadow: none; /* Remove any additional box shadow that might appear */
}
</style>
