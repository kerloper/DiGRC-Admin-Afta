<script setup>

import {computed, reactive, ref, watch} from "vue";
import {useI18n} from "vue-i18n";

const {t: $t} = useI18n()
const props = defineProps({
  options: {type: Array, required: true},
  displayProperty: {
    type: String,
    required: false
  },
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
    },

  },
  buttonName: {required: true},
  enableSearch: {type: Boolean, default: false},
  isSingle: {type: Boolean, default: false},
  searchPlaceholder: {type: String},
  clearSearch: {type: Boolean},
  initData: {},
  contentWidth: String
})


const emit = defineEmits(["search", "change"]);

const search = ref("");
const isShow = ref(false);
const selectedOptions = ref([]);
const dropdownRef = ref(null);

const placeholder = computed(() => props.searchPlaceholder || $t("menu.search"));
const filteredOptions = computed(() =>
    !props.enableSearch && search.value.trim()
        ? props.options.filter(option =>
            option[props.displayProperty].toLowerCase().includes(search.value.toLowerCase())
        )
        : props.options
);


function clear() {
  search.value = "";
  selectedOptions.value = [];
}
defineExpose({
  clear
})

const searchOption = option => {
  emit("search", option);
};

const change = () => {
  console.log('change', selectedOptions.value)
  emit("change", selectedOptions.value);
};


// Handle initial data for selected options
watch(
    () => props.initData,
    value => {
      if (value) {
        selectedOptions.value.push(value);
      }
    }
);
watch(selectedOptions, (newValue, oldValue) => {
  console.log("Selected options changed:", {newValue, oldValue});
});

function handleClick() {
  const elem = document.activeElement;
  if (elem) {
    elem?.blur();
  }
}

</script>

<template>
  <div class="dropdown  dropdown-bottom ">
    <div tabindex="0" role="button" class="flex justify-center items-center rounded-md btn-sm"
         :class="{'btn':!noBtn,'px-0':noPadding}">
      <div class="relative" :class="{'pe-4':showDownIcon}">
        <div class="d-flex justify-between text-nowrap">
          <span>{{ buttonName }}</span>
          <span class="mx-2 badge badge-primary" v-if="selectedOptions.length">{{ selectedOptions.length }}</span>
        </div>

        <template v-if="showDownIcon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
               stroke="currentColor" class="size-4 absolute  -end-1.5 font-semibold"
               :class="{'top-0' : size !== 'xs', '-top-0.5':size === 'xs'}">
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
          </svg>
        </template>
      </div>
    </div>
    <div tabindex="0" class="dropdown-content text-base-content z-10 menu p-2 shadow bg-base-100 rounded-md"
         :class="[`size-${size}`]">
      <div
      >
        <div class="mx-2">
          <input
              v-model="search"
              :placeholder="placeholder"
              class="input input-bordered input-sm w-full mb-3"
              v-if="enableSearch"
          />
        </div>
        <ul class="list-unstyled list-height">
          <li
              v-for="(option, index) in filteredOptions"
              :key="(displayProperty?option[displayProperty]:option) + index"
              class="option-search"
              @click="searchOption(option)"
          >
            <slot :data="option">
              <label
                  v-if="!isSingle"
                  class="label cursor-pointer flex items-center justify-start px-3 py-2"
              >
                <input
                    type="checkbox"
                    class="checkbox checkbox-sm"
                    :value="option"
                    v-model="selectedOptions"
                    @change="change"
                />
                <span class="label-text ">{{ (props.displayProperty ? option[props.displayProperty] : option)  }}</span>
              </label>
              <span
                  v-else
                  class="py-2 px-3 d-inline-block cursor-pointer"
              >
                        {{ (props.displayProperty ? option[props.displayProperty] : option)  }}
                      </span>
            </slot>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<style scoped>
.size-sm {
  width: 200px;
}

.size-md {
  width: 300px;
}

.size-lg {
  width: 400px;
}

.size-xl {
  width: 500px;
}

.list-height {
  max-height: 300px;
  overflow-y: auto;
}


</style>