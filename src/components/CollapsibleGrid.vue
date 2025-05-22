<script setup>
import {ref, computed, watch, onMounted, shallowRef} from 'vue';
import {useI18n} from "vue-i18n";

const {t: $t} = useI18n()
const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
  hasSearch: {
    type: Boolean,
    default: true
  },
  initialGroupBy: {
    type: String,
    default: 'module',
  },
  modelValue: { // This is v-model="permissions"
    type: Array,
    default: () => [],
  },
  groupOptions: {
    type: Array,
    default: () => [],
  },
  itemDisplayField: {
    type: String,
    default: 'resource', // In your example call, this is 'title'
  },
  itemSearchFields: {
    type: Array,
    default: (props) => [props.itemDisplayField],
  },
  customClass :{
    type: String,
    default: 'columns-1 md:columns-2 lg:columns-3 gap-2 '
  }
});

const emit = defineEmits(['update:modelValue', 'selection-changed']);

// --- Core State ---
const selectedItems = ref({}); // Structure: { [groupKey]: { [itemId]: boolean } }
const expandedGroups = ref({});
const currentGroupBy = ref(props.initialGroupBy);

// --- Search State ---
const globalGroupFilterTerm = shallowRef('');
const globalItemSearchTerm = shallowRef('');
const groupSearchTerms = ref({});

// --- Initialization and State Reset ---
// This function should only reset the internal selectedItems state
// without emitting an update that clears the parent's modelValue.
// The parent's modelValue is the source of truth for what *should* be selected.
const resetInternalSelectionStateStructure = () => {
  selectedItems.value = {};
};

const resetUIStates = () => {
  expandedGroups.value = {};
  groupSearchTerms.value = {};
  // Global search terms are independent of grouping changes
};

const initializeSelectedItems = () => {
  const newSelectedItems = {};
  const groupByKey = currentGroupBy.value; // Use the reactive currentGroupBy

  // 1. Build the structure for newSelectedItems based on all props.items and the current groupByKey.
  // Initialize all items as unselected.
  props.items.forEach(item => {
    const groupVal = item[groupByKey];
    // Ensure groupKeyStr handles null/undefined groupVal gracefully
    const groupKeyStr = (groupVal === undefined || groupVal === null) ? 'Undefined' : String(groupVal);

    if (!newSelectedItems[groupKeyStr]) {
      newSelectedItems[groupKeyStr] = {};
    }
    // Ensure item.id exists and is used as the key. Initialize as false.
    if (item.id !== undefined) {
      newSelectedItems[groupKeyStr][item.id] = false;
    } else {
      console.warn("Item in props.items is missing an 'id':", item);
    }
  });

  // 2. Mark items as selected based on props.modelValue.
  // props.modelValue is an array of selected item *objects*.
  props.modelValue.forEach(selectedModelItem => {
    // It's crucial that selectedModelItem has an 'id' to match against props.items.
    // And that items in props.items also have a unique 'id'.
    if (selectedModelItem && selectedModelItem.id !== undefined) {
      // Find the original item in props.items to get its current group.
      // This assumes that selectedModelItem is an object from the original items list or has a compatible structure.
      const originalItem = props.items.find(item => item.id === selectedModelItem.id);

      if (originalItem) {
        const groupVal = originalItem[groupByKey];
        const groupKeyStr = (groupVal === undefined || groupVal === null) ? 'Undefined' : String(groupVal);

        // Ensure the group exists in newSelectedItems (it should, from step 1)
        if (newSelectedItems[groupKeyStr]) {
          newSelectedItems[groupKeyStr][originalItem.id] = true;
        } else {
          // This case should ideally not happen if step 1 correctly processes all items.
          // It might indicate an item in modelValue whose group is not found in props.items,
          // or an issue with groupKey generation.
          // console.warn(`Group '${groupKeyStr}' for item ID '${originalItem.id}' not initialized. This might indicate an inconsistency.`);
          // If you want to be robust, you could create the group here:
          // newSelectedItems[groupKeyStr] = { [originalItem.id]: true };
        }
      } else {
        // console.warn(`Item from modelValue with id '${selectedModelItem.id}' not found in props.items. It will not be marked as selected.`);
      }
    } else {
      // console.warn('Item from modelValue is undefined or has no id:', selectedModelItem);
    }
  });
  selectedItems.value = newSelectedItems;
};


// --- Search Helper ---
const itemMatchesSearchTerm = (item, searchTerm, searchFields) => {
  if (!searchTerm || searchTerm.trim() === '') return true;
  const term = searchTerm.trim().toLowerCase();
  return searchFields.some(field => {
    const fieldValue = item[field];
    return fieldValue && String(fieldValue).toLowerCase().includes(term);
  });
};

// --- Computed Property for Filtered and Grouped Items ---
const filteredAndGroupedItems = computed(() => {
  const groupByKey = currentGroupBy.value;

  const allItemsByGroup = {};
  props.items.forEach(item => {
    const groupVal = item[groupByKey];
    const key = (groupVal === undefined || groupVal === null) ? 'Undefined' : String(groupVal);
    if (!allItemsByGroup[key]) {
      allItemsByGroup[key] = [];
    }
    allItemsByGroup[key].push(item);
  });

  let groupEntries = Object.entries(allItemsByGroup);

  const globalGroupSearch = globalGroupFilterTerm.value;
  if (globalGroupSearch && globalGroupSearch.trim() !== '') {
    groupEntries = groupEntries.filter(([, itemsInGroup]) =>
        itemsInGroup.some(item => itemMatchesSearchTerm(item, globalGroupSearch, props.itemSearchFields))
    );
  }

  return groupEntries
      .map(([groupKey, itemsInGroup]) => {
        let currentlyFilteredItems = itemsInGroup;
        const perGroupSearch = groupSearchTerms.value[groupKey];
        if (perGroupSearch && perGroupSearch.trim() !== '') {
          currentlyFilteredItems = currentlyFilteredItems.filter(item =>
              itemMatchesSearchTerm(item, perGroupSearch, props.itemSearchFields)
          );
        }

        const globalItemSearch = globalItemSearchTerm.value;
        if (globalItemSearch && globalItemSearch.trim() !== '') {
          currentlyFilteredItems = currentlyFilteredItems.filter(item =>
              itemMatchesSearchTerm(item, globalItemSearch, props.itemSearchFields)
          );
        }
        return [groupKey, currentlyFilteredItems];
      })
      .filter(([, itemsToDisplay]) => itemsToDisplay.length > 0)
      .sort(([a], [b]) => String(a).localeCompare(String(b)));
});

// --- Selection Logic ---
const isGroupSelected = (groupKey, itemsForSelectionCheck) => {
  if (!itemsForSelectionCheck || itemsForSelectionCheck.length === 0) return false;
  const groupSelections = selectedItems.value[groupKey] || {};
  return itemsForSelectionCheck.every(item => groupSelections[item.id]);
};

const isGroupPartiallySelected = (groupKey, itemsForSelectionCheck) => {
  if (!itemsForSelectionCheck || itemsForSelectionCheck.length === 0) return false;
  const groupSelections = selectedItems.value[groupKey] || {};
  const selectedCount = itemsForSelectionCheck.filter(item => groupSelections[item.id]).length;
  return selectedCount > 0 && selectedCount < itemsForSelectionCheck.length;
};

const toggleGroupSelection = (groupKey, itemsToToggle) => {
  if (!itemsToToggle || itemsToToggle.length === 0) return;

  const currentlySelected = isGroupSelected(groupKey, itemsToToggle);
  const newSelectionState = !currentlySelected;
  const groupSelectionsUpdate = {...(selectedItems.value[groupKey] || {})};

  itemsToToggle.forEach(item => {
    if (item.id !== undefined) {
      groupSelectionsUpdate[item.id] = newSelectionState;
    }
  });

  selectedItems.value = {
    ...selectedItems.value,
    [groupKey]: groupSelectionsUpdate,
  };
  emitCurrentSelection();
};

const toggleItemSelection = (groupKey, itemId) => {
  const groupSelectionsUpdate = {...(selectedItems.value[groupKey] || {})};
  groupSelectionsUpdate[itemId] = !groupSelectionsUpdate[itemId];

  selectedItems.value = {
    ...selectedItems.value,
    [groupKey]: groupSelectionsUpdate,
  };
  emitCurrentSelection();
};

// --- Expansion Logic ---
const toggleGroupExpansion = (groupKey) => {
  expandedGroups.value = {
    ...expandedGroups.value,
    [groupKey]: !expandedGroups.value[groupKey],
  };
};

// --- Emit Selection ---
const emitCurrentSelection = () => {
  const allSelectedObjects = [];
  // Create a map for quick lookup of original item objects by their ID.
  // This is important because props.modelValue expects an array of the actual item objects.
  const itemMap = new Map(props.items.map(item => [item.id, item]));

  for (const groupKey in selectedItems.value) {
    for (const itemId in selectedItems.value[groupKey]) {
      if (selectedItems.value[groupKey][itemId]) {
        // itemId from selectedItems keys might be strings, so ensure consistent lookup
        const originalItem = itemMap.get(Number(itemId)) || itemMap.get(String(itemId));
        if (originalItem) {
          allSelectedObjects.push(originalItem);
        } else {
          // console.warn(`Selected item ID '${itemId}' not found in original props.items. Cannot emit.`);
        }
      }
    }
  }
  emit('update:modelValue', allSelectedObjects);
  emit('selection-changed', allSelectedObjects);
};

// --- Watchers ---
watch(() => props.modelValue, (newValue, oldValue) => {
  // Only re-initialize if the actual content of modelValue has changed in a meaningful way.
  // A deep watch might trigger if the order changes but content is same.
  // For simplicity, we re-initialize. Consider a more nuanced check if performance is an issue.
  initializeSelectedItems();
}, {deep: true});

watch(() => props.items, () => {
  initializeSelectedItems(); // Re-initialize selection based on new items and current modelValue
  // Clean up groupSearchTerms for groups that no longer exist
  const currentGroupKeys = new Set(props.items.map(item => String(item[currentGroupBy.value] ?? 'Undefined')));
  const newGroupSearchTerms = {};
  for (const key in groupSearchTerms.value) {
    if (currentGroupKeys.has(key)) newGroupSearchTerms[key] = groupSearchTerms.value[key];
  }
  groupSearchTerms.value = newGroupSearchTerms;
}, {deep: true});

watch(currentGroupBy, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    // DO NOT emit to clear modelValue here.
    // The modelValue (permissions from parent) is the source of truth for what's selected.
    // resetInternalSelectionStateStructure(); // Not strictly needed as initializeSelectedItems rebuilds it
    resetUIStates(); // Reset expansions, group-specific searches
    initializeSelectedItems(); // Rebuild the internal selectedItems structure based on current modelValue and NEW groupBy
  }
});

onMounted(() => {
  initializeSelectedItems();
});

</script>

<template>
  <div class="grid grid-cols-1 gap-2 transition-all duration-500">
    <div class="px-2 grid md:grid-cols-3 gap-4  transition-all duration-500   pb-4 mb-2" v-if="hasSearch">
      <div v-if="props.groupOptions.length > 0" class="flex-shrink-0">
        <select
            id="groupBySelect"
            v-model="currentGroupBy"
            class="select select-bordered select-sm w-full"
        >
          <option
              v-for="option in props.groupOptions"
              :key="option.value"
              :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="w-full">
        <input
            v-model="globalGroupFilterTerm"
            type="search"
            :placeholder="$t('general.search-all-items-(filters-groups)')"
            class="input input-bordered input-sm w-full"
        />
      </div>

      <div class=" ">
        <input
            v-model="globalItemSearchTerm"
            type="search"
            :placeholder="$t('general.search-items-within-visible-groups')"
            class="input input-bordered input-sm w-full"
        />
      </div>
    </div>
    <div v-if="filteredAndGroupedItems.length > 0"
         class="transition-all duration-500" :class="customClass">
      <div
          v-for="([groupKey, groupItems]) in filteredAndGroupedItems"
          :key="groupKey"
          class="border border-base-200 px-2 overflow-hidden flex flex-col rounded-md  transition-all duration-500   break-inside-avoid-column"
      >
        <div class="flex items-center justify-between transition-all duration-500 py-2">
          <div class="flex items-center space-x-2 sm:space-x-3 flex-grow min-w-0  transition-all duration-500">
            <input
                type="checkbox"
                class="checkbox checkbox-primary flex-shrink-0 checkbox-sm"
                :checked="isGroupSelected(groupKey, groupItems)"
                :indeterminate.prop="isGroupPartiallySelected(groupKey, groupItems)"
                :disabled="groupItems.length === 0"
                @change="toggleGroupSelection(groupKey, groupItems)"
            />
            <div class="font-medium truncate" :title="groupKey">
              {{ groupKey }}
              <span class="text-xs opacity-70">({{ groupItems.length }})</span>
            </div>
          </div>
          <button
              type="button"
              class="btn btn-xs btn-ghost ml-2 flex-shrink-0"
              @click="toggleGroupExpansion(groupKey)"
              :aria-expanded="expandedGroups[groupKey] || false"
              :aria-label="expandedGroups[groupKey] ? `Collapse ${groupKey}` : `Expand ${groupKey}`"
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 transition-transform duration-200"
                :class="{ 'rotate-180': expandedGroups[groupKey] }"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>
        <div
            v-show="expandedGroups[groupKey]"
            class="flex-grow max-h-60 overflow-y-auto pt-1 pb-2 pl-1"
            role="list"
        >
          <div v-if="groupItems.length > 0" class="space-y-1">
            <label
                v-for="item in groupItems"
                :key="item.id"
                class="flex items-center space-x-2 cursor-pointer hover:text-primary p-1 rounded transition-colors duration-150"
                role="listitem"
            >
              <input
                  type="checkbox"
                  class="checkbox checkbox-xs checkbox-primary"
                  :value="item.id"
                  :checked="selectedItems[groupKey]?.[item.id] || false"
                  @change="toggleItemSelection(groupKey, item.id)"
              />
              <span class="text-sm" :class="[(selectedItems[groupKey]?.[item.id] || false)?'text-primary':'']">{{
                  item[props.itemDisplayField]
                }}</span>
            </label>
          </div>
          <p v-else class="text-sm text-base-content/70 italic p-2">
            {{ $t('general.no-items-match-your-current-search-filters-in-this-group') }}
          </p>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-10">
      <p class="text-lg text-base-content/70">
        {{ $t('general.no-items-match-your-current-search-filters') }}
      </p>
      <p v-if="globalGroupFilterTerm || globalItemSearchTerm" class="text-sm text-base-content/50 mt-1">
        {{ $t('general.try-adjusting-your-search-terms') }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transition for expand/collapse */
div[v-show] {
  transition: opacity 0.3s ease-in-out, max-height 0.3s ease-in-out;
  /* overflow: hidden; ensure content isn't visible during collapse */
}

input[type="checkbox"]:indeterminate {
  background-color: hsl(var(--p)); /* Primary color for DaisyUI */
  border-color: hsl(var(--p));
}

input[type="checkbox"]:indeterminate::before {
  content: "";
  display: block;
  width: 0.5rem;
  height: 0.125rem;
  background-color: hsl(var(--b1)); /* Typically white or base color for contrast */
  margin: auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.max-h-60 {
  max-height: 15rem; /* approx 240px */
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Ensure columns don't break content weirdly */
.break-inside-avoid-column {
  break-inside: avoid-column;
}

/* DaisyUI select typically doesn't need placeholder styling like input,
   but if you use a disabled first option as a placeholder: */
select option:disabled {
  color: #9ca3af; /* A generic placeholder color */
}
</style>