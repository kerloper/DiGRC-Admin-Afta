<script setup>
import {computed, onUnmounted, ref, shallowRef, watch} from "vue";
import {useI18n} from "vue-i18n";
import {useUserStore} from "@/stores/user.js";
import VOtpInput from "vue3-otp-input";
import {useRouter} from "vue-router";
import API from "@/services/API.js";
import BaseButton from "@/components/BaseButton.vue";
import {useRoute} from 'vue-router';

const route = useRoute();
const {t: $t} = useI18n()
const interval = ref(null)
const digitCode = ref(null)
const bindValueDigit = ref('')
const hasTime = useRouter(true)
const user = useUserStore()
const timer = shallowRef("2:00")
const digitInput = ref(null);
const isLoading = ref(false)
const router = useRouter()
const timeFinished = computed(() => {
  return timer.value === "0:00"
})

function countdown() {
  clearInterval(interval.value);
  interval.value = setInterval(() => {
    console.log('interval started')
    let [minutes, seconds] = timer.value.split(':').map(Number);

    if (minutes === 0 && seconds === 0) {
      hasTime.value = false;
      clearInterval(interval.value);
      return;
    }

    if (seconds === 0) {
      if (minutes > 0) {
        minutes -= 1;
        seconds = 59;
      }
    } else {
      seconds -= 1;
    }

    // Ensure seconds formatting (add leading zero if needed)
    timer.value = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}


function resendCode() {
  digitInput.value?.clearInput();
  execute()
}

async function handleOnComplete(value) {
  digitCode.value = value
  isLoading.value = true
  const {data: verifyData} = await API.verifyMfaSmsOtp({verification: value})
  try {
    if (verifyData.value) {
      user.setMfaVerify(verifyData.value.data.multi_factor_verify)
      await router.push({name: 'home'});
      user.configurationWrapper()
    } else {
    }
  } catch (error) {
    console.log(error)
  } finally {
    digitInput.value?.clearInput();
  }
}

const {isFetching, execute} = API.requestSmsMfaOtp({method: user.mfaMethod})
const loading = computed(() => isLoading.value || isFetching.value)

watch(() => isFetching.value, (value) => {
  if (!value) {
    timer.value = "2:00";
    countdown()
  }
})
// Watch route changes to stop countdown
watch(() => route.fullPath, () => {
  clearInterval(interval.value);
});

// Also clear interval when the component unmounts
onUnmounted(() => {
  clearInterval(interval.value);
});

</script>

<template>
  <div class="relative  flex flex-col justify-center gap-4 lg:gap-16 items-center w-full overflow-hidden">
    <div>
      <img alt="DiGRC Logo" src="../../../assets/logos/logo-large-w.png" class="w-64 mt-4"/>
    </div>
    <div class="card glass w-[480px] min-h-52"
         :class="{'skeleton':loading}"
    >
      <div class="card-body">
        <div>
          <div>
            <div class="flex flex-row text-center">
              <v-otp-input
                  ref="digitInput"
                  class="mx-auto"
                  :is-disabled="timeFinished||loading"
                  input-classes="input mx-1 input-bordered grow  w-12 text-center"
                  separator=" "
                  :num-inputs="6"
                  :should-auto-focus="true"
                  :should-focus-order="true"
                  :is-input-num="true"
                  v-model:value="bindValueDigit"
                  @on-complete="handleOnComplete"
              />
            </div>

            <div class="min-h-10">

              <div v-if="!loading">
                <div class="flex justify-between mt-1 mb-2">

                  <div class="w-full text-center" v-if="!timeFinished">
                    <div class="my-4 w-full text-center text-white font-semibold" ref="timeout">
                      Remaining time : {{ timer }}
                    </div>
                    <div class="py-[6px] text-base text-bold text-base-300 w-full text-center">
                      {{ $t(`user.mfa-digit-send-${user.mfaMethod}`) }}
                    </div>
                  </div>

                  <div class="w-full text-center" v-if="timeFinished">
                    <BaseButton
                        class="font-semibold mt-4 btn-primary"
                        :class="{'cursor-pointer':timeFinished,'text-white':timeFinished,'cursor-not-allowed':!timeFinished}"
                        @click="resendCode">
                      {{ $t('user.resend-code') }}
                    </BaseButton>
                    <p
                        class="text-base mt-5 font-semibold text-base-100 bottom-0"
                    >
                      {{ $t(`user.mfa-digit-has-been-sent-${user.mfaMethod}`) }}
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>