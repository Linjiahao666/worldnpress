<script setup lang="ts">
const { t, locale } = useI18n();

const stats = computed(() => [
  {
    labelKey: "esg.stats.articles",
    value: 156,
    icon: "i-lucide-file-text",
  },
  {
    labelKey: "esg.stats.categories",
    value: 8,
    icon: "i-lucide-folder-open",
  },
  {
    labelKey: "esg.stats.views",
    value: 89400,
    icon: "i-lucide-eye",
  },
]);

function formatNumber(value: number) {
  return new Intl.NumberFormat(locale.value, {
    notation: value > 10000 ? "compact" : "standard",
  }).format(value);
}
</script>

<template>
  <section
    class="bg-linear-to-r from-green-50 to-white rounded-xl border border-green-100 p-6"
  >
    <h3 class="text-lg font-bold text-slate-800 mb-4">
      {{ t("esg.stats.title") }}
    </h3>
    <div class="grid grid-cols-3 gap-4">
      <div v-for="stat in stats" :key="stat.labelKey" class="text-center">
        <UIcon :name="stat.icon" class="w-6 h-6 text-green-500 mx-auto mb-2" />
        <p class="text-2xl font-bold text-slate-800">
          {{ formatNumber(stat.value) }}
        </p>
        <p class="text-xs text-slate-500">
          {{ t(stat.labelKey) }}
        </p>
      </div>
    </div>
  </section>
</template>
