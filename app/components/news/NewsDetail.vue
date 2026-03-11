<script setup lang="ts">
import type { Article } from "~/types";
import DOMPurify from "isomorphic-dompurify";

const props = defineProps<{
  article: Article;
}>();

const { t, locale } = useI18n();

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat(locale.value, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

function formatViews(count: number) {
  return new Intl.NumberFormat(locale.value).format(count);
}

const sanitizedContent = computed(() =>
  props.article.content
    ? DOMPurify.sanitize(props.article.content, {
        USE_PROFILES: { html: true },
      })
    : "",
);
</script>

<template>
  <article class="max-w-3xl mx-auto">
    <!-- 封面圖 -->
    <div v-if="article.coverImage" class="mb-6">
      <img
        :src="article.coverImage"
        :alt="article.title"
        class="w-full max-h-96 object-cover rounded-xl border border-slate-200"
        loading="lazy"
      />
    </div>

    <!-- 標籤 -->
    <div class="flex items-center gap-2 mb-4">
      <UBadge
        :label="t(`${article.section}.categories.${article.category}`)"
        color="primary"
        variant="subtle"
      />
      <UBadge v-if="article.isHot" label="HOT" color="error" variant="subtle" />
    </div>

    <!-- 標題 -->
    <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
      {{ article.title }}
    </h1>

    <!-- 信息 -->
    <div
      class="flex flex-wrap items-center gap-4 text-base text-slate-500 mb-6 pb-6 border-b border-slate-200"
    >
      <span class="flex items-center gap-1">
        <UIcon name="i-lucide-user" class="w-4 h-4" />
        {{ article.author.name }}
      </span>
      <span class="flex items-center gap-1">
        <UIcon name="i-lucide-clock" class="w-4 h-4" />
        {{ formatDate(article.publishedAt) }}
      </span>
      <span class="flex items-center gap-1">
        <UIcon name="i-lucide-eye" class="w-4 h-4" />
        {{ formatViews(article.viewCount) }}
      </span>
    </div>

    <!-- 摘要 -->
    <div class="bg-blue-50/50 border-l-4 border-blue-500 p-4 mb-8 rounded-r-lg">
      <p class="text-slate-600 text-base leading-relaxed">
        {{ article.summary }}
      </p>
    </div>

    <!-- 内容主体 -->
    <div
      v-if="article.contentBlocks && article.contentBlocks.length > 0"
      class="article-content text-slate-700 leading-relaxed"
    >
      <template v-for="(block, index) in article.contentBlocks" :key="index">
        <p v-if="block.type === 'paragraph'">
          {{ block.text }}
        </p>
        <h2 v-else-if="block.type === 'heading' && block.level === 2">
          {{ block.text }}
        </h2>
        <h3 v-else-if="block.type === 'heading' && block.level === 3">
          {{ block.text }}
        </h3>
        <figure v-else-if="block.type === 'image'">
          <img :src="block.src" :alt="block.alt || ''" loading="lazy" />
          <figcaption v-if="block.caption">{{ block.caption }}</figcaption>
        </figure>
        <blockquote v-else-if="block.type === 'quote'">
          {{ block.text }}
        </blockquote>
      </template>
    </div>
    <div
      v-else-if="article.content"
      class="article-content text-slate-700 leading-relaxed"
      v-html="sanitizedContent"
    />
    <p v-else class="text-slate-500">
      {{ t("common.noData") }}
    </p>

    <!-- 標籤區塊 -->
    <div
      v-if="article.tags.length > 0"
      class="mt-8 pt-6 border-t border-slate-200"
    >
      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="tag in article.tags"
          :key="tag"
          :label="tag"
          color="neutral"
          variant="subtle"
        />
      </div>
    </div>
  </article>
</template>
