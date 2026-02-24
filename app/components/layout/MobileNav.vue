<script setup lang="ts">
import { mainNavigation } from "~/utils/navigation";

const { t } = useI18n();
const open = defineModel<boolean>("open", { default: false });
const route = useRoute();
const localePath = useLocalePath();

const expandedSection = ref<string | null>(null);

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

function toggleSection(to: string) {
  expandedSection.value = expandedSection.value === to ? null : to;
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
        <div v-for="item in mainNavigation" :key="item.to">
          <div class="flex items-center">
            <NuxtLink
              :to="localePath(item.to)"
              class="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-colors"
              :class="[
                isActive(item.to)
                  ? 'text-green-600 bg-green-50'
                  : 'text-slate-600 hover:text-green-600 hover:bg-slate-50',
              ]"
              @click="open = false"
            >
              {{ t(item.labelKey) }}
            </NuxtLink>
            <button
              v-if="item.children"
              class="p-2 text-slate-400 hover:text-slate-600"
              @click="toggleSection(item.to)"
            >
              <UIcon
                name="i-lucide-chevron-down"
                class="w-4 h-4 transition-transform"
                :class="{ 'rotate-180': expandedSection === item.to }"
              />
            </button>
          </div>
          <!-- 子菜单 -->
          <div
            v-if="item.children && expandedSection === item.to"
            class="ml-4 pl-3 border-l border-slate-200 mt-1 mb-2 space-y-0.5"
          >
            <NuxtLink
              v-for="child in item.children"
              :key="child.to"
              :to="localePath(child.to)"
              class="block px-3 py-1.5 text-sm text-slate-500 hover:text-green-600 rounded transition-colors"
              @click="open = false"
            >
              {{ t(child.labelKey) }}
            </NuxtLink>
          </div>
        </div>
      </nav>

      <div class="mt-6 pt-6 border-t border-slate-200 px-2">
        <LayoutLanguageSwitcher />
      </div>
    </template>
  </USlideover>
</template>
