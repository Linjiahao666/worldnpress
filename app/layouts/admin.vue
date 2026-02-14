<script setup lang="ts"></script>

<template>
  <div class="admin-layout min-h-screen bg-slate-50">
    <slot />
  </div>
</template>

<style scoped>
/* 强制 admin 界面始终使用亮色模式 UI 变量，不受 dark class 影响 */
.admin-layout {
  color-scheme: light only;
  --ui-bg: var(--color-white);
  --ui-bg-muted: var(--ui-color-neutral-50);
  --ui-bg-elevated: var(--ui-color-neutral-100);
  --ui-bg-accented: var(--ui-color-neutral-200);
  --ui-bg-inverted: var(--ui-color-neutral-900);
  --ui-border: var(--ui-color-neutral-200);
  --ui-border-muted: var(--ui-color-neutral-200);
  --ui-border-accented: var(--ui-color-neutral-300);
  --ui-border-inverted: var(--ui-color-neutral-900);
  --ui-text-dimmed: var(--ui-color-neutral-400);
  --ui-text-muted: var(--ui-color-neutral-500);
  --ui-text-toned: var(--ui-color-neutral-600);
  --ui-text: var(--ui-color-neutral-700);
  --ui-text-highlighted: var(--ui-color-neutral-900);
  --ui-text-inverted: var(--color-white);
}
</style>
