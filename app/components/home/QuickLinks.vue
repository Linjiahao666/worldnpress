<script setup lang="ts">
import type { Section } from "~/types";

const { t } = useI18n();
const localePath = useLocalePath();

// 从 API 获取活跃的 sections
const { data: sections } = useFetch<Section[]>("/api/sections", {
  query: { active: "1" },
});

const extraLinks = [
  { labelKey: "nav.about", to: "/about", icon: "i-lucide-info" },
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
    <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
      <NuxtLink
        v-for="section in sections"
        :key="section.id"
        :to="localePath(`/${section.id}`)"
        class="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-colors text-sm text-slate-600 hover:text-blue-700"
      >
        <UIcon
          :name="section.icon || 'i-lucide-folder'"
          class="w-4 h-4 shrink-0"
        />
        <span class="truncate">{{ t(section.labelKey) }}</span>
      </NuxtLink>
      <NuxtLink
        v-for="link in extraLinks"
        :key="link.to"
        :to="localePath(link.to)"
        class="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-colors text-sm text-slate-600 hover:text-blue-700"
      >
        <UIcon :name="link.icon" class="w-4 h-4 shrink-0" />
        <span class="truncate">{{ t(link.labelKey) }}</span>
      </NuxtLink>
    </div>
  </section>
</template>
