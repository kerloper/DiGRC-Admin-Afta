<script setup>

import {Form} from "vee-validate";
import {computed, ref, shallowRef, watch} from "vue";
import {useI18n} from "vue-i18n";
import API from "@/services/API.js";
import BaseCard from "@/components/BaseCard.vue";
import TextInput from "@/components/TextInput.vue";
import TextareaInput from "@/components/TextareaInput.vue";
import VSelect from "@/components/VSelect.vue";
import BaseButton from "@/components/BaseButton.vue";

const {t: $t} = useI18n()
const {data, isFetching, execute} = API.coreConfigSetting()
const sections = ref(computed(() => data.value ? Object.entries(data.value?.data) : []));
const formData = ref({});
const isLoading = shallowRef(false);


const submitForm = async () => {
  isLoading.value = true;
  const payload = {};
  sections.value.forEach(([sectionKey, sectionData]) => {
    sectionData.configs.forEach((config) => {
      if (formData.value[config.key] !== undefined) {
        if (config.type === "select") {
          payload[config.key] = formData.value[config.key]?.key || null
        } else {
          payload[config.key] = formData.value[config.key];
        }
      }
    });
  });

  const {data, isFetching: updateLoading} = await API.coreConfigUpdate(payload)
  isLoading.value = updateLoading.value
  execute()

  // Send `payload` to API
};


watch(sections, (value) => {
  if (value) {
    formData.value = {}; // Reset formData

    sections.value.forEach(([sectionKey, sectionData]) => {
      sectionData.configs.forEach((config) => {
        if (config.type === "select") {
            config.value_options.find((option) => {
                if (option.key === config.value) {
                  formData.value[config.key] = option;
                }
              }
          );
        } else if (config.value !== null && config.value !== undefined) {
          formData.value[config.key] = config.value;
        }
      });
    });
  }
});


function resetForm() {
  document.getElementById('config_setting_form').reset();
  execute()
}

</script>

<template>
  <div>

    <BaseCard>
      <div class="flex justify-between pb-2">
        <div class="flex gap-2">
        </div>
      </div>
      <div class="min-card-height-table">

        <div class="w-full grid grid-cols-2 gap-2" v-if="isFetching">
          <div class="skeleton h-72 w-full"></div>
          <div class="skeleton h-72 w-full"></div>
        </div>
        <div v-else>
          <Form @submit="submitForm" id="config_setting_form">
            <div class="grid grid-cols-2 gap-2">
                <fieldset
                    v-for="[sectionKey, sectionData] in sections" :key="sectionKey"
                    class="fieldset border p-4 mb-4 rounded-xl">
                  <legend class="text-base font-semibold">
                    {{ sectionData.title }}
                  </legend>

                  <div v-for="config in sectionData.configs" :key="config.key" class=" ">
                    <VSelect
                        v-if="config.type === 'select'"
                        v-model="formData[config.key]"
                        :options="config.value_options"
                        key="key"
                        tracked-by="key"
                        value="key"
                        label="title"
                        :title="config.title"
                        :name="config.key"
                    />

                    <!-- Textarea -->
                    <TextareaInput
                        v-else-if="config.type === 'textarea'"
                        :label="config.title"
                        v-model="formData[config.key]"
                        rows="3"
                        :name="config.key"
                    />

                    <!-- Radio Buttons -->
                    <div v-else-if="config.type === 'radio'" class="grid grid-cols-1 gap-2 mb-2">
                      <div>
                        {{ config.title }}
                      </div>
                      <div class="flex gap-2">
                        <label
                            v-for="option in config.value_options"
                            :key="option.key"
                            class="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                              type="radio"
                              v-model="formData[config.key]"
                              :value="option.value"
                              class="radio radio-xs radio-primary"
                          />
                          <span>{{ option.title }}</span>
                        </label>
                      </div>
                    </div>

                    <!-- Text Input (Fallback) -->
                    <TextInput
                        v-else
                        :label="config.title"
                        v-model="formData[config.key]"
                        class="w-full border rounded-md px-3 py-2"
                        :name="config.key"
                    />
                  </div>
                </fieldset>
            </div>
            <div class="py-[6px]" v-if="isLoading">
              <progress class="progress w-full progress-primary"></progress>
            </div>
            <div class="flex justify-end mt-3 gap-2" v-else>
              <BaseButton class="btn-outline btn-primary" type="button" size="xs" @click="resetForm">
                {{ $t('button.reset') }}
              </BaseButton>
              <BaseButton class="btn-primary text-white" size="xs" type="submit">
                {{ $t('button.submit') }}
              </BaseButton>
            </div>
          </Form>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<style scoped>

</style>