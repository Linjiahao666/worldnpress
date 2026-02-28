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
  <div>
    <!-- 数据看板 -->
    <section class="bg-blue-900 text-white py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomeDataDashboard />
      </div>
    </section>

    <!-- 焦点轮播 + 要闻速览 -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <!-- 焦点轮播 60% -->
        <div class="lg:col-span-3">
          <HomeHeroCarousel :articles="featuredArticles" />
        </div>
        <!-- 要闻速览 40% -->
        <div class="lg:col-span-2">
          <div
            class="bg-white rounded-xl border border-slate-200 p-4 h-full overflow-hidden"
          >
            <HomeHotNews :articles="hotArticles" />
          </div>
        </div>
      </div>
    </section>

    <!-- 频道导航（替代原 QuickLinks，从 nav 移至正文区域） -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      <HomeSectionNav />
    </section>

    <!-- 版块新闻展示（2x2网格） -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
      <HomeSectionBlocks />
    </section>

    <!-- 最新要闻 -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <HomeLatestNews :articles="latestArticles" />
        </div>
        <aside class="space-y-6">
          <HomeSectionCard />
        </aside>
      </div>
    </section>
  </div>
</template>
