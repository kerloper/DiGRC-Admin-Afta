<script setup>

import TextInput from "@/components/TextInput.vue";
import {Form} from "vee-validate";
import BaseButton from "@/components/BaseButton.vue";
import {object, string} from 'yup'
import Modal from "@/components/Modal.vue";
import { ref} from "vue";
 import VSelect from "@/components/VSelect.vue";


const schemaValidation = object({
  name: string().trim().required().min(3),
  family: string().trim().required().min(3),
  newLang: object().required(),

});
const username = ref(null)
const family = ref(null)
const newLang = ref(null)
const options = ref([
  {name: 'Vue.js', language: 'JavaScript'},
  {name: 'Rails', language: 'Ruby'},
  {name: 'Sinatra', language: 'Ruby'},
  {name: 'Laravel', language: 'PHP', $isDisabled: true},
  {name: 'Phoenix', language: 'Elixir'}
])


function onSubmit(values,{resetForm}) {
  console.log("onSubmit",values,resetForm)
}
</script>

<template>
  <Modal title="Modal">
    <Form :validation-schema="schemaValidation" @submit="onSubmit" class="">

      <div class="flex flex-row gap-2">
        <TextInput class="flex-grow" label="Name" name="name" placeholder="Name" v-model="username"/>
        <TextInput class="flex-grow" label="Family" name="family" placeholder="Family" v-model="username"/>
      </div>


      <VSelect v-model="newLang" name="newLang" deselect-label="Can't remove this value" track-by="name"
               title="Language"
               label="name"
               placeholder="Select one" :options="options" :searchable="false" :allow-empty="false">
        <template slot="singleLabel" slot-scope="{ option }"><strong>{{ option.name }}</strong> is written in<strong>
          {{ option.language }}</strong></template>
      </VSelect>


      <div class="flex justify-end mt-3">
        <BaseButton type="submit">Submit</BaseButton>
      </div>


    </Form>
  </Modal>


</template>

<style scoped>

</style>