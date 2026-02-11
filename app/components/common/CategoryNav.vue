<script setup lang="ts">
import type { Category } from "~/types";

const props = defineProps<{
  categories: Category[];
  section: string;
  activeCategory?: string;
}>();

const { t } = useI18n();
const localePath = useLocalePath();
</script>

<template>
  <nav class="flex flex-wrap gap-2" aria-label="Category navigation">
    <NuxtLink
      :to="localePath(`/${section}`)"
      class="px-3 py-1.5 text-base rounded-full border transition-colors"
      :class="[
        !activeCategory
          ? 'bg-green-500 text-white border-green-500'
          : 'border-slate-200 text-slate-600 hover:border-green-300 hover:text-green-600',
      ]"
    >
      {{ t("home.sections.viewAll") }}
    </NuxtLink>
    <NuxtLink
      v-for="cat in categories"
      :key="cat.slug"
      :to="localePath(`/${section}/${cat.slug}`)"
      class="px-3 py-1.5 text-base rounded-full border transition-colors"
      :class="[
        activeCategory === cat.slug
          ? 'bg-green-500 text-white border-green-500'
          : 'border-slate-200 text-slate-600 hover:border-green-300 hover:text-green-600',
      ]"
    >
      {{ t(cat.labelKey) }}
    </NuxtLink>
  </nav>
</template>
