<script setup lang="ts">
import { mainNavigation } from "~/utils/navigation";

const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

const openDropdown = ref<string | null>(null);
let closeTimer: ReturnType<typeof setTimeout> | null = null;

function isActive(to: string) {
  const normalizedPath = route.path.replace(/^\/(zh-TW|zh-CN|en)(?=\/)/, "");
  if (to === "/") return normalizedPath === "/" || normalizedPath === "";
  return normalizedPath.startsWith(to);
}

function showDropdown(key: string) {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
  openDropdown.value = key;
}

function hideDropdown() {
  closeTimer = setTimeout(() => {
    openDropdown.value = null;
  }, 150);
}
</script>

<template>
  <nav class="flex flex-wrap items-center gap-0.5" aria-label="Main navigation">
    <div
      v-for="item in mainNavigation"
      :key="item.to"
      class="relative"
      @mouseenter="item.children ? showDropdown(item.to) : undefined"
      @mouseleave="item.children ? hideDropdown() : undefined"
    >
      <NuxtLink
        :to="localePath(item.to)"
        class="px-2.5 py-2 text-sm font-medium whitespace-nowrap rounded-md transition-colors inline-flex items-center gap-0.5"
        :class="[
          isActive(item.to)
            ? 'text-green-600 bg-green-50'
            : 'text-slate-600 hover:text-green-600 hover:bg-slate-50',
        ]"
      >
        {{ t(item.labelKey) }}
        <UIcon
          v-if="item.children"
          name="i-lucide-chevron-down"
          class="w-3 h-3 opacity-50"
        />
      </NuxtLink>

      <!-- 下拉菜单 -->
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div
          v-if="item.children && openDropdown === item.to"
          class="absolute top-full left-0 mt-0.5 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 min-w-48 z-50"
          @mouseenter="showDropdown(item.to)"
          @mouseleave="hideDropdown()"
        >
          <NuxtLink
            v-for="child in item.children"
            :key="child.to"
            :to="localePath(child.to)"
            class="block px-4 py-1.5 text-sm text-slate-600 hover:text-green-600 hover:bg-green-50 transition-colors"
            @click="openDropdown = null"
          >
            {{ t(child.labelKey) }}
          </NuxtLink>
        </div>
      </Transition>
    </div>
  </nav>
</template>
