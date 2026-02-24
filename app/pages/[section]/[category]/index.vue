<script setup lang="ts">
import { sectionTitleKeys } from "~/utils/navigation";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();

const section = computed(() => route.params.section as string);
const category = computed(() => route.params.category as string);
const sectionTitle = computed(
  () => sectionTitleKeys[section.value] || section.value,
);

const { categories, getCategoryLabel } = useCategories(section.value);
const categoryLabel = computed(() => getCategoryLabel(category.value));

useSeoMeta({
  title: () =>
    `${categoryLabel.value} - ${t(sectionTitle.value)} - ${t("site.title")}`,
  description: () => `${categoryLabel.value} - ${t(sectionTitle.value)}`,
});

const page = computed(() => Number(route.query.page) || 1);
const query = computed(() => ({
  section: section.value,
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
    <CommonBreadcrumb
      :items="[
        { label: t('nav.home'), to: localePath('/') },
        { label: t(sectionTitle), to: localePath(`/${section}`) },
        { label: categoryLabel },
      ]"
      class="mb-4"
    />

    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-900 mb-2">
        {{ categoryLabel }}
      </h1>
    </div>

    <div class="mb-6">
      <CommonCategoryNav
        :categories="categories"
        :section="section"
        :active-category="category"
      />
    </div>

    <NewsList
      :articles="articles"
      :total="total"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="onPageChange"
    />
  </div>
</template>
