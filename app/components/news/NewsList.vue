<script setup lang="ts">
import type { Article } from "~/types";

defineProps<{
  articles: Article[];
  total: number;
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  pageChange: [page: number];
}>();

const { t } = useI18n();
</script>

<template>
  <div>
    <div v-if="articles.length > 0" class="space-y-4">
      <NewsCard
        v-for="article in articles"
        :key="article.id"
        :article="article"
        layout="horizontal"
      />
    </div>

    <div v-else class="text-center py-12 text-slate-400">
      <UIcon name="i-lucide-inbox" class="w-12 h-12 mx-auto mb-3" />
      <p>{{ t("common.noData") }}</p>
    </div>

    <!-- 分頁 -->
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-between mt-8 pt-4 border-t border-slate-100"
    >
      <p class="text-sm text-slate-500">
        {{ t("common.totalArticles", { total }) }}
      </p>
      <UPagination
        :page="currentPage"
        :total="total"
        :items-per-page="10"
        @update:page="emit('pageChange', $event)"
      />
    </div>
  </div>
</template>
