<template>
  <div>
    <TextareaInput
        :label="props.label"
        :value="modelValue"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :readonly="props.readonly"
        name=""
    />
  </div>
</template>

<script setup>
import TextareaInput from "@/components/TextareaInput.vue";

defineProps({
  props: Object,
  modelValue: String,
});

defineEmits(["update:modelValue"]);
</script>