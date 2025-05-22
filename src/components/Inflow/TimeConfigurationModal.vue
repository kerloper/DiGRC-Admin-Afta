<script setup>
import Modal from "@/components/Modal.vue";
import TextInput from "@/components/TextInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import {useI18n} from "vue-i18n";
import {Form} from "vee-validate";
import {ref} from "vue";

const props = defineProps({
  showTimeConfigurationModalFlag: Boolean,
  processConfig: Object,
  timeConfigurationLoadingFlag: Boolean,
  modalId:{
    type: String,
    default: "time_configuration_modal",
  }
})
const {t: $t} = useI18n()
const emit = defineEmits(['resetTimeConfigurationData', 'onSubmitTimeConfiguration']);
const resetTimeConfigurationData = () => {
  emit('resetTimeConfigurationData');
}
const onSubmitTimeConfiguration = () => {
  props.processConfig.http_req_ms_timeout = milliSecond.value
  props.processConfig.proc_second_timeout = second.value
  emit('onSubmitTimeConfiguration');
}
const isHttpTimeoutFocused = ref(false)
const isTimeoutFocused = ref(false)
const milliSecond = ref(props.processConfig.http_req_ms_timeout??0)
const second = ref(props.processConfig.proc_second_timeout??0)

</script>

<template>
  <Modal
      @close="resetTimeConfigurationData"
      :title="$t('modal.time-configuration')"
      :id="modalId"
      :custom-style="'max-w-3xl'"
      :close-btn="false"
      :close-backdrop="true"
      :close-icon="true"
  >
    <div>
      <Form @submit="onSubmitTimeConfiguration"
            v-if="showTimeConfigurationModalFlag">
        <div class="grid grid-cols-1 gap-2">
          <!--     for disable autocomplete     -->
          <input type="text" class="hidden"/>
          <!--     for disable autocomplete     -->
          <input type="password" class="hidden"/>
          <TextInput class="flex-grow relative"
                     :label="$t('form.http-timeout')"
                     name="title"
                     :has-default-error-message="true"
                     @focus="isHttpTimeoutFocused = true"
                     @blur="isHttpTimeoutFocused = false"
                     v-model="milliSecond">
            <div class="cursor-pointer absolute end-2 text-xs font-bold">
              {{$t("title.milliSecond")}}
            </div>

          </TextInput>
          <div class="h-5 -mt-2">
            <span class="text-xs font-bold" v-if="isHttpTimeoutFocused">
              {{milliSecond/100}} {{$t("title.second")}}
            </span>
          </div>
          <TextInput class="flex-grow relative"
                     :label="$t('form.process-timeout')"
                     name="id"
                     :has-default-error-message="true"
                     @focus="isTimeoutFocused = true"
                     @blur="isTimeoutFocused = false"
                     v-model="second">
            <div class="cursor-pointer absolute end-2 text-xs font-bold">
              {{$t("title.second")}}
            </div>
          </TextInput>
          <div class="h-5 -mt-2">
            <span class="text-xs font-bold" v-if="isTimeoutFocused">
              {{second/60}} {{$t("title.minute")}}
            </span>
          </div>
        </div>
        <div class="py-[6px]" v-if="timeConfigurationLoadingFlag">
          <progress class="progress w-full progress-primary"></progress>
        </div>
        <div class="flex justify-end mt-3 gap-2" v-else>
          <BaseButton class="btn-outline btn-primary" size="xs" :onclick="modalId+'.close()'" type="button">
            {{ $t('button.cancel') }}
          </BaseButton>
          <BaseButton class="btn-primary text-white" size="xs" type="submit">
            {{ $t('button.save') }}
          </BaseButton>
        </div>
      </Form>
    </div>
  </Modal>
</template>

<style scoped>

</style>