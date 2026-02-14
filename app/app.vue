<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
onMounted(() => {
  const root = document.documentElement;
  root.classList.toggle("dark", false);
  root.classList.toggle("light", true);
});
</script>
