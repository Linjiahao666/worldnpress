<script setup lang="ts">
const { t, locale } = useI18n();
const isMobileNavOpen = ref(false);
const localePath = useLocalePath();
const router = useRouter();

// 搜索功能
const showSearch = ref(false);
const searchQuery = ref("");
const searchResults = ref<any[]>([]);
const isSearching = ref(false);

let searchTimer: ReturnType<typeof setTimeout> | null = null;

function toggleSearch() {
  showSearch.value = !showSearch.value;
  if (showSearch.value) {
    nextTick(() => {
      const input = document.querySelector(".search-input") as HTMLInputElement;
      input?.focus();
    });
  } else {
    searchQuery.value = "";
    searchResults.value = [];
  }
}

function onSearchInput() {
  if (searchTimer) clearTimeout(searchTimer);
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }
  searchTimer = setTimeout(async () => {
    isSearching.value = true;
    try {
      const data = await $fetch<any>("/api/articles", {
        query: { search: searchQuery.value, pageSize: 8 },
      });
      searchResults.value = data.data || [];
    } catch {
      searchResults.value = [];
    } finally {
      isSearching.value = false;
    }
  }, 300);
}

function goToArticle(article: any) {
  showSearch.value = false;
  searchQuery.value = "";
  searchResults.value = [];
  router.push(
    localePath(`/${article.section}/${article.category}/${article.id}`),
  );
}

function handleSearchKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    showSearch.value = false;
    searchQuery.value = "";
    searchResults.value = [];
  }
}

const formattedDate = computed(() =>
  new Date().toLocaleDateString(locale.value, {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }),
);
</script>

<template>
  <header class="sticky top-0 z-50">
    <!-- 顶部信息栏（深蓝色） -->
    <div class="bg-blue-900 text-blue-100">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-8 text-xs"
      >
        <div class="hidden sm:flex items-center gap-3">
          <span>{{ t("site.description") }}</span>
          <span class="text-blue-400">|</span>
          <span class="text-blue-300">{{ formattedDate }}</span>
        </div>
        <span class="sm:hidden text-xs">{{ t("site.title") }}</span>
        <div class="flex items-center gap-3">
          <LayoutLanguageSwitcher />
        </div>
      </div>
    </div>

    <!-- 主标题区（白色背景） -->
    <div class="bg-white border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- 网站标志 -->
          <NuxtLink
            :to="localePath('/')"
            class="flex items-center gap-2 shrink-0"
          >
            <span class="text-2xl font-black text-blue-700">IET</span>
            <div class="hidden sm:flex flex-col leading-tight">
              <span class="text-base font-bold text-slate-800">{{
                t("site.title")
              }}</span>
              <span class="text-xs text-slate-400">{{
                t("site.subtitle")
              }}</span>
            </div>
          </NuxtLink>

          <!-- 搜索按钮 + 移动端菜单 -->
          <div class="flex items-center gap-2">
            <UButton
              variant="ghost"
              color="neutral"
              icon="i-lucide-search"
              :aria-label="t('common.search')"
              @click="toggleSearch"
            />
            <UButton
              class="lg:hidden"
              variant="ghost"
              color="neutral"
              icon="i-lucide-menu"
              :aria-label="t('common.search')"
              @click="isMobileNavOpen = true"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索栏 -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="showSearch"
        class="absolute left-0 right-0 top-full border-t border-slate-200 bg-white shadow-lg"
      >
        <div class="max-w-3xl mx-auto px-4 py-3">
          <div class="relative">
            <UIcon
              name="i-lucide-search"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            />
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('common.searchPlaceholder')"
              class="search-input w-full pl-10 pr-4 py-2.5 text-base border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @input="onSearchInput"
              @keydown="handleSearchKeydown"
            />
          </div>

          <!-- 搜索结果 -->
          <div
            v-if="
              searchQuery.trim() && (searchResults.length > 0 || isSearching)
            "
            class="mt-2 max-h-80 overflow-y-auto rounded-lg border border-slate-200"
          >
            <div
              v-if="isSearching"
              class="p-4 text-center text-slate-500 text-sm"
            >
              {{ t("common.loading") }}
            </div>
            <div
              v-for="article in searchResults"
              v-else
              :key="article.id"
              class="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-b-0 transition-colors"
              @click="goToArticle(article)"
            >
              <h4 class="text-sm font-medium text-slate-800 line-clamp-1">
                {{ article.title }}
              </h4>
              <p class="text-xs text-slate-500 mt-1 line-clamp-1">
                {{ article.summary }}
              </p>
            </div>
          </div>
          <div
            v-else-if="
              searchQuery.trim() && searchResults.length === 0 && !isSearching
            "
            class="mt-2 p-4 text-center text-slate-400 text-sm"
          >
            {{ t("common.noData") }}
          </div>
        </div>
      </div>
    </Transition>

    <!-- 移动端导航 -->
    <LayoutMobileNav v-model:open="isMobileNavOpen" />
  </header>
</template>
