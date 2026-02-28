<script setup lang="ts">
const { t } = useI18n();
useSeoMeta({ title: () => `${t("nav.about")} - ${t("site.title")}` });
const localePath = useLocalePath();

const activeTab = ref("introduction");

const tabs = computed(() => [
  { key: "introduction", label: t("about.categories.introduction") },
  { key: "policy", label: t("about.categories.policy") },
  { key: "qualification", label: t("about.categories.qualification") },
  { key: "contact", label: t("about.categories.contact") },
  { key: "legal", label: t("about.categories.legal") },
]);
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <CommonBreadcrumb
      :items="[
        { label: t('nav.home'), to: localePath('/') },
        { label: t('nav.about') },
      ]"
      class="mb-4"
    />
    <h1 class="text-2xl font-bold text-slate-900 mb-6">{{ t("nav.about") }}</h1>

    <!-- Tab 导航 -->
    <div class="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-3">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors"
        :class="
          activeTab === tab.key
            ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
            : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50/50'
        "
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 平台介绍 -->
    <div v-show="activeTab === 'introduction'" class="prose max-w-none">
      <div class="bg-blue-50/50 border border-blue-100 rounded-xl p-8 mb-6">
        <h2 class="text-xl font-bold text-blue-900 mb-4">
          {{ t("about.introTitle") }}
        </h2>
        <p class="text-slate-700 leading-relaxed mb-4">
          《国际经济时报》是一家专注于全球经济、金融市场、ESG与可持续发展的综合性财经媒体平台。
          平台以"权威、专业、深度、全球视野"为办刊宗旨，致力于为政商学研各界提供高质量的财经资讯与智库服务。
        </p>
        <p class="text-slate-700 leading-relaxed">
          平台设有新闻中心、粤港澳大湾区·香港财经、ESG与可持续发展、绿色金融、AI舆情大数据中心、
          智库研究中心、会展与活动中心、舆论监督与诚信建设、品牌与企业服务等九大频道，
          覆盖宏观经济、环球财经、金融市场、产业经济、国际贸易等核心报道领域。
        </p>
      </div>
    </div>

    <!-- 经营方针 -->
    <div v-show="activeTab === 'policy'" class="prose max-w-none">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-blue-800 mb-3">办刊理念</h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            坚持新闻专业主义，秉承客观、公正、独立的报道原则，以高质量内容服务经济决策。
          </p>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-blue-800 mb-3">发展方向</h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            聚焦ESG、绿色金融、AI大数据三大战略方向，打造「媒体+智库+数据+服务」四位一体的新型财经平台。
          </p>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-blue-800 mb-3">核心价值</h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            权威发声、深度分析、全球视野、创新驱动。致力于成为中国与世界经济对话的重要桥梁。
          </p>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-blue-800 mb-3">服务宗旨</h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            为政府机构、金融机构、上市公司、研究机构提供精准的资讯支持与专业的智库咨询服务。
          </p>
        </div>
      </div>
    </div>

    <!-- 资质展示 -->
    <div v-show="activeTab === 'qualification'" class="prose max-w-none">
      <div class="bg-white rounded-xl border border-slate-200 p-8">
        <h2 class="text-xl font-bold text-slate-800 mb-6">资质与荣誉</h2>
        <div class="space-y-4 text-slate-600">
          <div class="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
            <span class="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
            <p>互联网新闻信息服务许可证（待申领）</p>
          </div>
          <div class="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
            <span class="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
            <p>ICP备案信息（待备案）</p>
          </div>
          <div class="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
            <span class="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
            <p>网络文化经营许可证（待申领）</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 联系方式 -->
    <div v-show="activeTab === 'contact'" class="prose max-w-none">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-blue-800 mb-4">编辑部</h3>
          <div class="space-y-3 text-sm text-slate-600">
            <p><strong>地址：</strong>{{ t("footer.address") }}</p>
            <p><strong>电话：</strong>{{ t("footer.phone") }}</p>
            <p><strong>邮箱：</strong>{{ t("footer.email") }}</p>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-blue-800 mb-4">商务合作</h3>
          <div class="space-y-3 text-sm text-slate-600">
            <p><strong>广告合作：</strong>ad@worldnpress.com</p>
            <p><strong>内容合作：</strong>content@worldnpress.com</p>
            <p><strong>智库服务：</strong>thinktank@worldnpress.com</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 法律声明 -->
    <div v-show="activeTab === 'legal'" class="prose max-w-none">
      <div class="bg-white rounded-xl border border-slate-200 p-8">
        <h2 class="text-xl font-bold text-slate-800 mb-6">
          法律声明与免责条款
        </h2>
        <div class="space-y-6 text-sm text-slate-600 leading-relaxed">
          <div>
            <h3 class="text-base font-semibold text-slate-800 mb-2">
              版权声明
            </h3>
            <p>
              本网站所有内容，包括但不限于文字、图片、音频、视频、软件、程序及网页版式设计等，
              均受《中华人民共和国著作权法》及相关法律法规的保护。未经本站书面授权，
              任何单位或个人不得以任何方式转载、复制、引用、链接、抓取或以其他方式使用。
            </p>
          </div>
          <div>
            <h3 class="text-base font-semibold text-slate-800 mb-2">
              免责条款
            </h3>
            <p>
              本网站所刊载的所有资料及信息，仅供参考之用，不构成任何投资建议。
              本网站对任何由于使用本网站材料而造成的直接或间接损失不承担责任。
              市场有风险，投资需谨慎。
            </p>
          </div>
          <div>
            <h3 class="text-base font-semibold text-slate-800 mb-2">
              隐私政策
            </h3>
            <p>
              我们重视用户隐私保护。本站仅收集提供服务所必需的最少信息，
              不会将用户个人信息出售或分享给第三方（法律要求除外）。
              使用本网站即表示您同意本隐私政策。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
