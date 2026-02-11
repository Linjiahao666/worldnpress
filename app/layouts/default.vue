<template>
  <div class="min-h-screen flex flex-col bg-white text-slate-800">
    <LayoutTheHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutTheFooter />
  </div>
</template>
