<template>
  <div class="flex gap-5">
    <div>
      <span class="countdown font-mono text-xs">
        <span :style="`--value:${timeLeft.days};`"></span>
      </span>
      {{ $t('form.days') }}
    </div>
    <div>
      <span class="countdown font-mono text-xs">
        <span :style="`--value:${timeLeft.hours};`"></span>
      </span>
      {{ $t('form.hours') }}
    </div>
    <div>
      <span class="countdown font-mono text-xs">
        <span :style="`--value:${timeLeft.minutes};`"></span>
      </span>
      {{ $t('form.minutes') }}
    </div>
<!--    <div>-->
<!--      <span class="countdown font-mono text-xs">-->
<!--        <span :style="`&#45;&#45;value:${timeLeft.seconds};`"></span>-->
<!--      </span>-->
<!--      {{ $t('form.seconds') }}-->
<!--    </div>-->
  </div>
  <div v-if="timeLeft.total <= 0">

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  ttl: {
    type: Number,
    required: true
  }
});

const {t} = useI18n();

const timeLeft = ref(calculateTimeLeft(props.ttl));

let timer;

function calculateTimeLeft(ttl) {
  const days = Math.floor(ttl / (3600 * 24));
  ttl %= 3600 * 24;
  const hours = Math.floor(ttl / 3600);
  ttl %= 3600;
  const minutes = Math.floor(ttl / 60);
  const seconds = ttl % 60;
  return {
    total: ttl,
    days,
    hours,
    minutes,
    seconds
  };
}

function updateCountdown() {
  timeLeft.value.total--;
  if (timeLeft.value.total < 0) {
    clearInterval(timer);
    return;
  }
  timeLeft.value = calculateTimeLeft(timeLeft.value.total);
}

onMounted(() => {
  // timer = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
/* Add any styles you need here */
</style>
