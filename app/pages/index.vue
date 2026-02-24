<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: () => `${t("site.title")} - ${t("site.description")}`,
  ogTitle: () => t("site.title"),
  description: () => t("home.hero.subtitle"),
  ogDescription: () => t("home.hero.subtitle"),
});

const { articles: featuredArticles } = useTopViewedArticles(5);
const { articles: latestArticles } = useArticles({ pageSize: 8 });
const { articles: hotArticles } = useTopViewedArticles(10);
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <!-- 轮播图 + 热点新闻 并排布局 -->
    <section class="mb-8">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <!-- 轮播图 60% -->
        <div class="lg:col-span-3">
          <HomeHeroCarousel :articles="featuredArticles" />
        </div>
        <!-- 热点新闻 40% -->
        <div class="lg:col-span-2">
          <div
            class="bg-white rounded-xl border border-slate-200 p-4 h-full overflow-hidden"
          >
            <HomeHotNews :articles="hotArticles" />
          </div>
        </div>
      </div>
    </section>

    <!-- 2x2 版块展示 -->
    <section class="mb-8">
      <HomeSectionBlocks />
    </section>

    <!-- 最新要聞 + 快速通道 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        <HomeLatestNews :articles="latestArticles" />
      </div>
      <aside class="space-y-6">
        <HomeQuickLinks />
      </aside>
    </div>
  </div>
</template>
