<script setup lang="ts">
const { t } = useI18n();

interface DashboardItem {
  label: string;
  value: string;
  change: string;
  up: boolean;
}

const { data, pending } = useFetch<{ items: DashboardItem[] }>(
  "/api/market/dashboard",
  {
    default: () => ({ items: [] }),
  },
);

const dashboardItems = computed(() => data.value?.items ?? []);
</script>

<template>
  <div class="flex items-center gap-6 overflow-x-auto scrollbar-hide py-1">
    <div class="flex items-center gap-2 shrink-0">
      <UIcon name="i-lucide-bar-chart-3" class="w-5 h-5 text-blue-300" />
      <span class="text-sm font-semibold text-blue-200">{{
        t("home.dataDashboard.title")
      }}</span>
    </div>
    <div v-if="pending" class="text-sm text-blue-200">
      {{ t("common.loading") }}
    </div>
    <div
      v-for="item in dashboardItems"
      v-else
      :key="item.label"
      class="flex items-center gap-2 shrink-0 text-sm"
    >
      <span class="text-blue-200">{{ item.label }}</span>
      <span class="font-mono font-semibold text-white">{{ item.value }}</span>
      <span
        class="text-xs font-medium"
        :class="item.up ? 'text-red-400' : 'text-green-400'"
      >
        {{ item.change }}
        <UIcon
          :name="item.up ? 'i-lucide-trending-up' : 'i-lucide-trending-down'"
          class="w-3 h-3 inline"
        />
      </span>
    </div>
    <div
      v-if="!pending && dashboardItems.length === 0"
      class="text-sm text-blue-200"
    >
      {{ t("common.noData") }}
    </div>
  </div>
</template>
