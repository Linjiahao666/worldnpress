<script setup lang="ts">
const { t } = useI18n();
const open = defineModel<boolean>("open", { default: false });
const route = useRoute();
const localePath = useLocalePath();

const navItems = [
  { labelKey: "nav.home", to: "/", icon: "i-lucide-home" },
  { labelKey: "nav.news", to: "/news", icon: "i-lucide-newspaper" },
  { labelKey: "nav.esg", to: "/esg", icon: "i-lucide-leaf" },
];

watch(
  () => route.path,
  () => {
    open.value = false;
  },
);

function isActive(to: string) {
  const normalizedPath = route.path.replace(/^\/(zh-TW|zh-CN|en)(?=\/)/, "");
  if (to === "/") return normalizedPath === "/" || normalizedPath === "";
  return normalizedPath.startsWith(to);
}
</script>

<template>
  <USlideover v-model:open="open" side="left" title="">
    <template #body>
      <div class="flex items-center gap-2 mb-6 px-2">
        <span class="text-2xl font-bold text-green-500">W</span>
        <span class="text-lg font-semibold text-slate-800">{{
          t("site.title")
        }}</span>
      </div>

      <nav class="flex flex-col gap-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="localePath(item.to)"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-colors"
          :class="[
            isActive(item.to)
              ? 'text-green-600 bg-green-50'
              : 'text-slate-600 hover:text-green-600 hover:bg-slate-50',
          ]"
          @click="open = false"
        >
          <UIcon :name="item.icon" class="w-5 h-5" />
          {{ t(item.labelKey) }}
        </NuxtLink>
      </nav>

      <div class="mt-6 pt-6 border-t border-slate-200 px-2">
        <LayoutLanguageSwitcher />
      </div>
    </template>
  </USlideover>
</template>
