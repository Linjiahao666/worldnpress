<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-800">
    <LayoutTheHeader />
    <!-- 主导航栏（仅桌面端，收纳式设计） -->
    <div class="hidden lg:block bg-white border-b border-slate-200 shadow-sm sticky top-24 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LayoutTheNavigation />
      </div>
    </div>
    <main class="flex-1 bg-white">
      <slot />
    </main>
    <LayoutTheFooter />
  </div>
</template>
