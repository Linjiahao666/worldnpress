<script setup lang="ts">
export interface BreadcrumbItem {
  label: string;
  to?: string;
}

defineProps<{
  items: BreadcrumbItem[];
}>();
</script>

<template>
  <nav
    aria-label="Breadcrumb"
    class="flex items-center gap-1 text-sm text-slate-500"
  >
    <template v-for="(item, index) in items" :key="index">
      <NuxtLink
        v-if="item.to"
        :to="item.to"
        class="hover:text-green-600 transition-colors"
      >
        {{ item.label }}
      </NuxtLink>
      <span v-else class="text-slate-800 font-medium">{{ item.label }}</span>
      <UIcon
        v-if="index < items.length - 1"
        name="i-lucide-chevron-right"
        class="w-3 h-3 text-slate-400"
      />
    </template>
  </nav>
</template>
