<script setup lang="ts">
const { t } = useI18n();

// 数据看板placeholder数据（日后可接API）
const dashboardItems = [
  { label: "USD/CNY", value: "7.2345", change: "+0.0023", up: true },
  { label: "EUR/CNY", value: "7.8912", change: "-0.0156", up: false },
  { label: "上证指数", value: "3,256.78", change: "+1.23%", up: true },
  { label: "恒生指数", value: "20,145.32", change: "-0.45%", up: false },
  { label: "黄金", value: "2,654.30", change: "+0.82%", up: true },
  { label: "原油", value: "76.45", change: "-1.12%", up: false },
];
</script>

<template>
  <div class="flex items-center gap-6 overflow-x-auto scrollbar-hide py-1">
    <div class="flex items-center gap-2 shrink-0">
      <UIcon name="i-lucide-bar-chart-3" class="w-5 h-5 text-blue-300" />
      <span class="text-sm font-semibold text-blue-200">{{
        t("home.dataDashboard.title")
      }}</span>
    </div>
    <div
      v-for="item in dashboardItems"
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
  </div>
</template>
