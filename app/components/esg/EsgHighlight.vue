<script setup lang="ts">
import type { Article } from "~/types";

defineProps<{
  articles: Article[];
}>();

const { t, locale } = useI18n();
const localePath = useLocalePath();

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat(locale.value, {
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr));
}
</script>

<template>
  <section v-if="articles.length > 0">
    <h2 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
      <UIcon name="i-lucide-star" class="w-5 h-5 text-green-500" />
      ESG {{ t("news.latest") }}
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- 精選內容 -->
      <NuxtLink
        v-if="articles[0]"
        :to="localePath(`/esg/${articles[0].category}/${articles[0].id}`)"
        class="group md:row-span-2 relative rounded-xl bg-linear-to-br from-green-50 to-white border border-green-100 p-6 hover:shadow-md hover:border-green-200 transition-all"
      >
        <UBadge
          :label="t(`esg.categories.${articles[0].category}`)"
          color="primary"
          variant="subtle"
          size="xs"
          class="mb-3"
        />
        <h3
          class="text-lg font-bold text-slate-800 group-hover:text-green-600 transition-colors mb-3"
        >
          {{ articles[0].title }}
        </h3>
        <p class="text-base text-slate-500 line-clamp-3 mb-4">
          {{ articles[0].summary }}
        </p>
        <div class="text-sm text-slate-400">
          {{ articles[0].author.name }} ·
          {{ formatDate(articles[0].publishedAt) }}
        </div>
      </NuxtLink>

      <!-- 其他內容 -->
      <NuxtLink
        v-for="article in articles.slice(1, 3)"
        :key="article.id"
        :to="localePath(`/esg/${article.category}/${article.id}`)"
        class="group flex flex-col rounded-xl border border-slate-100 p-4 hover:border-green-200 hover:shadow-sm transition-all"
      >
        <UBadge
          :label="t(`esg.categories.${article.category}`)"
          color="primary"
          variant="subtle"
          size="xs"
          class="mb-2 w-fit"
        />
        <h3
          class="text-base font-semibold text-slate-800 group-hover:text-green-600 transition-colors line-clamp-2 mb-2"
        >
          {{ article.title }}
        </h3>
        <p class="text-sm text-slate-500 line-clamp-2 flex-1">
          {{ article.summary }}
        </p>
        <div class="text-sm text-slate-400 mt-2">
          {{ formatDate(article.publishedAt) }}
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
