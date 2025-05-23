<script setup>
import API from "@/services/API.js";
import {computed, onMounted, reactive, ref} from "vue";
import BaseCard from "@/components/BaseCard.vue";
import BaseTable from "@/components/table/BaseTable.vue";
import RiskChart from "@/views/app/home/RiskChart.vue";
import EvidenceChart from "@/views/app/home/EvidenceChart.vue";
import FrameworkList from "@/views/app/home/FrameworkList.vue";
import TaskStatus from "@/views/app/home/TaskStatus.vue";
import {useUserStore} from "@/stores/user.js";
import {useI18n} from "vue-i18n";
import ConfigurationComponent from "@/components/ConfigurationComponent.vue";

const isLoading = ref(true)
const dashboard = ref(false)
const {t: $t} = useI18n()
async function dashboardDataRequest() {
  isLoading.value = true
  let response = []
  const {data, error} = await API.dashboardDataRequest()
  if (data.value) {
    response = data.value.data
  } else if (error.value) {
  }
  return response
}

const fetchData = async () => {

  const [dashboardData] = await Promise.all([
    dashboardDataRequest(),
  ]);

  dashboard.value = dashboardData;
  isLoading.value = false

};

// Fetch data when the component mounts
onMounted(fetchData);

const cardList = [
  {
    key: "framework_count",
    title: "framework",
    icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-5\">" +
        "  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z\" />" +
        "</svg>",
  },
  {
    key: "domain_count",
    title: "domain",
    icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-5\">" +
        "  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5\" />" +
        "</svg>",
  },
  {
    key: "control_count",
    title: "control",
    icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"size-5\">" +
        "  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z\" />" +
        "</svg>",
  },
]
const tableCompanyHeaders = [
  {label: "table.title", key: "title",},
  {label: "table.user-name", key: "user_name",},
  {label: "table.package", key: "package_title",},
]
const tableMemberHeaders = [
  {label: "table.name", key: "name",},
  {label: "table.email", key: "email",},
]

</script>

<template>
  <section>

    <ConfigurationComponent />

    <!-- START CARD SECTION   -->
    <div class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 gap-2">
      <div v-for="card in cardList" :key="card.key">
        <BaseCard
            class="grid grid-cols-1 min-h-28"
            :class="{'skeleton':isLoading}"
        >
          <div class="w-full flex flex-row gap-3" v-if="!isLoading">
            <span v-html="card.icon" class="mt-0.5 text-primary"/>
            {{ $t('title.' + card.title) }}
          </div>
          <div class="w-ful text-center min-h-10 pt-1">
            <span class="text-3xl">
              {{ dashboard[card.key] }}
            </span>
          </div>
        </BaseCard>
      </div>
    </div>
    <!-- END CARD SECTION   -->

    <!-- START CHARTS SECTION   -->
    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-1 lg:grid-cols-1 gap-2 my-2">
      <BaseCard
          class="min-h-52"
          :class="{'skeleton':isLoading}"
          :title="isLoading?'':$t('title.frameworks')"
      >
        <FrameworkList :framework-list="dashboard.framework_list" v-if="dashboard.framework_list"/>
      </BaseCard>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 gap-2 my-2">
      <BaseCard
          class="min-h-80"
          :class="{'skeleton':isLoading}"
          :title="isLoading?'':$t('title.risks')"
      >
        <RiskChart :chart-data="dashboard?.analytic?.risk" v-if="dashboard?.analytic?.risk"/>
      </BaseCard>
      <BaseCard
          class="min-h-80"
          :class="{'skeleton':isLoading}"
          :title="isLoading?'':$t('title.evidences')"
      >
        <EvidenceChart :chart-data="dashboard?.analytic?.media" v-if="dashboard?.analytic?.media"/>
      </BaseCard>
      <BaseCard
          class="min-h-80"
          :class="{'skeleton':isLoading}"
          :title="isLoading?'':$t('title.tasks')"
      >
        <TaskStatus :chart-data="dashboard?.analytic?.task" v-if="dashboard?.analytic?.task"/>
      </BaseCard>
    </div>
    <!-- END CHARTS SECTION   -->

    <div
        class="w-full my-3 gap-3 grid md:flex xl:flex lg:flex justify-items-stretch items-stretch"
    >
      <div class="w-full md:w-3/5 xl:w-3/5 lg:w-3/5 ">
        <BaseCard
            class="w-full h-full min-h-36"
            :class="{'skeleton':isLoading}"
            :title="isLoading?'':$t('title.last-registered-company')"
        >
          <BaseTable
              v-if="!isLoading"
              :is-loading="isLoading"
              :data="dashboard.company_list"
              :headers="tableCompanyHeaders"
          >
          </BaseTable>
        </BaseCard>
      </div>
      <div class="w-full md:w-2/5 xl:w-2/5 lg:w-2/5 ">
        <BaseCard
            class="w-full h-full"
            :class="{'skeleton':isLoading}"
            :title="$t(isLoading?'':'title.last-registered-member')"
        >
          <BaseTable
              v-if="!isLoading"
              :is-loading="isLoading"
              :data="dashboard.user_list"
              :headers="tableMemberHeaders"
          >
          </BaseTable>
        </BaseCard>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>