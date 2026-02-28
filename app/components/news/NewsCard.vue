<script setup lang="ts">
import type { Article } from "~/types";
import { sectionTitleKeys } from "~/utils/navigation";

const props = defineProps<{
  article: Article;
  layout?: "horizontal" | "vertical";
}>();

const { t, te, locale } = useI18n();
const localePath = useLocalePath();
const layout = computed(() => props.layout ?? "vertical");
const categoryLabel = computed(() => {
  const sectionNamespace = sectionTitleKeys[props.article.section]?.replace(
    ".title",
    "",
  );
  const key = sectionNamespace
    ? `${sectionNamespace}.categories.${props.article.category}`
    : `${props.article.section}.categories.${props.article.category}`;
  if (te(key)) return t(key);
  return props.article.category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
});

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat(locale.value, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr));
}

function formatViews(count: number) {
  return new Intl.NumberFormat(locale.value, {
    notation: count > 10000 ? "compact" : "standard",
  }).format(count);
}
</script>

<template>
  <NuxtLink
    :to="localePath(`/${article.section}/${article.category}/${article.id}`)"
    class="group block rounded-lg bg-white hover:bg-slate-50 transition-colors overflow-hidden"
    :class="layout === 'horizontal' ? 'flex' : ''"
  >
    <div
      class="p-4 flex-1 min-w-0"
      :class="layout === 'horizontal' ? 'flex flex-col justify-center' : ''"
    >
      <!-- 標籤 -->
      <div class="flex items-center gap-2 mb-2">
        <UBadge
          v-if="article.isHot"
          label="HOT"
          color="error"
          variant="subtle"
          size="xs"
        />
        <UBadge
          :label="categoryLabel"
          color="primary"
          variant="subtle"
          size="xs"
        />
      </div>

      <!-- 標題 -->
      <h3
        class="text-base font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2"
      >
        {{ article.title }}
      </h3>

      <!-- 摘要 -->
      <p class="text-sm text-slate-500 line-clamp-2 mb-3">
        {{ article.summary }}
      </p>

      <!-- 信息 -->
      <div class="flex items-center gap-3 text-xs text-slate-400">
        <span>{{ article.author.name }}</span>
        <span>·</span>
        <span>{{ formatDate(article.publishedAt) }}</span>
        <span>·</span>
        <span class="flex items-center gap-1">
          <UIcon name="i-lucide-eye" class="w-3 h-3" />
          {{ formatViews(article.viewCount) }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
