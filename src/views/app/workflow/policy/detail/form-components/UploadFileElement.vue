<template>
  <div class="form-control">
    <label class="label">
      <span class="label-text">{{ props.label }}</span>
    </label>
    <input
        type="file"
        @change="handleFileChange"
        class="file-input file-input-bordered w-full input-sm"
    />
  </div>
</template>

<script setup>
defineProps({
  props: Object, // Define props correctly
  modelValue: [File, String], // Allow File or String for file uploads
});

const emit = defineEmits(["update:modelValue"]);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  emit("update:modelValue", file); // Emit the selected file
};
</script>