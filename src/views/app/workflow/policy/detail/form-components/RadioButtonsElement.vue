<template>
  <div class="form-control">
    <label class="label">
      <span class="label-text">{{ props.label }}</span>
    </label>
    <div class="flex flex-col space-y-2">
      <label
          v-for="(option, index) in props.options"
          :key="index"
          class="label cursor-pointer"
      >
        <span class="label-text">{{ option }}</span>
        <input
            type="radio"
            :name="props.name"
            :value="option"
            :checked="modelValue === option"
        @change="$emit('update:modelValue', option)"
        :disabled="props.disabled"
        class="radio"
        />
      </label>
    </div>
  </div>
</template>

<script setup>
defineProps({
  props: Object,
  modelValue: String, // The value passed from the parent
});

defineEmits(["update:modelValue"]); // Emit event to update the value
</script>