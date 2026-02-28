<script setup lang="ts">
import type { Section } from "~/types";

const { t } = useI18n();
const open = defineModel<boolean>("open", { default: false });
const route = useRoute();
const localePath = useLocalePath();

// 从 API 获取活跃的 sections
const { data: sections } = useFetch<Section[]>("/api/sections", {
  query: { active: "1" },
});

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

function toggleSection(id: string) {
  expandedSection.value = expandedSection.value === id ? null : id;
}
</script>

<template>
  <USlideover v-model:open="open" side="left" title="">
    <template #body>
      <div class="flex items-center gap-2 mb-6 px-2">
        <span class="text-2xl font-black text-blue-700">IET</span>
        <span class="text-lg font-semibold text-slate-800">{{
          t("site.title")
        }}</span>
      </div>

      <nav class="flex flex-col gap-1">
        <!-- 首页 -->
        <NuxtLink
          :to="localePath('/')"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-bold transition-colors"
          :class="[
            isActive('/')
              ? 'text-blue-700 bg-blue-50'
              : 'text-slate-800 hover:text-blue-600 hover:bg-slate-50',
          ]"
          @click="open = false"
        >
          {{ t("nav.home") }}
        </NuxtLink>

        <!-- 动态 sections -->
        <div v-for="section in sections" :key="section.id">
          <div class="flex items-center">
            <NuxtLink
              :to="localePath(`/${section.id}`)"
              class="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-bold transition-colors"
              :class="[
                isActive(`/${section.id}`)
                  ? 'text-blue-700 bg-blue-50'
                  : 'text-slate-800 hover:text-blue-600 hover:bg-slate-50',
              ]"
              @click="open = false"
            >
              {{ t(section.labelKey) }}
            </NuxtLink>
            <button
              v-if="section.categories && section.categories.length > 0"
              class="p-2 text-slate-400 hover:text-slate-600"
              @click="toggleSection(section.id)"
            >
              <UIcon
                name="i-lucide-chevron-down"
                class="w-4 h-4 transition-transform"
                :class="{ 'rotate-180': expandedSection === section.id }"
              />
            </button>
          </div>
          <!-- 子分类 -->
          <div
            v-if="section.categories && expandedSection === section.id"
            class="ml-4 pl-3 border-l border-blue-200 mt-1 mb-2 space-y-0.5"
          >
            <NuxtLink
              v-for="cat in section.categories"
              :key="cat.slug"
              :to="localePath(`/${section.id}/${cat.slug}`)"
              class="block px-3 py-1.5 text-sm text-slate-500 hover:text-blue-600 rounded transition-colors"
              @click="open = false"
            >
              {{ t(cat.labelKey) }}
            </NuxtLink>
          </div>
        </div>

        <!-- 关于我们 -->
        <NuxtLink
          :to="localePath('/about')"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-bold transition-colors"
          :class="[
            isActive('/about')
              ? 'text-blue-700 bg-blue-50'
              : 'text-slate-800 hover:text-blue-600 hover:bg-slate-50',
          ]"
          @click="open = false"
        >
          {{ t("nav.about") }}
        </NuxtLink>
      </nav>

      <div class="mt-6 pt-6 border-t border-slate-200 px-2">
        <LayoutLanguageSwitcher />
      </div>
    </template>
  </USlideover>
</template>
