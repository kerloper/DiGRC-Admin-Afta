<script setup>
import {computed, ref, watch} from "vue";
import {useI18n} from "vue-i18n";

const props = defineProps({
  modelValue: String,
  placeholder: {
    type: String,
  }
});
const {t:$t} = useI18n()
const defaultPlaceHolder = computed(()=> props.placeholder || $t('menu.home') + '...')

const emit = defineEmits(["update:modelValue", "input"]);

const inputValue = ref(props.modelValue);

watch(
    () => props.modelValue,
    (newValue) => {
      inputValue.value = newValue;
    }
);

const updateValue = (event) => {
  const value = event.target.value;
  inputValue.value = value;
  emit("update:modelValue", value);
  emit("input", value);
};
</script>

<template>
  <label class="input input-primary input-sm w-full max-w-64 flex items-center gap-2">
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-5"
    >
      <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>

    <input
        type="text"
        class="grow"
        :value="inputValue"
        :placeholder="defaultPlaceHolder"
        @input="updateValue"
    />
  </label>
</template>

