<template>
  <div>

<!--    <VSelect-->
<!--        :title="props.label "-->
<!--        :value="modelValue"-->
<!--        :options="props.options"-->
<!--        @input="$emit('update:modelValue', $event.target.value)"-->
<!--        :disabled="props.disabled"-->
<!--        name="">-->
<!--      &lt;!&ndash;      <option disabled value="">Select an option</option>&ndash;&gt;-->
<!--      &lt;!&ndash;      <option v-for="(option, index) in props.options" :key="index" :value="option">&ndash;&gt;-->
<!--      &lt;!&ndash;        {{ option }}&ndash;&gt;-->
<!--      &lt;!&ndash;      </option>&ndash;&gt;-->
<!--    </VSelect>-->

    <VSelect
        v-model="selected"
        name="props.name"
        :title="props.label "
        class="col-span-1"
        deselect-label=""
        :is-multiple="true"
        traked
        :options="props.options"
        :searchable="true"
        :allow-empty="true"

 >
<!--      <option disabled value="">Select an option</option>-->
<!--      <option v-for="(option, index) in props.options" :key="index" :value="option">-->
<!--        {{ option }}-->
<!--      </option>-->

    </VSelect>
  </div>
</template>

<script setup>
import VSelect from "@/components/VSelect.vue";
import {ref} from "vue";

defineProps({
  props: Object,
  modelValue: String, // The value passed from the parent
});
const selected = ref(null)
defineEmits(["update:modelValue"]); // Emit event to update the value
</script>