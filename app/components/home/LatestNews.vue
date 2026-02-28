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
  <section>
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-lg font-bold text-slate-800">
        {{ t("news.latest") }}
      </h2>
      <NuxtLink
        :to="localePath('/news')"
        class="text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        {{ t("news.more") }} →
      </NuxtLink>
    </div>

    <div class="space-y-1.5">
      <NuxtLink
        v-for="article in articles"
        :key="article.id"
        :to="
          localePath(`/${article.section}/${article.category}/${article.id}`)
        "
        class="group flex gap-3 px-2 py-2 rounded-md hover:bg-blue-50 transition-colors"
      >
        <div class="flex-1 min-w-0">
          <h3
            class="text-[15px] font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1"
          >
            {{ article.title }}
          </h3>
          <p class="text-sm text-slate-500 line-clamp-2 leading-5 mb-1.5">
            {{ article.summary }}
          </p>
          <div class="flex items-center gap-2 text-xs text-slate-400">
            <span>{{ formatDate(article.publishedAt) }}</span>
            <span>·</span>
            <span>{{ article.author.name }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
