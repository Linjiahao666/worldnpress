<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();

const links = [
  {
    labelKey: "news.categories.macro-economy",
    to: "/news/macro-economy",
    icon: "i-lucide-trending-up",
  },
  {
    labelKey: "news.categories.global-finance",
    to: "/news/global-finance",
    icon: "i-lucide-globe",
  },
  {
    labelKey: "esg.categories.esg-news",
    to: "/esg/esg-news",
    icon: "i-lucide-newspaper",
  },
  {
    labelKey: "esg.categories.carbon-management",
    to: "/esg/carbon-management",
    icon: "i-lucide-leaf",
  },
  {
    labelKey: "news.categories.financial-market",
    to: "/news/financial-market",
    icon: "i-lucide-bar-chart-3",
  },
  {
    labelKey: "esg.categories.governance",
    to: "/esg/governance",
    icon: "i-lucide-shield-check",
  },
];
</script>

<template>
  <section>
    <h2 class="text-lg font-bold text-slate-800 mb-3">
      {{ t("home.quickLinks.title") }}
    </h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="localePath(link.to)"
        class="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-green-50 border border-slate-100 hover:border-green-200 transition-colors text-base text-slate-600 hover:text-green-700"
      >
        <UIcon :name="link.icon" class="w-4 h-4 shrink-0" />
        <span class="truncate">{{ t(link.labelKey) }}</span>
      </NuxtLink>
    </div>
  </section>
</template>
