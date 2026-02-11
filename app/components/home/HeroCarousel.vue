<script setup lang="ts">
import type { Article } from "~/types";

defineProps<{
  articles: Article[];
}>();

const { t, locale } = useI18n();
const activeIndex = ref(0);
const localePath = useLocalePath();

let timer: ReturnType<typeof setInterval> | null = null;

function startAutoPlay(length: number) {
  stopAutoPlay();
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

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat(locale.value, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr));
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
    class="relative bg-slate-900 rounded-xl overflow-hidden"
    @mouseenter="stopAutoPlay"
    @mouseleave="startAutoPlay(articles.length)"
  >
    <div class="relative h-64 sm:h-80 lg:h-96">
      <TransitionGroup name="fade">
        <div
          v-for="(article, index) in articles"
          v-show="index === activeIndex"
          :key="article.id"
          class="absolute inset-0 flex items-end"
        >
          <div
            class="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/50 to-transparent"
          />
          <div class="relative z-10 p-6 sm:p-8 lg:p-10 w-full">
            <NuxtLink
              :to="
                localePath(
                  `/${article.section}/${article.category}/${article.id}`,
                )
              "
              class="block group"
            >
              <h2
                class="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors"
              >
                {{ article.title }}
              </h2>
              <p class="text-slate-300 text-base sm:text-lg line-clamp-2 mb-3">
                {{ article.summary }}
              </p>
              <span class="text-xs text-slate-400">{{
                formatDate(article.publishedAt)
              }}</span>
            </NuxtLink>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- 指示器 -->
    <div class="absolute bottom-3 right-6 flex items-center gap-1.5 z-20">
      <button
        v-for="(_, index) in articles"
        :key="index"
        class="w-2 h-2 rounded-full transition-all"
        :class="
          index === activeIndex
            ? 'bg-green-400 w-6'
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
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
