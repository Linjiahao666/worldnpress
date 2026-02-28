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
  { key: "legal", label: t("about.categories.legal-notice") },
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
          {{ t("about.page.introduction.p1") }}
        </p>
        <p class="text-slate-700 leading-relaxed">
          {{ t("about.page.introduction.p2") }}
        </p>
      </div>
    </div>

    <!-- 经营方针 -->
    <div v-show="activeTab === 'policy'" class="prose max-w-none">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-blue-800 mb-3">
            {{ t("about.page.policy.values.title") }}
          </h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            {{ t("about.page.policy.values.desc") }}
          </p>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-blue-800 mb-3">
            {{ t("about.page.policy.direction.title") }}
          </h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            {{ t("about.page.policy.direction.desc") }}
          </p>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-blue-800 mb-3">
            {{ t("about.page.policy.core.title") }}
          </h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            {{ t("about.page.policy.core.desc") }}
          </p>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-blue-800 mb-3">
            {{ t("about.page.policy.mission.title") }}
          </h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            {{ t("about.page.policy.mission.desc") }}
          </p>
        </div>
      </div>
    </div>

    <!-- 资质展示 -->
    <div v-show="activeTab === 'qualification'" class="prose max-w-none">
      <div class="bg-white rounded-xl border border-slate-200 p-8">
        <h2 class="text-xl font-bold text-slate-800 mb-6">
          {{ t("about.page.qualification.title") }}
        </h2>
        <div class="space-y-4 text-slate-600">
          <div class="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
            <span class="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
            <p>{{ t("about.page.qualification.items.newsLicense") }}</p>
          </div>
          <div class="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
            <span class="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
            <p>{{ t("about.page.qualification.items.icp") }}</p>
          </div>
          <div class="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
            <span class="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
            <p>{{ t("about.page.qualification.items.culture") }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 联系方式 -->
    <div v-show="activeTab === 'contact'" class="prose max-w-none">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-blue-800 mb-4">
            {{ t("about.page.contact.editorial") }}
          </h3>
          <div class="space-y-3 text-sm text-slate-600">
            <p>
              <strong>{{ t("about.page.contact.address") }}：</strong
              >{{ t("footer.address") }}
            </p>
            <p>
              <strong>{{ t("about.page.contact.phone") }}：</strong
              >{{ t("footer.phone") }}
            </p>
            <p>
              <strong>{{ t("about.page.contact.email") }}：</strong
              >{{ t("footer.email") }}
            </p>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-blue-800 mb-4">
            {{ t("about.page.contact.business") }}
          </h3>
          <div class="space-y-3 text-sm text-slate-600">
            <p>
              <strong>{{ t("about.page.contact.ad") }}：</strong
              >ad@worldnpress.com
            </p>
            <p>
              <strong>{{ t("about.page.contact.content") }}：</strong
              >content@worldnpress.com
            </p>
            <p>
              <strong>{{ t("about.page.contact.thinktank") }}：</strong
              >thinktank@worldnpress.com
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 法律声明 -->
    <div v-show="activeTab === 'legal'" class="prose max-w-none">
      <div class="bg-white rounded-xl border border-slate-200 p-8">
        <h2 class="text-xl font-bold text-slate-800 mb-6">
          {{ t("about.page.legal.title") }}
        </h2>
        <div class="space-y-6 text-sm text-slate-600 leading-relaxed">
          <div>
            <h3 class="text-base font-semibold text-slate-800 mb-2">
              {{ t("about.page.legal.copyrightTitle") }}
            </h3>
            <p>
              {{ t("about.page.legal.copyrightText") }}
            </p>
          </div>
          <div>
            <h3 class="text-base font-semibold text-slate-800 mb-2">
              {{ t("about.page.legal.disclaimerTitle") }}
            </h3>
            <p>
              {{ t("about.page.legal.disclaimerText") }}
            </p>
          </div>
          <div>
            <h3 class="text-base font-semibold text-slate-800 mb-2">
              {{ t("about.page.legal.privacyTitle") }}
            </h3>
            <p>
              {{ t("about.page.legal.privacyText") }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
