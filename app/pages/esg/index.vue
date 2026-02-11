<script setup lang="ts">
const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

useSeoMeta({
  title: () => `${t("esg.title")} - ${t("site.title")}`,
  description: () => t("esg.title"),
});

const { categories } = useCategories("esg");

const page = computed(() => Number(route.query.page) || 1);
const query = computed(() => ({
  section: "esg",
  page: page.value,
  pageSize: 10,
}));

const { articles, total, totalPages, currentPage } = useArticles(query);
const { articles: featuredArticles } = useFeaturedArticles("esg");
const router = useRouter();

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
        { label: t('esg.title') },
      ]"
      class="mb-4"
    />

    <!-- 標題 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-900 mb-2">
        {{ t("esg.title") }}
      </h1>
    </div>

    <!-- 分類導航 -->
    <div class="mb-6">
      <CommonCategoryNav :categories="categories" section="esg" />
    </div>

    <!-- 內容區塊 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        <!-- 精選內容 -->
        <EsgHighlight :articles="featuredArticles" />

        <!-- 文章列表 -->
        <NewsList
          :articles="articles"
          :total="total"
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="onPageChange"
        />
      </div>

      <!-- 側欄 -->
      <aside class="space-y-6">
        <EsgStats />
      </aside>
    </div>
  </div>
</template>
