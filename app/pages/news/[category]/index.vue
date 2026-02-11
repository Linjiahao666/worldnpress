<script setup lang="ts">
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();

const category = computed(() => route.params.category as string);
const { categories, getCategoryLabel } = useCategories("news");

const categoryLabel = computed(() => getCategoryLabel(category.value));

useSeoMeta({
  title: () =>
    `${categoryLabel.value} - ${t("news.title")} - ${t("site.title")}`,
  description: () => `${categoryLabel.value} - ${t("news.title")}`,
});

const page = computed(() => Number(route.query.page) || 1);
const query = computed(() => ({
  section: "news",
  category: category.value,
  page: page.value,
  pageSize: 10,
}));

const { articles, total, totalPages, currentPage } = useArticles(query);

function onPageChange(newPage: number) {
  router.push({ query: { ...route.query, page: newPage } });
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <!-- 面包屑 -->
    <CommonBreadcrumb
      :items="[
        { label: t('nav.home'), to: localePath('/') },
        { label: t('news.title'), to: localePath('/news') },
        { label: categoryLabel },
      ]"
      class="mb-4"
    />

    <!-- 標題 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-900 mb-2">
        {{ categoryLabel }}
      </h1>
    </div>

    <!-- 分類導航 -->
    <div class="mb-6">
      <CommonCategoryNav
        :categories="categories"
        section="news"
        :active-category="category"
      />
    </div>

    <!-- 文章列表 -->
    <NewsList
      :articles="articles"
      :total="total"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="onPageChange"
    />
  </div>
</template>
