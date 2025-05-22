<script setup>
import BaseCard from "@/components/BaseCard.vue";
import {Form} from "vee-validate";
import TextInput from "@/components/TextInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import {useUserStore} from "@/stores/user.js";
import {ref} from "vue";
import {storeToRefs} from "pinia";
import {object} from "yup";
import {useI18n} from "vue-i18n";
import validate from "@/composables/validate.js";

const {t: $t} = useI18n()
const userStore = useUserStore()
const user = userStore.currentUser
const userTemp = ref({});
const {updateProcessing} = storeToRefs(userStore);
const updateValidation = object(
     validate(['first_name', 'last_name']),
);
Object.assign(userTemp.value,user);

function cancel(){
  Object.assign(userTemp.value,user);
}

function tryUpdateProfile(){
  userStore.tryUpdateProfile({
    first_name: userTemp.value.first_name,
    last_name: userTemp.value.last_name,
  });
}

</script>

<template>
  <section>
    <BaseCard class="min-h-[57vh]">
      <h3>
        {{ $t('title.update-profile-information') }}
      </h3>
      <div class="box border-1 border-gray-200 max-w-[520px]">
        <Form :validation-schema="updateValidation" @submit="tryUpdateProfile">
          <div class="grid md:grid-cols-1 lg:grid-cols-1 grid-cols-1 gap-2">
            <TextInput class="flex-grow"
                       :label="$t('form.first-name')"
                       name="first_name"
                       :has-default-error-message="true"
                       :is-disabled="updateProcessing"
                       v-model="userTemp.first_name"/>
            <TextInput class="flex-grow"
                       :label="$t('form.last-name')"
                       name="last_name"
                       :has-default-error-message="true"
                       :is-disabled="updateProcessing"
                       v-model="userTemp.last_name"/>
          </div>
          <div class="py-[6px]" v-if="updateProcessing">
            <progress class="progress w-full progress-primary"></progress>
          </div>
          <div class="flex justify-end mt-3 gap-2" v-else>
              <BaseButton class="btn-outline btn-primary" size="xs" @click="cancel" type="button">
                {{ $t('button.cancel') }}
              </BaseButton>
              <BaseButton class="btn-primary text-white" size="xs" type="submit">
                {{ $t('button.update') }}
              </BaseButton>
          </div>
        </Form>
      </div>
    </BaseCard>
  </section>
</template>

<style scoped>

</style>