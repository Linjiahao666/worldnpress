<script setup lang="ts">
import type { Section } from "~/types";

const { t } = useI18n();
const currentYear = new Date().getFullYear();
const localePath = useLocalePath();

// 获取活跃 sections 用于底部栏目导航
const { data: sections } = useFetch<Section[]>("/api/sections", {
  query: { active: "1" },
});
</script>

<template>
  <footer class="bg-slate-900 text-slate-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- 公司信息 -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-2xl font-black text-blue-400">IET</span>
            <span class="text-lg font-semibold text-white">{{
              t("footer.companyName")
            }}</span>
          </div>
          <p class="text-sm text-slate-400 mb-4">
            {{ t("footer.about.description") }}
          </p>
          <div class="space-y-2 text-sm text-slate-400">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-map-pin" class="w-4 h-4 shrink-0" />
              <span>{{ t("footer.address") }}</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-phone" class="w-4 h-4 shrink-0" />
              <span>{{ t("footer.phone") }}</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-mail" class="w-4 h-4 shrink-0" />
              <a
                :href="`mailto:${t('footer.email')}`"
                class="hover:text-blue-400 transition-colors"
              >
                {{ t("footer.email") }}
              </a>
            </div>
          </div>
        </div>

        <!-- 栏目导航 -->
        <div class="lg:col-span-2">
          <h3 class="text-white font-semibold mb-4">
            {{ t("footer.sections.title") }}
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
            <NuxtLink
              v-for="section in sections"
              :key="section.id"
              :to="localePath(`/${section.id}`)"
              class="hover:text-blue-400 transition-colors"
            >
              {{ t(section.labelKey) }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/about')"
              class="hover:text-blue-400 transition-colors"
            >
              {{ t("nav.about") }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/reporters')"
              class="hover:text-blue-400 transition-colors"
            >
              {{ t("footer.links.reporters") }}
            </NuxtLink>
          </div>
        </div>

        <!-- 合规公示 -->
        <div>
          <h3 class="text-white font-semibold mb-4">
            {{ t("footer.legal.title") }}
          </h3>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink
                :to="localePath('/about')"
                class="hover:text-blue-400 transition-colors"
              >
                {{ t("footer.links.disclaimer") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="localePath('/about')"
                class="hover:text-blue-400 transition-colors"
              >
                {{ t("footer.links.privacy") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="localePath('/about')"
                class="hover:text-blue-400 transition-colors"
              >
                {{ t("footer.links.terms") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="localePath('/reporters')"
                class="hover:text-blue-400 transition-colors"
              >
                {{ t("footer.links.reporters") }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- 底部合规信息 -->
      <div class="mt-10 pt-6 border-t border-slate-700">
        <div class="text-xs text-slate-500 space-y-2">
          <p>{{ t("footer.legal.disclaimer") }}</p>
          <p>{{ t("footer.legal.copyright") }}</p>
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2"
          >
            <p>{{ t("footer.copyright", { year: currentYear }) }}</p>
            <p>{{ t("footer.companyNameEn") }}</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
