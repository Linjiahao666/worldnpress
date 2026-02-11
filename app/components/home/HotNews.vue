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
    <div class="flex items-center gap-2 mb-4">
      <UIcon name="i-lucide-flame" class="w-5 h-5 text-red-500" />
      <h2 class="text-lg font-bold text-slate-800">
        {{ t("news.hot") }}
      </h2>
    </div>

    <div class="space-y-3">
      <NuxtLink
        v-for="(article, index) in articles"
        :key="article.id"
        :to="
          localePath(`/${article.section}/${article.category}/${article.id}`)
        "
        class="group flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
      >
        <span
          class="shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
          :class="[
            index < 3
              ? 'bg-green-500 text-white'
              : 'bg-slate-100 text-slate-500',
          ]"
        >
          {{ index + 1 }}
        </span>
        <div class="flex-1 min-w-0">
          <h3
            class="text-base font-medium text-slate-700 group-hover:text-green-600 transition-colors line-clamp-2"
          >
            {{ article.title }}
          </h3>
          <span class="text-sm text-slate-400 mt-1">{{
            formatDate(article.publishedAt)
          }}</span>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
