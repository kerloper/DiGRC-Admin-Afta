<script setup>
import {ref, computed} from "vue";
import SearchInput from "@/components/Search/SearchInput.vue";
import SearchDropdown from "@/components/Search/SearchDropdown.vue";
import BaseButton from "@/components/BaseButton.vue";
import {useDebounceFn} from "@vueuse/core";
import {useI18n} from "vue-i18n";

const {t: $t} = useI18n()
const props = defineProps({
  moduleList: {
    type: Array,
    required: true,
  },
  roleList: {
    type: Array,
    required: true,
  },
});

const search = ref("");
const searchState = ref({
  module: {selected: 0},
  role: {selected: 0},
});
const dropdownConfigs = computed(() => [
  {
    key: "module",
    label: "users.module",
    options: props.moduleList || [],
  },
  {
    key: "role",
    label: "users.role",
    options: props.roleList || [],
    displayProperty: "title",
  },
]);

const dropdownRefs = ref()

const showClearButton = computed(() =>
    Object.values(searchState.value).some((state) => state.selected > 0) || search.value.trim().length > 0
);

const emit = defineEmits([
  "searchTitle",
  "searchModule",
  "searchRole",
  "clearFilters",
]);

const searchTitle = useDebounceFn(() => {
  emit("searchTitle", search.value);
}, 500);

function handleSearch(key, items) {
  searchState.value[key].selected = items.length;
  emit(`search${key.charAt(0).toUpperCase() + key.slice(1)}`, items);
}

function clearFilters() {
  emit("clearFilters");
  search.value = "";
  // Call clear method on each dropdown
  Object.keys(searchState.value).forEach((key, index) => {
    if (dropdownRefs.value[index]) {
      dropdownRefs.value[index].clear(); // Call the child's `clear` function
    }
    searchState.value[key].selected = 0; // Reset the state
  });
}
</script>

<template>
  <div class="flex gap-2 flex-wrap 2xl:flex-nowrap">
    <!-- Search Input -->
    <SearchInput v-model="search" @input="searchTitle"/>

    <!-- Dropdowns -->
    <SearchDropdown
        v-for="config in dropdownConfigs"
        :key="config.key"
        :search-placeholder="$t('general.search-module')"
        ref="dropdownRefs"
        :button-name="$t(config.label)"
        :options="config.options"
        :display-property="config.displayProperty"
        @change="(items) => handleSearch(config.key, items)"
    />

    <!-- Clear Filters Button -->
    <BaseButton
        type="button"
        class="btn-outline btn-primary h-8"
        size="xs"
        v-if="showClearButton"
        @click="clearFilters"
    >
      {{ $t("button.clear-filters") }}
    </BaseButton>
  </div>
</template>
