<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();

const sections = [
  {
    labelKey: "nav.news",
    to: "/news",
    icon: "i-lucide-newspaper",
    active: true,
  },
  { labelKey: "nav.esg", to: "/esg", icon: "i-lucide-leaf", active: true },
];
</script>

<template>
  <section>
    <h2 class="text-xl font-bold text-slate-800 mb-4">
      {{ t("home.sections.title") }}
    </h2>
    <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <NuxtLink
        v-for="section in sections"
        :key="section.to"
        :to="localePath(section.to)"
        class="group relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all"
        :class="[
          section.active
            ? 'border-green-200 bg-green-50/50 hover:bg-green-50 hover:border-green-300 hover:shadow-sm'
            : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200',
        ]"
      >
        <UIcon
          :name="section.icon"
          class="w-8 h-8 transition-colors"
          :class="section.active ? 'text-green-500' : 'text-slate-400'"
        />
        <span
          class="text-sm font-medium text-center transition-colors"
          :class="section.active ? 'text-slate-700' : 'text-slate-500'"
        >
          {{ t(section.labelKey) }}
        </span>
      </NuxtLink>
    </div>
  </section>
</template>
