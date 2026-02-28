<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({ title: () => `${t("nav.aiData")} - ${t("site.title")}` });

const features = [
  {
    icon: "i-lucide-activity",
    title: "实时舆情监控",
    desc: "7×24小时全球财经舆情实时追踪，覆盖百万+媒体源",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: "i-lucide-bell",
    title: "智能预警系统",
    desc: "基于AI算法的异常波动预警，支持自定义阈值与推送",
    color: "text-amber-600 bg-amber-50",
  },
  {
    icon: "i-lucide-check-circle",
    title: "数据核查验证",
    desc: "多源交叉验证，自动识别虚假信息与数据异常",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: "i-lucide-user-search",
    title: "企业风险画像",
    desc: "ESG评级、舆情热度、信用风险多维度企业画像分析",
    color: "text-purple-600 bg-purple-50",
  },
  {
    icon: "i-lucide-briefcase",
    title: "企业订阅服务",
    desc: "定制化数据报告、行业简报与专属数据接口服务",
    color: "text-red-600 bg-red-50",
  },
  {
    icon: "i-lucide-bar-chart-3",
    title: "宏观数据中心",
    desc: "GDP、CPI、PMI等核心宏观经济数据可视化与对比分析",
    color: "text-teal-600 bg-teal-50",
  },
];

const dashboardStats = [
  { label: "监控媒体源", value: "1,000,000+", icon: "i-lucide-globe" },
  { label: "日均处理数据", value: "5,000万+", icon: "i-lucide-database" },
  { label: "覆盖国家/地区", value: "195", icon: "i-lucide-map" },
  { label: "企业数据库", value: "500万+", icon: "i-lucide-building-2" },
];
</script>

<template>
  <div>
    <!-- Hero 区域 -->
    <section
      class="bg-linear-to-br from-blue-900 via-blue-800 to-indigo-900 text-white"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <CommonBreadcrumb
          :items="[
            { label: t('nav.home'), to: localePath('/') },
            { label: t('nav.aiData') },
          ]"
          class="mb-6 opacity-70"
        />
        <div class="max-w-3xl">
          <h1 class="text-3xl sm:text-4xl font-bold mb-4">
            AI 舆情大数据中心
          </h1>
          <p class="text-lg text-blue-200 leading-relaxed">
            基于人工智能与大数据技术，为机构与企业提供全球财经舆情监控、智能预警、数据核查与风险画像服务。
          </p>
        </div>

        <!-- 核心数据 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          <div
            v-for="stat in dashboardStats"
            :key="stat.label"
            class="bg-white/10 rounded-xl p-4 backdrop-blur-sm"
          >
            <UIcon :name="stat.icon" class="w-6 h-6 text-blue-300 mb-2" />
            <div class="text-2xl font-bold text-white">{{ stat.value }}</div>
            <div class="text-sm text-blue-200">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能服务 -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-2xl font-bold text-slate-800 mb-8 text-center">
        核心服务能力
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all"
        >
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            :class="feature.color"
          >
            <UIcon :name="feature.icon" class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-slate-800 mb-2">
            {{ feature.title }}
          </h3>
          <p class="text-sm text-slate-500 leading-relaxed">
            {{ feature.desc }}
          </p>
        </div>
      </div>
    </section>

    <!-- 合作咨询 CTA -->
    <section class="bg-slate-50 border-t border-slate-200">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center"
      >
        <h2 class="text-xl font-bold text-slate-800 mb-3">
          需要定制化数据服务？
        </h2>
        <p class="text-slate-500 mb-6 max-w-xl mx-auto">
          我们为金融机构、上市公司、政府部门提供专属的数据分析与舆情监控解决方案
        </p>
        <NuxtLink
          :to="localePath('/about')"
          class="inline-flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
        >
          <UIcon name="i-lucide-mail" class="w-5 h-5" />
          联系我们
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
