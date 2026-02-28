<script setup lang="ts">
import type { Article } from "~/types";

defineProps<{
  articles: Article[];
}>();

const { locale } = useI18n();
const activeIndex = ref(0);
const localePath = useLocalePath();

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600"><rect fill="#1e3a8a" width="1200" height="600"/><text fill="#93c5fd" font-family="sans-serif" font-size="48" text-anchor="middle" x="600" y="310">IET</text></svg>',
  );

let timer: ReturnType<typeof setInterval> | null = null;

function startAutoPlay(length: number) {
  stopAutoPlay();
  if (length <= 1) return;
  timer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % length;
  }, 5000);
}

function stopAutoPlay() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function prev(length: number) {
  activeIndex.value = (activeIndex.value - 1 + length) % length;
}

function next(length: number) {
  activeIndex.value = (activeIndex.value + 1) % length;
}

function getCoverSrc(article: Article) {
  return article.coverImage || PLACEHOLDER_IMAGE;
}

onMounted(() => {
  startAutoPlay(5);
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<template>
  <div
    v-if="articles.length > 0"
    class="relative rounded-xl overflow-hidden shadow-lg"
    @mouseenter="stopAutoPlay"
    @mouseleave="startAutoPlay(articles.length)"
  >
    <div class="relative h-72 sm:h-80 lg:h-105">
      <TransitionGroup name="fade">
        <div
          v-for="(article, index) in articles"
          v-show="index === activeIndex"
          :key="article.id"
          class="absolute inset-0"
        >
          <img
            :src="getCoverSrc(article)"
            :alt="article.title"
            class="w-full h-full object-cover"
            loading="lazy"
          />
          <div
            class="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent pointer-events-none"
          />
          <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10 z-10">
            <NuxtLink
              :to="
                localePath(
                  `/${article.section}/${article.category}/${article.id}`,
                )
              "
              class="block group"
            >
              <h2
                class="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors line-clamp-2 drop-shadow-md"
              >
                {{ article.title }}
              </h2>
            </NuxtLink>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- 左右箭头 -->
    <button
      v-if="articles.length > 1"
      class="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-blue-700/80 transition-colors"
      aria-label="Previous"
      @click="prev(articles.length)"
    >
      <UIcon name="i-lucide-chevron-left" class="w-5 h-5" />
    </button>
    <button
      v-if="articles.length > 1"
      class="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-blue-700/80 transition-colors"
      aria-label="Next"
      @click="next(articles.length)"
    >
      <UIcon name="i-lucide-chevron-right" class="w-5 h-5" />
    </button>

    <!-- 指示器 -->
    <div class="absolute bottom-3 right-6 flex items-center gap-1.5 z-20">
      <button
        v-for="(_, index) in articles"
        :key="index"
        class="w-2 h-2 rounded-full transition-all"
        :class="
          index === activeIndex
            ? 'bg-blue-400 w-6'
            : 'bg-white/40 hover:bg-white/60'
        "
        :aria-label="`Slide ${index + 1}`"
        @click="activeIndex = index"
      />
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
