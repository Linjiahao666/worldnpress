<script setup lang="ts">
const { t } = useI18n();
definePageMeta({ middleware: "hide-coming-soon" });
useSeoMeta({ title: () => `${t("nav.about")} - ${t("site.title")}` });
</script>

<template>
  <div />
</template>
