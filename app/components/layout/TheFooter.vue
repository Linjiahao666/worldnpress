<script setup lang="ts">
const { t } = useI18n();
const currentYear = new Date().getFullYear();
const localePath = useLocalePath();
</script>

<template>
  <footer class="bg-slate-900 text-slate-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- 公司信息 -->
        <div class="lg:col-span-2">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-2xl font-bold text-green-400">W</span>
            <span class="text-lg font-semibold text-white">{{
              t("footer.companyName")
            }}</span>
          </div>
          <p class="text-sm text-slate-400 mb-4 max-w-md">
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
                class="hover:text-green-400 transition-colors"
              >
                {{ t("footer.email") }}
              </a>
            </div>
          </div>
        </div>

        <!-- 快速連結 -->
        <div>
          <h3 class="text-white font-semibold mb-4">
            {{ t("footer.links.title") }}
          </h3>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink
                :to="localePath('/news')"
                class="hover:text-green-400 transition-colors"
              >
                {{ t("nav.news") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="localePath('/esg')"
                class="hover:text-green-400 transition-colors"
              >
                {{ t("nav.esg") }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="localePath('/reporters')"
                class="hover:text-green-400 transition-colors"
              >
                {{ t("footer.links.reporters") }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- 底部信息 -->
      <div
        class="mt-10 pt-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500"
      >
        <p>{{ t("footer.copyright", { year: currentYear }) }}</p>
        <p>{{ t("footer.companyNameEn") }}</p>
      </div>
    </div>
  </footer>
</template>
