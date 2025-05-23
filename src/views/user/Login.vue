<script setup>
import {computed, reactive, ref, watch} from "vue";
import {useI18n} from "vue-i18n";
import {useLocaleStore} from "@/stores/locale.js";
import {useUserStore} from "@/stores/user.js";
import VOtpInput from "vue3-otp-input";
import BaseButton from "@/components/BaseButton.vue";
import {Form} from "vee-validate";
import {object} from 'yup';
import TextInput from "@/components/TextInput.vue";
import {useRouter} from "vue-router";
import validate from "@/composables/validate.js";

const {t: $t} = useI18n()
const router = useRouter()
const schemaOtpLogin = object(validate(['email']));

const schemaLogin = object(validate(['email', 'password']));

const hasPassword = ref(true)
const isRtl = computed(() => useLocaleStore().isRtl)
const interval = ref(null)
const email = ref(null)
const otpCode = ref(null)
const bindValueOtp = ref('')
const timer = ref("1:59")
const hasTime = ref(true)
const form = reactive({
  email: '',
  password: '',
})

const info = computed(() => [
  {title: $t('user.register-account-title'), desc: $t('user.register-account')},
  {title: $t('user.check-inbox-title'), desc: $t('user.check-inbox')},
  {title: $t('user.use-verification-code-title'), desc: $t('user.use-verification-code')},
  {title: $t('user.use-voucher-code-title'), desc: $t('user.use-voucher-code')},
])

const user = useUserStore()
const loginOrRegisterText = computed(() => {
  if (!hasPassword.value) {
    return $t('user.login-with-pass')
  } else {
    return $t('user.login-register-with-on-time-pass')
  }
})

const loginOrRegisterBtn = computed(() => {
  if (hasPassword.value) {
    return $t('user.login-button')
  } else if (user.mailSuccess && !hasPassword.value) {
    return $t('user.login-button')
  } else {
    return $t('user.submit-receive')
  }

})

const hasCode = computed(() => {
  if (user.mailSuccess) {
    return otpCode.value
  }
})

const timeFinished = computed(() => {
  if (user.mailSuccess) {
    return timer.value == "0:00"
  }
})

function countdown() {
  clearInterval(interval.value)
  interval.value = setInterval(() => {
    console.log('interval started')
    timer.value = timer.value.split(':');
    let minutes = timer.value[0];
    let seconds = timer.value[1];
    seconds -= 1;
    if (minutes < 0) return;
    else if (seconds < 0 && minutes != 0) {
      minutes -= 1;
      seconds = 59;
    } else if (seconds < 10 && seconds.length != 2) seconds = '0' + seconds;
    timer.value = (minutes + ':' + seconds);
    if (minutes == 0 && seconds == 0) {
      hasTime.value = false
      clearInterval(interval.value);
    }
  }, 1000);
}

function resendCode() {
  if (user.mailSuccess && !hasTime.value) {
    hasTime.value = true
    const formData = new FormData()
    formData.append("email", email.value)

    timer.value = "1:59"
    user.registerOrLogin(formData).then(() => {
      countdown()
    })
  }
}

watch(() => user.mailSuccess, (value) => {
  if (value) {
    countdown()
  }
});

watch(() => user.currentUser, (value) => {
  if (value) {
    user.setMailSuccess(false)
    router.push({name: 'home'});
  }
});

function changeLoginType() {
  hasPassword.value = !hasPassword.value
  form.password = null
  form.email = null
  email.value = null
  otpCode.value = null
  if (interval.value) {
    clearInterval(interval.value)
    timer.value = "1:59"
  }
  user.setMailSuccess(false)
}

function changeEmail() {
  user.setMailSuccess(false)
  if (interval.value) {
    clearInterval(interval.value)
  }
  timer.value = "1:59"
  otpCode.value = null
}

function handleOnComplete(value) {
  // console.log('OTP completed: ', value);
  otpCode.value = value
}

function handleOnChange(value) {
  // console.log('OTP changed: ', value);
}


function onInvalidSubmit() {
  console.log('invalid submit')
}

async function formSubmit() {
  // console.log('form submitted', form)
  if (hasPassword.value) {

    const formData = new FormData()
    formData.append("email", form.email)
    formData.append("credential", form.password)
    await user.login(formData)
    // console.log(user.currentUser)
  } else {
    console.log("request email otp ")
    const formData = new FormData()
    formData.append("email", email.value)
    if (!user.mailSuccess) {
      await user.requestOtp(formData)
    } else {
      console.log("verify otp")
      if (hasCode.value && hasPassword.value && hasTime.value) {
        const formData = new FormData()
        formData.append("email", email.value)
        formData.append("otp", otpCode.value)
        await user.verifyEmailOtp(formData)
      }
    }
  }


}


</script>

<template>
  <div class="relative  flex flex-col justify-center gap-4 lg:gap-16 items-center w-full   overflow-hidden">
    <div>
      <img alt="GRC Logo" src="../../assets/logos/logo-large-w.png" class="w-64 mt-4"/>
    </div>
    <div class="card glass w-[400px] ">
      <div class="card-body  ">
        <Form :validation-schema="schemaOtpLogin" @submit="formSubmit" v-if="!user.mailSuccess && !hasPassword">
          <TextInput name="email" type="email" :has-default-error-message="true" v-model="email" :placeholder="$t('form.email')">

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 opacity-80">
              <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z"/>
              <path
                  d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z"/>
            </svg>

          </TextInput>

          <BaseButton class="w-full btn-sm btn-secondary mt-2" :loading="user.processing" type="submit">
            <span>{{ loginOrRegisterBtn }}</span>
          </BaseButton>
        </Form>
        <div>
          <div v-if="!hasPassword && user.mailSuccess">
            <button class="btn btn-square btn-sm mb-2 mx-1" @click="changeEmail">
              <svg v-if="isRtl" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                   class="w-4 h-4">
                <path fill-rule="evenodd"
                      d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                      clip-rule="evenodd"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                <path fill-rule="evenodd"
                      d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
                      clip-rule="evenodd"/>
              </svg>
            </button>
            <div class="flex flex-row">
              <v-otp-input
                  ref="otpInput"
                  input-classes="input mx-1 input-bordered grow  w-12 text-center"
                  separator=" "
                  :num-inputs="6"
                  :should-auto-focus="true"
                  :should-focus-order="true"
                  :is-input-num="true"
                  v-model:value="bindValueOtp"
                  @on-change="handleOnChange"
                  @on-complete="handleOnComplete"
              />
            </div>
            <div class="flex justify-between mt-1 mb-2">
              <p class="font-semibold  mt-4"
                 :class="{'cursor-pointer':timeFinished,'text-white':timeFinished,'cursor-not-allowed':!timeFinished}"
                 @click="resendCode">
                {{ $t('user.resend-code') }}</p>
              <h5 class="my-4 text-white font-semibold" ref="timeout">{{ timer }}</h5>

            </div>


          </div>

        </div>

        <Form :validation-schema="schemaLogin" @submit="formSubmit" @invalid-submit="onInvalidSubmit"
              v-if="hasPassword && !user.mailSuccess"
              class="flex flex-col gap-2 relative">

          <TextInput
              name="email"
              type="email"
              :has-default-error-message="true"
              :placeholder="$t('form.email')"
              v-model="form.email"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                 class="w-4 h-4 opacity-80">
              <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z"/>
              <path
                  d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z"/>
            </svg>
          </TextInput>
          <TextInput
              name="password"
              type="password"
              :placeholder="$t('form.password')"
              :has-default-error-message="true"
              v-model="form.password"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                 class="w-4 h-4 opacity-80">
              <path fill-rule="evenodd"
                    d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z"
                    clip-rule="evenodd"/>
            </svg>
          </TextInput>

          <BaseButton class="w-full btn-sm btn-secondary my-2" :loading="user.processing" type="submit">
            <span>{{ loginOrRegisterBtn }}</span>
          </BaseButton>

        </Form>

        <BaseButton class="w-full btn-sm btn-link no-underline font-weight-bold block text-center text-white"
                    @click="changeLoginType">
          <span>  {{ loginOrRegisterText }}</span>
        </BaseButton>


        <div class="flex flex-col gap-2">
          <BaseButton class="w-full btn-sm">
            <span>Login With Microsoft</span>
          </BaseButton>
          <BaseButton class="w-full btn-sm">
            <span>Login With Google</span>
          </BaseButton>

        </div>
      </div>
    </div>

    <div>
      <ol class="text-white">
        <li v-for="(item,index) in info" :key="item.title"
            class=" d-flex align-items-baseline flex-row-reverse justify-content-end">
          <h6 class="mx-1"><span class="font-weight-semibold">{{ index + 1 }}. {{ item.title }}</span> {{ item.desc }}
          </h6>
        </li>
      </ol>
    </div>


  </div>
</template>

<style scoped>

</style>