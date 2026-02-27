<script setup lang="ts">
import type { Section } from "~/types";

const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

// 从 API 获取活跃的 sections
const { data: sections } = useFetch<Section[]>("/api/sections", {
  query: { active: "1" },
});

function isActive(to: string) {
  const normalizedPath = route.path.replace(/^\/(zh-TW|zh-CN|en)(?=\/)/, "");
  if (to === "/") return normalizedPath === "/" || normalizedPath === "";
  return normalizedPath.startsWith(to);
}
</script>

<template>
  <nav class="w-full" aria-label="Main navigation">
    <!-- 一级栏目 + 二级栏目 横向展示 -->
    <div class="flex flex-wrap items-center gap-x-1 gap-y-0.5">
      <!-- 首页链接 -->
      <NuxtLink
        :to="localePath('/')"
        class="px-2 py-1.5 text-sm font-bold whitespace-nowrap rounded transition-colors"
        :class="[
          isActive('/')
            ? 'text-green-600'
            : 'text-slate-800 hover:text-green-600',
        ]"
      >
        {{ t("nav.home") }}
      </NuxtLink>

      <!-- 各 section 及其子分类 -->
      <template v-for="section in sections" :key="section.id">
        <!-- 分隔符 -->
        <span class="text-slate-300 mx-0.5">|</span>

        <!-- 一级栏目 (粗体) -->
        <NuxtLink
          :to="localePath(`/${section.id}`)"
          class="px-2 py-1.5 text-sm font-bold whitespace-nowrap rounded transition-colors"
          :class="[
            isActive(`/${section.id}`)
              ? 'text-green-600'
              : 'text-slate-800 hover:text-green-600',
          ]"
        >
          {{ t(section.labelKey) }}
        </NuxtLink>

        <!-- 二级栏目 (空格分隔, 普通字重) -->
        <template v-if="section.categories && section.categories.length > 0">
          <NuxtLink
            v-for="cat in section.categories"
            :key="cat.slug"
            :to="localePath(`/${section.id}/${cat.slug}`)"
            class="px-1 py-1.5 text-xs whitespace-nowrap transition-colors"
            :class="[
              isActive(`/${section.id}/${cat.slug}`)
                ? 'text-green-600 font-medium'
                : 'text-slate-500 hover:text-green-600',
            ]"
          >
            {{ t(cat.labelKey) }}
          </NuxtLink>
        </template>
      </template>

      <!-- 关于我们 -->
      <span class="text-slate-300 mx-0.5">|</span>
      <NuxtLink
        :to="localePath('/about')"
        class="px-2 py-1.5 text-sm font-bold whitespace-nowrap rounded transition-colors"
        :class="[
          isActive('/about')
            ? 'text-green-600'
            : 'text-slate-800 hover:text-green-600',
        ]"
      >
        {{ t("nav.about") }}
      </NuxtLink>
    </div>
  </nav>
</template>
