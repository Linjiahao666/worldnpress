<script setup lang="ts">
const { t } = useI18n();
useSeoMeta({ title: () => `${t("nav.about")} - ${t("site.title")}` });
const localePath = useLocalePath();
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
    <div class="prose max-w-none">
      <p class="text-lg text-slate-600">
        {{ t("footer.about.description") }}
      </p>
      <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-3">
            {{ t("about.categories.contact") }}
          </h3>
          <div class="space-y-2 text-sm text-slate-600">
            <p>{{ t("footer.address") }}</p>
            <p>{{ t("footer.phone") }}</p>
            <p>{{ t("footer.email") }}</p>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-800 mb-3">
            {{ t("about.categories.disclaimer") }}
          </h3>
          <p class="text-sm text-slate-600">
            本网站所刊载的所有资料及信息，仅供参考之用。本网站对任何由于使用本网站材料而造成的直接或间接损失不承担责任。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
