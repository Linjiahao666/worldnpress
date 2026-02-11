<script setup lang="ts">
const { t } = useI18n();

defineProps<{
  sectionName?: string;
}>();
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div class="text-center">
      <div
        class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-6"
      >
        <UIcon name="i-lucide-construction" class="w-10 h-10 text-green-500" />
      </div>
      <h1 v-if="sectionName" class="text-2xl font-bold text-slate-800 mb-3">
        {{ sectionName }}
      </h1>
      <p class="text-xl text-slate-600 mb-2">
        {{ t("common.comingSoon") }}
      </p>
      <p class="text-slate-400 mb-8">
        {{ t("common.comingSoonDesc") }}
      </p>
      <UButton
        :label="t('common.backToHome')"
        to="/"
        color="primary"
        variant="solid"
        icon="i-lucide-arrow-left"
      />
    </div>
  </div>
</template>
