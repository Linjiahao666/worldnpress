<script setup lang="ts">
import type { Section } from "~/types";

const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

// 从 API 获取活跃的 sections
const { data: sections } = useFetch<Section[]>("/api/sections", {
  query: { active: "1" },
});

// 主要频道（前6个直接展示）+ 更多频道（收纳在下拉中）
const PRIMARY_COUNT = 6;

const primarySections = computed(
  () => sections.value?.slice(0, PRIMARY_COUNT) ?? [],
);
const moreSections = computed(
  () => sections.value?.slice(PRIMARY_COUNT) ?? [],
);
const hasMore = computed(() => moreSections.value.length > 0);

// 任何 more 中的频道处于活跃状态
const isMoreActive = computed(() =>
  moreSections.value.some((s) => isActive(`/${s.id}`)),
);

// 更多下拉的展开状态
const moreOpen = ref(false);

function toggleMore() {
  moreOpen.value = !moreOpen.value;
}

// 点击外部关闭
function onClickOutside(e: MouseEvent) {
  const el = (e.target as HTMLElement).closest(".more-dropdown");
  if (!el) moreOpen.value = false;
}

onMounted(() => document.addEventListener("click", onClickOutside));
onUnmounted(() => document.removeEventListener("click", onClickOutside));

// 路由变化时关闭
watch(() => route.path, () => { moreOpen.value = false; });

function isActive(to: string) {
  const normalizedPath = route.path.replace(/^\/(zh-TW|zh-CN|en)(?=\/)/, "");
  if (to === "/") return normalizedPath === "/" || normalizedPath === "";
  return normalizedPath.startsWith(to);
}
</script>

<template>
  <nav class="w-full" aria-label="Main navigation">
    <div class="flex items-center">
      <!-- 首页链接 -->
      <NuxtLink
        :to="localePath('/')"
        class="shrink-0 px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors border-b-2"
        :class="[
          isActive('/')
            ? 'text-blue-700 border-blue-700'
            : 'text-slate-700 border-transparent hover:text-blue-600 hover:border-blue-300',
        ]"
      >
        {{ t("nav.home") }}
      </NuxtLink>

      <!-- 主要频道（直接展示） -->
      <div
        v-for="section in primarySections"
        :key="section.id"
        class="relative group shrink-0"
      >
        <NuxtLink
          :to="localePath(`/${section.id}`)"
          class="block px-2.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors border-b-2"
          :class="[
            isActive(`/${section.id}`)
              ? 'text-blue-700 border-blue-700'
              : 'text-slate-700 border-transparent hover:text-blue-600 hover:border-blue-300',
          ]"
        >
          {{ t(section.labelKey) }}
        </NuxtLink>

        <!-- 二级栏目下拉面板 -->
        <div
          v-if="section.categories && section.categories.length > 0"
          class="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute top-full left-0 pt-1 z-50"
        >
          <div
            class="bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 min-w-48"
          >
            <NuxtLink
              v-for="cat in section.categories"
              :key="cat.slug"
              :to="localePath(`/${section.id}/${cat.slug}`)"
              class="flex items-center gap-2 px-3.5 py-1.5 text-sm transition-colors"
              :class="[
                isActive(`/${section.id}/${cat.slug}`)
                  ? 'text-blue-700 bg-blue-50 font-medium'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60',
              ]"
            >
              <UIcon
                :name="cat.icon || 'i-lucide-dot'"
                class="w-3.5 h-3.5 shrink-0"
              />
              <span>{{ t(cat.labelKey) }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 「更多」下拉收纳溢出频道 -->
      <div v-if="hasMore" class="relative shrink-0 more-dropdown">
        <button
          class="px-2.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors border-b-2"
          :class="[
            isMoreActive || moreOpen
              ? 'text-blue-700 border-blue-700'
              : 'text-slate-700 border-transparent hover:text-blue-600 hover:border-blue-300',
          ]"
          @click.stop="toggleMore"
        >
          {{ t("nav.more") || "更多" }}
        </button>

        <!-- 更多频道下拉面板 -->
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div
            v-if="moreOpen"
            class="absolute top-full right-0 pt-1 z-50"
          >
            <div
              class="bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 min-w-48"
            >
              <!-- 溢出的一级栏目 -->
              <template v-for="section in moreSections" :key="section.id">
                <NuxtLink
                  :to="localePath(`/${section.id}`)"
                  class="flex items-center gap-2 px-3.5 py-2 text-sm font-medium transition-colors"
                  :class="[
                    isActive(`/${section.id}`)
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/60',
                  ]"
                >
                  <UIcon
                    :name="section.icon || 'i-lucide-folder'"
                    class="w-4 h-4 shrink-0"
                    :class="section.color || 'text-slate-500'"
                  />
                  <span>{{ t(section.labelKey) }}</span>
                </NuxtLink>
              </template>

              <div class="border-t border-slate-100 my-1" />

              <!-- 关于我们 -->
              <NuxtLink
                :to="localePath('/about')"
                class="flex items-center gap-2 px-3.5 py-2 text-sm font-medium transition-colors"
                :class="[
                  isActive('/about')
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/60',
                ]"
              >
                <UIcon
                  name="i-lucide-info"
                  class="w-4 h-4 shrink-0 text-slate-500"
                />
                <span>{{ t("nav.about") }}</span>
              </NuxtLink>
            </div>
          </div>
        </Transition>
      </div>

      <!-- 如果没有更多，直接展示关于我们 -->
      <NuxtLink
        v-if="!hasMore"
        :to="localePath('/about')"
        class="shrink-0 px-2.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors border-b-2"
        :class="[
          isActive('/about')
            ? 'text-blue-700 border-blue-700'
            : 'text-slate-700 border-transparent hover:text-blue-600 hover:border-blue-300',
        ]"
      >
        {{ t("nav.about") }}
      </NuxtLink>
    </div>
  </nav>
</template>
