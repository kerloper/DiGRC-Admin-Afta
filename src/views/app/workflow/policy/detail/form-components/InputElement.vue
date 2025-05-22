<template>
<!--    <TextInput-->
<!--        class="col-span-2"-->
<!--        :type="props.type"-->
<!--        :value="modelValue"-->
<!--        @input="$emit('update:modelValue', $event.target.value)"-->
<!--        :placeholder="props.placeholder"-->
<!--        :disabled="props.disabled"-->
<!--        :readonly="props.readonly"-->
<!--        name=""-->
<!--        :label="props.label"-->
<!--    />-->

  <TextInput
      class="col-span-2"
      :type="props.type"
      :value="modelValue"
      name=""
      :label="props.label"
  />
</template>

<script setup>
import TextInput from "@/components/TextInput.vue";

defineProps({
  props: Object,
  modelValue: String, // The value passed from the parent
});

defineEmits(["update:modelValue"]); // Emit event to update the value
</script>