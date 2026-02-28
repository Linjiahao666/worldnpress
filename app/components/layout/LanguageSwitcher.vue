<script setup lang="ts">
const { locale, locales, setLocale } = useI18n();

const availableLocales = computed(() => {
  return locales.value.filter((l) => typeof l !== "string");
});
</script>

<template>
  <div class="flex items-center gap-1">
    <button
      v-for="loc in availableLocales"
      :key="loc.code"
      class="px-2 py-1 text-sm rounded transition-colors"
      :class="[
        locale === loc.code
          ? 'text-blue-200 font-semibold bg-blue-800/50'
          : 'text-blue-300/70 hover:text-blue-100',
      ]"
      @click="setLocale(loc.code)"
    >
      {{ loc.name }}
    </button>
  </div>
</template>
