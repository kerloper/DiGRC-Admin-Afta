<script setup>
import {ref, watch, computed, onMounted, shallowRef} from "vue";
import {useI18n} from "vue-i18n";

// Props
const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  modelValue: { // Array of selected uniqueKeys
    type: Array,
    default: () => []
  },
  uniqueKey: {
    type: String,
    required: true
  },
  headers: { // Display names for columns
    type: Array,
    required: true
  },
  keys: { // Property keys from data objects for columns
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: null
  },
  showSelected: {
    type: Boolean,
    default: true
  },
  cssClass: {
    type: String,
    default: 'h-48' // Default height for the scrollable area
  },
  searchableColumns: {
    type: Array,
    default: () => []
  },
  filterableColumns: {
    type: Array,
    default: () => []
  },
  showSelectAll: {
    type: Boolean,
    default: true
  },
  // --- New Pagination Props ---
  pagination: {
    type: Boolean,
    default: false
  },
  pageSizeOptions: {
    type: Array,
    default: () => [10, 25, 50, 100]
  },
  defaultPageSize: {
    type: Number,
    default: 10 // Default to the first option if not specified or if this is not in options
  }
});

// Emits
const emit = defineEmits(["update:modelValue"]);
const {t: $t} = useI18n()

// --- State for search and filters ---
const searchTerms = ref({});
const filterSelections = ref({});

// --- State for Pagination ---
const currentPage = shallowRef(1);
const currentLimit = ref(props.defaultPageSize);

// Initialize currentLimit ensuring it's a valid option
onMounted(() => {
  if (props.pagination) {
    if (props.pageSizeOptions.includes(props.defaultPageSize)) {
      currentLimit.value = props.defaultPageSize;
    } else if (props.pageSizeOptions.length > 0) {
      currentLimit.value = props.pageSizeOptions[0]; // Fallback to the first option
    } else {
      currentLimit.value = 10; // Absolute fallback
      if (!props.pageSizeOptions.includes(10) && props.pageSizeOptions.length === 0) {
        // If pageSizeOptions is empty and defaultPageSize is not 10, effectively add 10 as an option.
        // This is a silent fallback, consider warning if props.pageSizeOptions is empty but pagination is on.
      }
    }
  }
});


watch(() => props.searchableColumns, (newSearchable) => {
  const newTerms = {};
  newSearchable.forEach(key => {
    newTerms[key] = searchTerms.value[key] || '';
  });
  searchTerms.value = newTerms;
}, { immediate: true, deep: true });

watch(() => props.filterableColumns, (newFilterable) => {
  const newSelections = {};
  newFilterable.forEach(col => {
    newSelections[col.key] = filterSelections.value[col.key] || null;
  });
  filterSelections.value = newSelections;
}, { immediate: true, deep: true });


// --- Computed Properties ---

const filteredData = computed(() => {
  let items = [...props.data];
  props.searchableColumns.forEach(key => {
    const searchTerm = searchTerms.value[key]?.toLowerCase().trim();
    if (searchTerm) {
      items = items.filter(item =>
          String(item[key] ?? '').toLowerCase().includes(searchTerm)
      );
    }
  });
  props.filterableColumns.forEach(filterConfig => {
    const selectedValue = filterSelections.value[filterConfig.key];
    if (selectedValue !== null && selectedValue !== undefined && selectedValue !== '') {
      items = items.filter(item => item[filterConfig.key] === selectedValue);
    }
  });
  return items;
});

// Reset to page 1 when filters/search terms change, or when data itself changes
watch(filteredData, () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1;
  }
});
watch(() => props.data, () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1;
  }
}, { deep: true });


// --- Pagination Computed Properties ---
const totalPages = computed(() => {
  if (!props.pagination || !filteredData.value.length) return 1;
  return Math.ceil(filteredData.value.length / currentLimit.value);
});

const paginatedData = computed(() => {
  if (!props.pagination) {
    return filteredData.value; // If pagination is off, show all filtered data
  }
  const start = (currentPage.value - 1) * currentLimit.value;
  const end = start + currentLimit.value;
  return filteredData.value.slice(start, end);
});

const displayRange = computed(() => {
  if (!filteredData.value.length) return $t('general.no-items');
  const startItem = (currentPage.value - 1) * currentLimit.value + 1;
  const endItem = Math.min(currentPage.value * currentLimit.value, filteredData.value.length);
  return `${$t('general.showing')} ${startItem}-${endItem} ${$t('general.of')} ${filteredData.value.length}`;
});

// Data for rendering in the table (either paginated or all filtered data)
const tableDisplayData = computed(() => {
  return props.pagination ? paginatedData.value : filteredData.value;
});


// --- Select All Logic (operates on full filteredData) ---
const allVisibleItemIdsInFilteredData = computed(() => { // Renamed for clarity
  return filteredData.value.map(item => item[props.uniqueKey]);
});

const isAllSelected = computed(() => {
  if (!allVisibleItemIdsInFilteredData.value.length) return false;
  return allVisibleItemIdsInFilteredData.value.every(id => props.modelValue.includes(id));
});

const isIndeterminate = computed(() => {
  if (!allVisibleItemIdsInFilteredData.value.length) return false;
  const selectedVisibleCount = allVisibleItemIdsInFilteredData.value.filter(id => props.modelValue.includes(id)).length;
  return selectedVisibleCount > 0 && selectedVisibleCount < allVisibleItemIdsInFilteredData.value.length;
});


// --- Methods ---
const toggleSelection = (id) => {
  const selected = [...props.modelValue];
  const index = selected.indexOf(id);
  if (index > -1) {
    selected.splice(index, 1);
  } else {
    selected.push(id);
  }
  emit("update:modelValue", selected);
};

const selectAll = (event) => {
  const idsToProcess = allVisibleItemIdsInFilteredData.value; // Operates on all filtered data
  let currentSelected = [...props.modelValue];
  if (event.target.checked) {
    idsToProcess.forEach(id => {
      if (!currentSelected.includes(id)) {
        currentSelected.push(id);
      }
    });
  } else {
    currentSelected = currentSelected.filter(id => !idsToProcess.includes(id));
  }
  emit("update:modelValue", currentSelected);
};

const getFilterOptions = (key) => {
  const columnConfig = props.filterableColumns.find(fc => fc.key === key);
  return columnConfig ? columnConfig.options : [];
};

const getFilterPlaceholder = (key) => {
  const columnConfig = props.filterableColumns.find(fc => fc.key === key);
  return columnConfig ? (columnConfig.placeholder || `Filter ${props.headers[props.keys.indexOf(key)]}`) : 'Filter...';
};

// --- Pagination Methods ---
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const changeLimit = (event) => {
  const newLimit = parseInt(event.target.value, 10);
  if (props.pageSizeOptions.includes(newLimit)) {
    currentLimit.value = newLimit;
    currentPage.value = 1; // Reset to first page
  }
};

// Generate page numbers for display, with ellipsis for many pages
const pageNumbers = computed(() => {
  if (!props.pagination) return [];
  const total = totalPages.value;
  const current = currentPage.value;
  const delta = 1; // How many pages to show around current page
  const range = [];
  const rangeWithDots = [];
  let l;

  range.push(1);
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i);
  }
  if (total > 1) {
    range.push(total);
  }

  range.forEach((i) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  });
  return rangeWithDots;
});

</script>

<template>
  <div class="overflow-hidden w-full my-1">
    <span class="label-text ms-0.5" v-if="title">{{ title }}</span>
    <div
        class="overflow-y-auto mt-1 rounded-md border"
        :class="[props.pagination ? 'h-auto' : cssClass]"
    >
      <table class="table table-sm w-full border-collapse border-spacing-0 table-fixed">
        <thead class="bg-gray-200 sticky top-0 z-10">
        <tr>
          <th class="text-start p-2 w-12" v-if="showSelectAll">
            <label>
              <input
                  type="checkbox"
                  class="checkbox checkbox-xs checkbox-primary"
                  @change="selectAll($event)"
                  :checked="isAllSelected"
                  :indeterminate="isIndeterminate"
                  :disabled="!filteredData.length" />
            </label>
          </th>
          <th
              v-for="(header, index) in headers"
              :key="`header-${keys[index]}`"
              class="text-start text-sm p-2"
          >
            <div class="font-semibold">{{ header }}</div>
            <input
                v-if="searchableColumns.includes(keys[index])"
                type="text"
                v-model="searchTerms[keys[index]]"
                :placeholder="`Search ${header}...`"
                class="input input-xs input-bordered w-full max-w-xs mt-1 py-1 px-2 text-xs"
                @click.stop
            />
            <select
                v-if="filterableColumns.some(fc => fc.key === keys[index])"
                v-model="filterSelections[keys[index]]"
                class="select select-xs select-bordered w-full max-w-xs mt-1 py-1 px-2 text-xs"
                @click.stop
            >
              <option :value="null">{{ getFilterPlaceholder(keys[index]) }}</option>
              <option
                  v-for="option in getFilterOptions(keys[index])"
                  :key="option"
                  :value="option"
              >
                {{ option }}
              </option>
            </select>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="!tableDisplayData.length">
          <td :colspan="headers.length + (showSelectAll ? 1 : 0)" class="text-center p-4 text-gray-500">
            {{ filteredData.length === 0 && (Object.values(searchTerms).some(t => t) || Object.values(filterSelections).some(s => s !== null)) ? $t('general.no-data-matching-your-criteria')   : $t('general.no-data-available') }}
          </td>
        </tr>
        <tr
            v-for="(item) in tableDisplayData" :key="item[uniqueKey]"
            class="hover:bg-gray-100 cursor-pointer text-xs"
            @click="toggleSelection(item[uniqueKey])"
        >
          <td class="p-2 w-12" v-if="showSelectAll">
            <label>
              <input
                  type="checkbox"
                  class="checkbox checkbox-xs checkbox-primary"
                  :value="item[uniqueKey]"
                  :checked="modelValue.includes(item[uniqueKey])"
                  @change.stop="toggleSelection(item[uniqueKey])"
                  @click.stop
              />
            </label>
          </td>
          <td
              v-for="(keyField) in keys"
              :key="`${item[uniqueKey]}-${keyField}`"
              class="p-2 truncate"
              :title="item[keyField]"
          >
            {{ item[keyField] }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-if="props.pagination && filteredData.length > 0" class="flex items-center justify-between mt-2 p-2 text-xs">
      <div class="flex items-center">
        <span class="me-2">{{ $t('general.show') }}:</span>
        <select
            class="select select-xs select-bordered"
            :value="currentLimit"
            @change="changeLimit"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ $t('general.size') }}
          </option>
        </select>
        <span class="ms-2">{{ $t('general.entries') }}</span>
      </div>

      <div class="text-gray-600">
        {{ displayRange }}
      </div>

      <div class="flex items-center space-x-1">
        <button
            @click="goToPage(1)"
            :disabled="currentPage === 1"
            class="btn btn-xs btn-outline"
            aria-label="First page"
            type="button"
        >
          &laquo;&laquo;
        </button>
        <button
            @click="prevPage"
            type="button"
            :disabled="currentPage === 1"
            class="btn btn-xs btn-outline"
            aria-label="Previous page"
        >
          &laquo;
        </button>
        <template v-for="(page, index) in pageNumbers" :key="`page-${index}`">
          <button
              v-if="page !== '...'"
              @click="goToPage(page)"
              type="button"
              :class="['btn btn-xs', currentPage === page ? 'btn-active btn-primary' : 'btn-outline']"
          >
            {{ page }}
          </button>
          <span v-else class="px-2 py-1">...</span>
        </template>
        <button
            @click="nextPage"
            type="button"
            :disabled="currentPage === totalPages || totalPages === 0"
            class="btn btn-xs btn-outline"
            aria-label="Next page"
        >
          &raquo;
        </button>
        <button
            @click="goToPage(totalPages)"
            type="button"
            :disabled="currentPage === totalPages || totalPages === 0"
            class="btn btn-xs btn-outline"
            aria-label="Last page"
        >
          &raquo;&raquo;
        </button>
      </div>
    </div>


    <div v-if="showSelected && modelValue.length > 0" class="mt-2 p-2 border rounded-md text-xs bg-gray-50">
      <strong>{{$t('general.selected-items')}} ({{ modelValue.length }}):</strong>
      <ul class="list-disc list-inside max-h-24 overflow-y-auto mt-1">
        <li v-for="selectedId in modelValue" :key="`selected-${selectedId}`">
          {{
            data.find(item => item[uniqueKey] === selectedId) ?
                keys.map(key => data.find(item => item[uniqueKey] === selectedId)[key]).join(' / ') :
                selectedId
          }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.table-fixed {
  table-layout: fixed;
}
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.input-xs, .select-xs {
  height: 1.75rem;
  min-height: 1.75rem;
}
/* DaisyUI btn active might need focus outline removed if not desired */
.btn.btn-active:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
</style>