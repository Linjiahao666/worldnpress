<script setup lang="ts">
import { sectionTitleKeys, categoriesBySection } from "~/utils/navigation";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();

const section = computed(() => route.params.section as string);
const sectionTitle = computed(
  () => sectionTitleKeys[section.value] || section.value,
);

const { categories } = useCategories(section.value);

useSeoMeta({
  title: () => `${t(sectionTitle.value)} - ${t("site.title")}`,
  description: () => t(sectionTitle.value),
});

const page = computed(() => Number(route.query.page) || 1);
const query = computed(() => ({
  section: section.value,
  page: page.value,
  pageSize: 10,
}));

const { articles, total, totalPages, currentPage } = useArticles(query);
const { articles: hotArticles } = useArticles({
  section: section.value,
  pageSize: 5,
});

function onPageChange(newPage: number) {
  router.push({ query: { ...route.query, page: newPage } });
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <CommonBreadcrumb
      :items="[
        { label: t('nav.home'), to: localePath('/') },
        { label: t(sectionTitle) },
      ]"
      class="mb-4"
    />

    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-900 mb-2">
        {{ t(sectionTitle) }}
      </h1>
    </div>

    <div v-if="categories.length > 0" class="mb-6">
      <CommonCategoryNav :categories="categories" :section="section" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <NewsList
          :articles="articles"
          :total="total"
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="onPageChange"
        />
      </div>
      <aside class="space-y-6">
        <HomeHotNews :articles="hotArticles" />
      </aside>
    </div>
  </div>
</template>
