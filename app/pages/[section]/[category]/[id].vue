<script setup lang="ts">
import { sectionTitleKeys } from "~/utils/navigation";

const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

const section = computed(() => route.params.section as string);
const category = computed(() => route.params.category as string);
const articleId = computed(() => route.params.id as string);
const sectionTitle = computed(
  () => sectionTitleKeys[section.value] || section.value,
);

const { getCategoryLabel } = useCategories(section.value);
const categoryLabel = computed(() => getCategoryLabel(category.value));

const { article, status, error } = useArticleDetail(articleId);
useRecordView(articleId);

useSeoMeta({
  title: () =>
    article.value
      ? `${article.value.title} - ${t("site.title")}`
      : t("common.loading"),
  description: () => article.value?.summary ?? "",
  ogTitle: () => article.value?.title ?? "",
  ogDescription: () => article.value?.summary ?? "",
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <CommonBreadcrumb
      :items="[
        { label: t('nav.home'), to: localePath('/') },
        { label: t(sectionTitle), to: localePath(`/${section}`) },
        { label: categoryLabel, to: localePath(`/${section}/${category}`) },
        { label: article?.title ?? t('common.loading') },
      ]"
      class="mb-6"
    />

    <div v-if="status === 'pending'" class="text-center py-20">
      <UIcon
        name="i-lucide-loader-2"
        class="w-8 h-8 text-green-500 animate-spin mx-auto mb-3"
      />
      <p class="text-slate-500">{{ t("common.loading") }}</p>
    </div>

    <div v-else-if="error" class="text-center py-20">
      <UIcon
        name="i-lucide-alert-circle"
        class="w-12 h-12 text-red-400 mx-auto mb-3"
      />
      <p class="text-slate-500 mb-4">{{ t("common.noData") }}</p>
      <UButton
        :label="t('common.backToHome')"
        :to="localePath(`/${section}`)"
        variant="outline"
        color="primary"
      />
    </div>

    <template v-else-if="article">
      <NewsDetail :article="article" />

      <div class="max-w-3xl mx-auto mt-8 pt-6 border-t border-slate-200">
        <UButton
          :label="t('news.detail.backToList')"
          :to="localePath(`/${section}/${category}`)"
          variant="ghost"
          color="neutral"
          icon="i-lucide-arrow-left"
        />
      </div>
    </template>
  </div>
</template>
