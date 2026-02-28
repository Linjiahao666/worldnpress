<script setup lang="ts">
import type { Section } from "~/types";

const { t } = useI18n();
const localePath = useLocalePath();

const { data: sections } = useFetch<Section[]>("/api/sections", {
  query: { active: "1" },
});

// 将 sections 按类型分组显示
const newsType = [
  "news",
  "gba-hk",
  "esg",
  "green-finance",
  "supervision",
  "brand",
];

const newsTypeSections = computed(() =>
  sections.value?.filter((s) => newsType.includes(s.id)),
);

const specialSections = computed(() =>
  sections.value?.filter((s) => !newsType.includes(s.id)),
);
</script>

<template>
  <section class="bg-white rounded-lg overflow-hidden">
    <!-- 标题 -->
    <div class="flex items-center gap-2 px-4 py-2.5 bg-white">
      <UIcon name="i-lucide-layout-grid" class="w-5 h-5 text-blue-600" />
      <h2 class="text-base font-bold text-slate-800">
        {{ t("home.quickLinks.title") }}
      </h2>
    </div>

    <div class="px-4 pb-3">
      <!-- 新闻资讯类频道 -->
      <div v-if="newsTypeSections?.length" class="mb-3">
        <div class="flex flex-wrap gap-2">
          <NuxtLink
            v-for="section in newsTypeSections"
            :key="section.id"
            :to="localePath(`/${section.id}`)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            <UIcon
              :name="section.icon || 'i-lucide-folder'"
              class="w-3.5 h-3.5"
            />
            {{ t(section.labelKey) }}
          </NuxtLink>
        </div>
      </div>

      <!-- 功能类频道 -->
      <div v-if="specialSections?.length">
        <div class="flex flex-wrap gap-2">
          <NuxtLink
            v-for="section in specialSections"
            :key="section.id"
            :to="localePath(`/${section.id}`)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            <UIcon
              :name="section.icon || 'i-lucide-folder'"
              class="w-3.5 h-3.5"
            />
            {{ t(section.labelKey) }}
          </NuxtLink>
          <!-- 关于我们 + 记者查询 -->
          <NuxtLink
            :to="localePath('/about')"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            <UIcon name="i-lucide-info" class="w-3.5 h-3.5" />
            {{ t("nav.about") }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/reporters')"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            <UIcon name="i-lucide-users" class="w-3.5 h-3.5" />
            {{ t("about.categories.reporter-query") }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
