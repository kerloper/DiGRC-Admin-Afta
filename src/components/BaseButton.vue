<script setup>

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    default:'sm',
    validator(value) {
      return ['xs', 'sm','md', 'lg'].includes(value)
    }
  },

})
</script>

<template>
  <button class="btn transition-all rounded-md"
          :class="{'no-animation cursor-default pointer-events-none opacity-80':loading || disabled,
          'btn-xs':size === 'xs',
          'btn-sm':size === 'sm',
          'btn-md':size === 'md',
          'btn-lg':size === 'lg',}">
    <Transition name="fade" mode="out-in">
      <span class="loading loading-dots"
            :class="{'loading-xs':size === 'xs',
                     'loading-sm':size === 'sm',
                     'loading-lg':size === 'lg',}"
            v-if="loading"/>
      <span v-else>
          <slot></slot>
      </span>
    </Transition>

  </button>
</template>

<style scoped>

</style>