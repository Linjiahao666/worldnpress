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
    <div class="flex items-center gap-2 mb-3">
      <UIcon name="i-lucide-flame" class="w-5 h-5 text-red-500" />
      <h2 class="text-base font-bold text-slate-800">
        {{ t("news.hot") }}
      </h2>
    </div>

    <div class="space-y-1">
      <NuxtLink
        v-for="(article, index) in articles"
        :key="article.id"
        :to="
          localePath(`/${article.section}/${article.category}/${article.id}`)
        "
        class="group flex items-start gap-2.5 px-2 py-2 rounded-lg hover:bg-blue-50 transition-colors"
      >
        <span
          class="shrink-0 w-5 h-5 rounded flex items-center justify-center text-xs font-bold mt-0.5"
          :class="[
            index < 3
              ? 'bg-red-600 text-white'
              : 'bg-slate-100 text-slate-500',
          ]"
        >
          {{ index + 1 }}
        </span>
        <div class="flex-1 min-w-0">
          <h3
            class="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug"
          >
            {{ article.title }}
          </h3>
          <span class="text-xs text-slate-400 mt-0.5">{{
            formatDate(article.publishedAt)
          }}</span>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
