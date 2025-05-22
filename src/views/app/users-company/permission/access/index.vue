<script setup>
// KERLOPER:UPDATE 2025MAY15
import {computed, nextTick, ref, shallowRef, watch} from "vue";
import {useI18n} from "vue-i18n";
import API from "@/services/API.js";
import BaseButton from "@/components/BaseButton.vue";
import AddPermissionModal from "./AddPermissionModal.vue";
import FilterSection from "@/views/app/users-company/permission/access/FilterSection.vue";

const {t: $t} = useI18n();
const addPermissionModalId = 'add_permission_modal';
const showAddPermissionModalFlag = ref(false);
const {data: roles} = API.roleList();
const roleList = computed(() => roles?.value?.data?.list || []);
const isProcessing = shallowRef(false)
const {data: modules} = API.moduleList();
const moduleList = computed(() => modules?.value?.data || []);

const {data: permissionResources,} = API.listResourcePermissionRequest({'limit': 1000});
const permissionResourceList = computed(() => {
  let resources = permissionResources?.value?.data?.list || [];
  // Apply filters if selected
  if (filterItems.value?.module?.length > 0) {
    resources = resources.filter(resource => filterItems.value?.module?.includes(resource.module));
  }
  if (filterItems.value?.title) {
    resources = resources.filter(resource => resource.module?.includes(filterItems.value?.title));
  }
  return resources;
});

const {data: permissionRoles} = API.listRolePermissionRequest({page: 1, limit: 3000});
const permissionRoleList = computed(() => permissionRoles?.value?.data?.list || []);

// Paginated permissions
const paginatedPermissions = computed(() => {
  return permissionResourceList.value;
});
const keyValueList = ref({});
const isLoading = shallowRef(true)
const filterItems = ref({
  title: null,
  role: null,
  module: null,
})

function searchTitle(title) {
  filterItems.value.title = title
}

function searchModule(module) {
  filterItems.value.module = module.map(f => f)
}

function searchRole(role) {
  filterItems.value.role = role.map(f => f.id)
}

function clearFilters() {
  filterItems.value.module = ''
  filterItems.value.role = ''
  filterItems.value.title = ''
}

function showAddPermissionModal() {
  showAddPermissionModalFlag.value = true;
  showModalById('add_permission_modal');
}

function showModalById(modalId) {
  document.getElementById(modalId).showModal();
}

function closeModalById(modalId) {
  document.getElementById(modalId).close();
}

function closePermissionModal() {
  closeModalById(addPermissionModalId);
}

function execute() {
  console.log('fake execute');
}

const hasPermission = (role, permission) => {
  const roleName = role?.name ?? '';
  const permName = permission?.key ?? '';
  return keyValueList.value[roleName]?.includes(permName) ?? false;
};

const togglePermission = async (role, permission) => {
  isProcessing.value = true
  const existingPermissionIndex = permissionRoleList.value.findIndex(
      p => p.roleId === role.id && p.permissionId === permission.id
  );
  let payload = {
    "resource": permission.key,
    "role": role.name,
  }
  if (existingPermissionIndex > -1) {
    permissionRoleList.value.splice(existingPermissionIndex, 1);
    payload.action = "revoke"
  } else {
    permissionRoleList.value.push({roleId: role.id, permissionId: permission.id});
    payload.action = "grant"
  }
  await API.permissionManage(payload)
  isProcessing.value = false
};


watch(() => permissionRoleList.value, async () => {
  if (permissionRoleList.value.length > 0) {
    keyValueList.value = {};
    permissionRoleList.value.forEach((permission) => {
      const role = permission.role;
      const resource = permission.resource;
      if (!keyValueList.value[role]) {
        keyValueList.value[role] = [];
      }
      keyValueList.value[role].push(resource);
    });
    await nextTick()
    isLoading.value = false
  }
}, {deep: true, immediate: true});

</script>

<template>
  <div>
    <AddPermissionModal
        :role-list="roleList"
        :module-list="moduleList"
        :modalId="addPermissionModalId"
        @refresh="execute"
        @close="closePermissionModal"
    />
    <div>
      <div class="flex flex-col gap-4">
        <!-- Header with filters and actions -->
        <div class="flex flex-col md:flex-row justify-between gap-4 border-b-2 pb-2">
          <div class="flex flex-row md:flex-row gap-2 md:gap-4 w-full px-2">
            <FilterSection
                class="w-full"
                @search-title="searchTitle"
                @search-module="searchModule"
                @search-role="searchRole"
                :module-list="moduleList"
                :role-list="roleList"
                @clear-filters="clearFilters"/>
          </div>

          <div class="flex gap-2 self-end md:self-center min-w-36 mt-auto">
            <BaseButton
                class="btn-primary text-white mt-auto"
                size="xs"
                :onclick="showAddPermissionModal"
            >
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="size-5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25 1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"/>
                </svg>
                <span class="p-1">
                  {{ $t("button.add-permission") }}
                </span>
              </div>
            </BaseButton>
          </div>
        </div>

        <!-- Main table container with horizontal scrolling -->
        <div class="relative w-full" v-if="isLoading">
          <progress class=" absolute progress w-full progress-primary"></progress>
        </div>
        <div class="min-h-[60vh] bg-base-300 rounded-md border-2" v-else>
          <div class="overflow-x-auto relative">
            <!-- Horizontal scroll indicator -->

            <!-- Table with fixed first column -->
            <div class="overflow-x-auto">
              <table class="table table-zebra w-full" :class="[isProcessing?'skeleton':'']">
                <thead class="sticky top-0">
                <tr>
                  <th class="sticky left-0 bg-base-100   rounded-none whitespace-nowrap"
                      :class="[isProcessing?'skeleton':'']">
                    <div class="text-xs  rounded-none">
                      {{ $t('menu.permission') }} \ {{ $t('menu.roles') }}
                    </div>
                  </th>
                  <th
                      style="writing-mode: vertical-lr; vertical-align: top; "
                      v-for="role in roleList"
                      :key="role.id"
                      class="text-center border"
                      :class="{ 'bg-primary/10 text-primary font-semibold': filterItems.role?.includes(role.id) }"
                  >

                    <span class="inline-block leading-tight">{{ role.title }}</span>
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="permission in paginatedPermissions" :key="permission.id"
                    :class="[isProcessing?'skeleton':'']">
                  <th class="sticky left-0 bg-base-100 whitespace-nowrap w-20 rounded-none"
                      :class="[isProcessing?'skeleton':'']">
                    {{ permission.title }}
                    <div class="text-xs text-gray-500">{{ permission.resource }}</div>
                  </th>
                  <td
                      v-for="role in roleList"
                      :key="role.id"
                      class="text-center border"
                      :class="{ 'bg-primary/10': filterItems.role?.includes(role.id) }"
                  >
                    <input
                        type="checkbox"
                        :disabled="isProcessing"
                        :checked="hasPermission(role, permission)"
                        class="checkbox checkbox-primary checkbox-xs"
                        @change="togglePermission(role, permission)"
                    />
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>


/* Sticky column styles */
.sticky {
  position: sticky;
}


</style>