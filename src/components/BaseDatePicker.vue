<script setup>
import DatePicker from '@alireza-ab/vue3-persian-datepicker';
import {computed, defineProps, reactive, ref, watch} from "vue";
import {useLocaleStore} from "@/stores/locale.js";

const props = defineProps({
  selectedDate: {
    type: [String, Date, null],
    default: new Date()
  },
  mode: {
    default: 'single'
  },
  column: {
    type: Number,
    default: 1
  },
  autoSubmit: {
    type: Boolean,
    default: true,
  },
  label: String,
})
const emit = defineEmits(['update:selectedDate']);
const localeStore = useLocaleStore();

const localSelectedDate = ref(props.selectedDate);
// const currentLang = computed(() => localeStore.currentLang === 'fa' ? 'fa,en' : 'en,fa');
const currentLang = computed(() => 'en');
// const faConfig = {
//   fa: {
//     dir: {
//       input: "rtl"
//     }
//   }
// }
const enConfig = {
  en: {
    dir: {
      input: "ltr"
    }
  },
}
// const localeConfig = computed(() => currentLang.value === 'fa' ? faConfig : enConfig)
const localeConfig = computed(() =>   enConfig)
// const dir = computed(() => localeConfig?.en?.dir?.input??localeConfig?.fa?.dir?.input)
const dir = computed(() => localeConfig?.en?.dir?.input)

watch(localSelectedDate, (newDate) => {
  emit('update:selectedDate', newDate);
});

watch(() => props.selectedDate, (newDate) => {
  localSelectedDate.value = newDate;
});

</script>

<template>
  <div>
    <span class="label-text ms-0.5" v-if="label">{{ label }}</span>
    <slot></slot>
    <date-picker
        :locale="currentLang"
        :column="column"
        :mode="mode"
        v-model="localSelectedDate"
        :dir="dir"
        :auto-submit="autoSubmit"
        class="input input-bordered input-sm rounded-md flex items-center     w-full"
        :locale-config="localeConfig"
        icon-inside
    >
      <template #icon>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
             class="size-6 text-primary">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"/>
        </svg>

      </template>

    </date-picker>
  </div>
</template>

<style scoped lang="scss">

:deep(.pdp-picker) {
  @apply bg-base-300 text-base-content
}

:deep(.pdp .pdp-picker .pdp-footer .pdp-today) {
  @apply bg-primary
}

:deep(.pdp .pdp-picker .pdp-header .bottom > div .pdp-month) {
  @apply text-primary
}

:deep(.pdp .pdp-picker .pdp-header .bottom > div .pdp-year) {
  @apply text-primary
}

:deep(.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day.friday) {
  @apply text-primary border-primary hover:border-2
}


:deep(.pdp .pdp-picker .pdp-header .top button) {
  @apply text-primary
}

:deep(.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day:not(.disabled):hover) {
  @apply bg-primary text-white
}

:deep(.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day.today) {
  @apply border-2 border-primary
}


</style>