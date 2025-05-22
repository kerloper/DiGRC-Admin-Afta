<script setup>
import {computed, toRef} from 'vue';
import {useField} from 'vee-validate';
import Multiselect from "vue-multiselect";
import {useLocaleStore} from "@/stores/locale.js";

const props = defineProps({

  title: String,
  label: String,
  name: {
    type: String,
    required: true,
  },
  modelValue: {},
  placeholder: String,
  options: {
    type: Array,
    default: [],
  },
  isMultiple: {
    type: Boolean,
    default: false,
  },
  isPreselectFirst: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  trackBy: {
    type: String,
    default: "",
  },
  searchable: {
    type: Boolean,
    default: true,
  },
  internalSearch: {
    type: Boolean,
    default: false,
  },
  clearOnSelect: {
    type: Boolean,
    default: false,
  },
  closeOnSelect: {
    type: Boolean,
    default: true,
  },
  showNoResults: {
    type: Boolean,
    default: false,
  },
  allowEmpty: {
    type: Boolean,
    default: true,
  },
  hideSelected: {
    type: Boolean,
    default: false,
  },
  optionsLimit: {
    type: Number,
    default: 300,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hasDefaultErrorMessage: {
    type: Boolean,
    default: false,
  },
});

const direction = computed(() => useLocaleStore().direction)

defineEmits(['update:modelValue', 'searchChange'])

const name = toRef(props, 'name');

const {
  value,
  errorMessage,
  handleBlur,
} = useField(name, undefined, {
  syncVModel: true,
});


</script>

<template>

  <div>
    <span class="label-text ms-0.5">{{ title }}</span>
    <Multiselect
        :class="{'tooltip tooltip-top tooltip-open tooltip-warning':errorMessage}"
        :data-tip="hasDefaultErrorMessage?`${$t('message.'+errorMessage)}`:errorMessage"
        :label="label"
        :name="name"
        :id="name"
        :multiple="isMultiple"
        :options="options"
        :placeholder="placeholder"
        :model-value="modelValue"
        :dir="direction"
        @update:model-value="$emit('update:modelValue', $event)"
        @blur="handleBlur"
        class="grow text-base-content"
        :value="modelValue"
        :loading="isLoading"
        :preserve-search="true"
        :track-by="trackBy"
        :searchable="searchable"
        :internal-search="internalSearch"
        :clear-on-select="clearOnSelect"
        :close-on-select="closeOnSelect"
        :show-no-results="showNoResults"
        :hide-selected="hideSelected"
        :allow-empty="allowEmpty"
        :options-limit="300"
        deselectLabel=""
        selectLabel=""
        selectedLabel=" "
        :preselect-first="isPreselectFirst"
        @search-change="$emit('searchChange',$event)"
        :disabled="disabled"
    >

      <template #singleLabel="props">
        <slot name="singleLabel" :data="props"></slot>
      </template>
      <template #option="props">
        <slot name="option" :data="props"></slot>
      </template>
    </Multiselect>
  </div>


</template>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped lang="scss">
:deep(.multiselect__tags) {
  /*
  //@apply bg-transparent input-bordered input input-sm rounded-md min-h-[30px] leading-3
   */
  @apply bg-transparent input-bordered   rounded-md  min-h-[34px] leading-3 text-start
}

:deep(.multiselect__tag) {
}

:deep(.multiselect__tags-wrap) {
}

:deep(.multiselect--disabled) {
  @apply bg-transparent cursor-not-allowed opacity-100
}

:deep(.multiselect__option--highlight) {
  @apply bg-primary p-3
}

:deep(.multiselect__option--selected.multiselect__option) {
  @apply bg-primary opacity-80 p-3 text-white
}

:deep(.multiselect__option--highlight.multiselect__option--selected.multiselect__option) {
  @apply bg-base-content/60
}

:deep(.multiselect__input) {
  @apply placeholder:text-sm placeholder:text-base-content bg-transparent text-base-content
}

:deep(.multiselect__placeholder) {
  @apply text-base-content opacity-80 bg-transparent;
}

:deep(.multiselect__content-wrapper) {
  @apply input-bordered bg-base-100 text-sm
}

:deep(.multiselect__select) {
  @apply bg-transparent
}

:deep(.multiselect__content) {
  @apply text-base-content
}

:deep(.multiselect__option) {
  @apply ps-4

}

:deep(.multiselect__single ) {
  @apply bg-transparent text-base-content mb-0 pt-1 pb-2  text-sm leading-[7px]
}

:deep(.multiselect__spinner ) {
  @apply bg-base-100 h-8 w-8 me-1;
  &::after, &::before {
    border-color: #009ca7 transparent transparent
  }
}
</style>
