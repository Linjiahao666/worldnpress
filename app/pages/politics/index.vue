<script setup lang="ts">
const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

useSeoMeta({
  title: () => `${t("politics.title")} - ${t("site.title")}`,
  description: () => t("politics.title"),
});

const { categories } = useCategories("politics");

const page = computed(() => Number(route.query.page) || 1);
const query = computed(() => ({
  section: "politics",
  page: page.value,
  pageSize: 10,
}));

const { articles, total, totalPages, currentPage } = useArticles(query);
const { articles: hotArticles } = useHotArticles("politics");
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
        { label: t('politics.title') },
      ]"
      class="mb-4"
    />

    <!-- 標題 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-900 mb-2">
        {{ t("politics.title") }}
      </h1>
    </div>

    <!-- 分類導航 -->
    <div class="mb-6">
      <CommonCategoryNav :categories="categories" section="politics" />
    </div>

    <!-- 內容區塊 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 文章列表 -->
      <div class="lg:col-span-2">
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
        <HomeHotNews :articles="hotArticles" />
      </aside>
    </div>
  </div>
</template>
