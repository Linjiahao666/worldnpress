<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();

const links = [
  {
    labelKey: "nav.globalEconomy",
    to: "/global-economy",
    icon: "i-lucide-globe",
  },
  {
    labelKey: "nav.mainlandEconomy",
    to: "/mainland-economy",
    icon: "i-lucide-landmark",
  },
  {
    labelKey: "nav.industry",
    to: "/industry",
    icon: "i-lucide-factory",
  },
  {
    labelKey: "nav.thinkTank",
    to: "/think-tank",
    icon: "i-lucide-lightbulb",
  },
  {
    labelKey: "nav.about",
    to: "/about",
    icon: "i-lucide-info",
  },
  {
    labelKey: "about.categories.reporter-query",
    to: "/reporters",
    icon: "i-lucide-users",
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
