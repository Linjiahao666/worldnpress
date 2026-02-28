<script setup lang="ts">
import type { Section } from "~/types";

const { t } = useI18n();
const localePath = useLocalePath();

const { data: sections } = useFetch<Section[]>("/api/sections", {
  query: { active: "1" },
});
</script>

<template>
  <section class="bg-white rounded-xl border border-slate-200 overflow-hidden">
    <div
      class="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50"
    >
      <UIcon name="i-lucide-compass" class="w-5 h-5 text-blue-600" />
      <h2 class="text-base font-bold text-slate-800">
        {{ t("home.sections.title") }}
      </h2>
    </div>
    <div class="p-3">
      <div class="grid grid-cols-2 gap-2">
        <NuxtLink
          v-for="section in sections"
          :key="section.id"
          :to="localePath(`/${section.id}`)"
          class="group flex items-center gap-2 p-2.5 rounded-lg transition-all hover:bg-blue-50 hover:shadow-sm"
        >
          <UIcon
            :name="section.icon || 'i-lucide-folder'"
            class="w-5 h-5 transition-colors shrink-0"
            :class="section.color || 'text-blue-600'"
          />
          <span
            class="text-sm font-medium text-slate-600 group-hover:text-blue-700 truncate"
          >
            {{ t(section.labelKey) }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
