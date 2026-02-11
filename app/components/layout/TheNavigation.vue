<script setup lang="ts">
const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

const navItems = [
  { labelKey: "nav.home", to: "/" },
  { labelKey: "nav.news", to: "/news" },
  { labelKey: "nav.esg", to: "/esg" },
];

function isActive(to: string) {
  const normalizedPath = route.path.replace(/^\/(zh-TW|zh-CN|en)(?=\/)/, "");
  if (to === "/") return normalizedPath === "/" || normalizedPath === "";
  return normalizedPath.startsWith(to);
}
</script>

<template>
  <nav class="flex flex-wrap items-center gap-2" aria-label="Main navigation">
    <NuxtLink
      v-for="item in navItems"
      :key="item.to"
      :to="localePath(item.to)"
      class="px-3 py-2 text-base font-medium whitespace-nowrap rounded-md transition-colors"
      :class="[
        isActive(item.to)
          ? 'text-green-600 bg-green-50'
          : 'text-slate-600 hover:text-green-600 hover:bg-slate-50',
      ]"
    >
      {{ t(item.labelKey) }}
    </NuxtLink>
  </nav>
</template>
