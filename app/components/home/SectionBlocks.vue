<script setup lang="ts">
import type { Section, Article, PaginatedResponse } from "~/types";

const { t, locale } = useI18n();
const localePath = useLocalePath();

// 从 API 获取首页展示的模块
const { data: homeSections } = useFetch<Section[]>("/api/sections", {
  query: { active: "1", home: "1" },
});

// 动态获取每个模块的文章
const sectionArticles = ref<Record<string, Article[]>>({});

watch(
  homeSections,
  async (sections) => {
    if (!sections) return;
    const results: Record<string, Article[]> = {};
    await Promise.all(
      sections.map(async (sec) => {
        try {
          const data = await $fetch<PaginatedResponse<Article>>(
            "/api/articles",
            { query: { section: sec.id, pageSize: 5 } },
          );
          results[sec.id] = data.data || [];
        } catch {
          results[sec.id] = [];
        }
      }),
    );
    sectionArticles.value = results;
  },
  { immediate: true },
);

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat(locale.value, {
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr));
}
</script>

<template>
  <section>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="section in homeSections"
        :key="section.id"
        class="bg-white rounded-xl border border-slate-200 overflow-hidden"
      >
        <!-- 版块标题 -->
        <div
          class="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50"
        >
          <div class="flex items-center gap-2">
            <UIcon
              :name="section.icon || 'i-lucide-folder'"
              class="w-5 h-5"
              :class="section.color"
            />
            <h3 class="text-base font-bold text-slate-800">
              {{ t(section.labelKey) }}
            </h3>
          </div>
          <NuxtLink
            :to="localePath(`/${section.id}`)"
            class="text-xs text-green-600 hover:text-green-700 font-medium"
          >
            {{ t("common.viewAll") }} →
          </NuxtLink>
        </div>

        <!-- 新闻列表 -->
        <div class="divide-y divide-slate-50" style="min-height: 240px">
          <template
            v-if="
              sectionArticles[section.id] &&
              sectionArticles[section.id]!.length > 0
            "
          >
            <NuxtLink
              v-for="(article, index) in sectionArticles[section.id]"
              :key="article.id"
              :to="
                localePath(
                  `/${article.section}/${article.category}/${article.id}`,
                )
              "
              class="group flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
            >
              <span
                class="shrink-0 w-5 h-5 mt-0.5 rounded flex items-center justify-center text-xs font-bold"
                :class="
                  index < 3
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-100 text-slate-500'
                "
              >
                {{ index + 1 }}
              </span>
              <div class="flex-1 min-w-0">
                <h4
                  class="text-sm font-medium text-slate-700 group-hover:text-green-600 transition-colors line-clamp-1"
                >
                  {{ article.title }}
                </h4>
                <span class="text-xs text-slate-400">{{
                  formatDate(article.publishedAt)
                }}</span>
              </div>
            </NuxtLink>
          </template>
          <div
            v-else
            class="flex items-center justify-center h-full text-slate-400 text-sm py-16"
          >
            {{ t("common.noData") }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
