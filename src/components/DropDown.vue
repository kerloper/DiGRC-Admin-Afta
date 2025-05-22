<script setup>

const props = defineProps({
  options: Array,
  displayProperty: String,
  noBtn: {
    type: Boolean,
    default: false
  },
  noPadding: {
    type: Boolean,
    default: false
  },
  showDownIcon: {
    type: Boolean,
    default: true
  },
  size: {
    default: 'md',
    validator(value) {
      return ['xs', 'sm', 'md', 'lg'].includes(value)
    }
  },

  contentWidth: String
})
const emit = defineEmits(['selectedOption'])

function onSelectedOption(value) {
  emit('selectedOption', value)
}

function handleClick() {
  const elem = document.activeElement;
  if (elem) {
    elem?.blur();
  }
}

</script>

<template>
  <div class="dropdown  dropdown-bottom ">
    <div tabindex="0" role="button" class="flex justify-center items-center rounded-md" :class="{'btn':!noBtn,'px-0':noPadding,
          'btn-xs':size === 'xs',
          'btn-sm':size === 'sm',
          'btn-md':size === 'md',
          'btn-lg':size === 'lg',}">
      <div class="relative" :class="{'pe-4':showDownIcon}">
        <slot></slot>

        <template v-if="showDownIcon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
               stroke="currentColor" class="size-4 absolute  -end-1.5 font-semibold" :class="{'top-0' : size !== 'xs', '-top-0.5':size === 'xs'}">
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
          </svg>
        </template>
      </div>
    </div>
    <ul tabindex="0" class="dropdown-content text-base-content z-10 menu p-2 shadow bg-base-100 rounded-md"
        :class="contentWidth">
      <template v-if="options && options.length">
        <li v-for="option in options " @click="onSelectedOption(option)">
          <a @click="handleClick()">
            <slot name="actions" :option="option">
              {{ option[displayProperty] }}
            </slot>
          </a>
        </li>
      </template>
      <template v-else>
        <div @click="handleClick()">
          <slot name="actions">
          </slot>
        </div>
      </template>

    </ul>
  </div>
</template>

<style scoped>

</style>