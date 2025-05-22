<template>
  <div class="form-control">
    <label class="label cursor-pointer">
      <span class="label-text">{{ props.label }}</span>
      <input
          type="checkbox"
          :checked="modelValue || false"
      @change="$emit('update:modelValue', $event.target.checked)"
      :disabled="props.disabled"
      class="checkbox"
      />
    </label>
  </div>
</template>

<script setup>
defineProps({
  props: Object,
  modelValue: Boolean, // The value passed from the parent
});

defineEmits(["update:modelValue"]);
</script>