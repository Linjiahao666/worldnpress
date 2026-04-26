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
      <div class="space-y-10">
        <!-- 第一行：网站信息（含承印一行） -->
        <div class="grid grid-cols-1 items-start">
          <div class="max-w-5xl">
            <div class="mb-4 flex flex-wrap items-end gap-x-3 gap-y-1">
              <p class="text-3xl font-black text-blue-400 leading-none">IET</p>
              <p
                class="text-3xl font-bold text-white leading-none tracking-tight"
              >
                {{ t("footer.brandName") }}
              </p>
            </div>
            <p class="text-sm text-slate-300 leading-8 mb-5 max-w-4xl">
              {{ t("footer.about.description") }}
            </p>
            <div class="space-y-2 text-sm text-slate-400">
              <div class="flex items-start gap-2 text-slate-300">
                <UIcon
                  name="i-lucide-printer"
                  class="w-4 h-4 shrink-0 mt-0.5 text-slate-400"
                />
                <p>
                  <span class="font-semibold text-slate-200">
                    {{ t("footer.printUnit.title") }}:
                  </span>
                  {{ t("footer.printUnit.nameZh") }}
                  {{ t("footer.printUnit.nameEn") }}
                </p>
              </div>
              <div class="flex items-start gap-2">
                <UIcon
                  name="i-lucide-map-pin"
                  class="w-4 h-4 shrink-0 mt-0.5"
                />
                <div class="space-y-1">
                  <p>
                    {{ t("footer.printUnit.addressZhLabel") }}:
                    {{ t("footer.printUnit.addressZh") }}
                  </p>
                  <p>
                    {{ t("footer.printUnit.addressEnLabel") }}:
                    {{ t("footer.printUnit.addressEn") }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-phone" class="w-4 h-4 shrink-0" />
                <span>{{ t("footer.phone") }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 第二行：栏目导航 + 合规公示 -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div class="lg:col-span-8">
            <h3 class="text-white font-semibold mb-4">
              {{ t("footer.sections.title") }}
            </h3>
            <div
              class="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm"
            >
              <NuxtLink
                v-for="section in sections"
                :key="section.id"
                :to="localePath(`/${section.id}`)"
                class="hover:text-blue-400 transition-colors break-keep leading-7"
              >
                {{ t(section.labelKey) }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/about')"
                class="hover:text-blue-400 transition-colors break-keep leading-7"
              >
                {{ t("nav.about") }}
              </NuxtLink>
              <NuxtLink
                :to="localePath('/reporters')"
                class="hover:text-blue-400 transition-colors break-keep leading-7"
              >
                {{ t("footer.links.reporters") }}
              </NuxtLink>
            </div>
          </div>

          <div class="lg:col-span-4">
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
      </div>

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
