<script setup lang="ts">
import type { Section } from "~/types";

const { t } = useI18n();
const localePath = useLocalePath();

const { data: sections } = useFetch<Section[]>("/api/sections", {
  query: { active: "1" },
});
</script>

<template>
  <section class="bg-white rounded-lg overflow-hidden">
    <div class="flex items-center gap-2 px-3 py-2.5 bg-slate-50">
      <UIcon name="i-lucide-compass" class="w-5 h-5 text-blue-600" />
      <h2 class="text-base font-bold text-slate-800">
        {{ t("home.sections.title") }}
      </h2>
    </div>
    <div class="p-2.5">
      <div class="grid grid-cols-2 gap-1.5">
        <NuxtLink
          v-for="section in sections"
          :key="section.id"
          :to="localePath(`/${section.id}`)"
          class="group flex items-center gap-2 px-2 py-2 rounded-md transition-colors hover:bg-blue-50"
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
