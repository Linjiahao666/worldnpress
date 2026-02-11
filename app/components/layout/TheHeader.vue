<script setup lang="ts">
const { t } = useI18n();
const isMobileNavOpen = ref(false);
const localePath = useLocalePath();
</script>

<template>
  <header
    class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200"
  >
    <!-- 頂部欄 -->
    <div class="bg-slate-50 border-b border-slate-100">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9 text-sm text-slate-500"
      >
        <span>{{ t("site.description") }}</span>
        <LayoutLanguageSwitcher />
      </div>
    </div>

    <!-- 主標題區 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- 標誌 -->
        <NuxtLink
          :to="localePath('/')"
          class="flex items-center gap-2 shrink-0"
        >
          <span class="text-2xl font-bold text-green-500">W</span>
          <span class="text-lg font-semibold text-slate-800 hidden sm:inline">{{
            t("site.title")
          }}</span>
        </NuxtLink>

        <!-- 桌面端導航 -->
        <div class="hidden lg:block flex-1 mx-8">
          <LayoutTheNavigation />
        </div>

        <!-- 移動端菜單按鈕 -->
        <UButton
          class="lg:hidden"
          variant="ghost"
          color="neutral"
          icon="i-lucide-menu"
          :aria-label="t('common.search')"
          @click="isMobileNavOpen = true"
        />
      </div>
    </div>

    <!-- 移動端導航 -->
    <LayoutMobileNav v-model:open="isMobileNavOpen" />
  </header>
</template>
