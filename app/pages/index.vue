<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: () => `${t("site.title")} - ${t("site.description")}`,
  ogTitle: () => t("site.title"),
  description: () => t("home.hero.subtitle"),
  ogDescription: () => t("home.hero.subtitle"),
});

const { articles: featuredArticles } = useFeaturedArticles();
const { articles: latestArticles } = useArticles({ pageSize: 8 });
const { articles: hotArticles } = useHotArticles();
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <!-- 精選輪播 -->
    <section class="mb-8">
      <HomeHeroCarousel :articles="featuredArticles" />
    </section>

    <!-- 主要內容區塊 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 左側：最新要聞 -->
      <div class="lg:col-span-2 space-y-8">
        <HomeLatestNews :articles="latestArticles" />

        <!-- 欄目卡片 -->
        <HomeSectionCard />
      </div>

      <!-- 右側：側欄 -->
      <aside class="space-y-6">
        <HomeHotNews :articles="hotArticles" />
        <HomeQuickLinks />
      </aside>
    </div>
  </div>
</template>
