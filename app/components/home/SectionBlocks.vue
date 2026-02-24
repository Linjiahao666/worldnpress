<script setup lang="ts">
import { homeSectionBlocks, sectionTitleKeys } from "~/utils/navigation";

const { t, locale } = useI18n();
const localePath = useLocalePath();

// 获取4个版块的文章数据
const blocks = homeSectionBlocks.map((block) => {
  const { articles } = useArticles({
    section: block.section,
    pageSize: 5,
  });
  return {
    ...block,
    articles,
  };
});

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
        v-for="block in blocks"
        :key="block.section"
        class="bg-white rounded-xl border border-slate-200 overflow-hidden"
      >
        <!-- 版块标题 -->
        <div
          class="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50"
        >
          <div class="flex items-center gap-2">
            <UIcon :name="block.icon" class="w-5 h-5" :class="block.color" />
            <h3 class="text-base font-bold text-slate-800">
              {{ t(block.labelKey) }}
            </h3>
          </div>
          <NuxtLink
            :to="localePath(`/${block.section}`)"
            class="text-xs text-green-600 hover:text-green-700 font-medium"
          >
            {{ t("common.viewAll") }} →
          </NuxtLink>
        </div>

        <!-- 新闻列表 -->
        <div class="divide-y divide-slate-50" style="min-height: 240px">
          <template v-if="block.articles.value.length > 0">
            <NuxtLink
              v-for="(article, index) in block.articles.value"
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
