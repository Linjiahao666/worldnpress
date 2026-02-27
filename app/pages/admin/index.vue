<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

useHead({
  title: "管理後台 - WorldnPress",
});

const router = useRouter();
const isLoggingOut = ref(false);

// 从 API 获取真实数据
const { data: stats } = useFetch<{
  totalArticles: number;
  totalCategories: number;
  totalViews: number;
  totalSections: number;
}>("/api/admin/stats");

const { articles: recentArticles } = useArticles({ pageSize: 5 });

async function handleLogout() {
  isLoggingOut.value = true;
  try {
    await $fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  } catch {
    router.push("/admin/login");
  }
}

function formatViews(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- 顶部导航 -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center"
          >
            <UIcon
              name="i-lucide-layout-dashboard"
              class="w-5 h-5 text-green-600"
            />
          </div>
          <h1 class="text-lg font-bold text-slate-900">WorldnPress 管理後台</h1>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/"
            class="text-sm text-slate-500 hover:text-green-600 flex items-center gap-1"
          >
            <UIcon name="i-lucide-external-link" class="w-4 h-4" />
            前台首頁
          </NuxtLink>
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            icon="i-lucide-log-out"
            :loading="isLoggingOut"
            @click="handleLogout"
          >
            登出
          </UButton>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <UCard>
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center"
            >
              <UIcon
                name="i-lucide-file-text"
                class="text-2xl text-green-600"
              />
            </div>
            <div>
              <p class="text-sm text-slate-500">文章總數</p>
              <p class="text-2xl font-bold text-slate-900">
                {{ stats?.totalArticles ?? "..." }}
              </p>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"
            >
              <UIcon name="i-lucide-folder" class="text-2xl text-blue-600" />
            </div>
            <div>
              <p class="text-sm text-slate-500">分類總數</p>
              <p class="text-2xl font-bold text-slate-900">
                {{ stats?.totalCategories ?? "..." }}
              </p>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center"
            >
              <UIcon name="i-lucide-eye" class="text-2xl text-purple-600" />
            </div>
            <div>
              <p class="text-sm text-slate-500">總瀏覽量</p>
              <p class="text-2xl font-bold text-slate-900">
                {{ stats ? formatViews(stats.totalViews) : "..." }}
              </p>
            </div>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center"
            >
              <UIcon
                name="i-lucide-layout-grid"
                class="text-2xl text-amber-600"
              />
            </div>
            <div>
              <p class="text-sm text-slate-500">模块總數</p>
              <p class="text-2xl font-bold text-slate-900">
                {{ stats?.totalSections ?? "..." }}
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- 快捷操作 + 最近文章 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-slate-900">快捷操作</h3>
          </template>
          <div class="flex flex-col gap-3">
            <UButton
              to="/admin/articles/create"
              icon="i-lucide-plus"
              color="primary"
              block
            >
              發佈新文章
            </UButton>
            <UButton
              to="/admin/articles"
              icon="i-lucide-list"
              color="neutral"
              variant="outline"
              block
            >
              管理文章
            </UButton>
            <UButton
              to="/admin/sections"
              icon="i-lucide-layout-grid"
              color="neutral"
              variant="outline"
              block
            >
              模块管理
            </UButton>
            <UButton
              to="/admin/backup"
              icon="i-lucide-database-backup"
              color="neutral"
              variant="outline"
              block
            >
              备份管理
            </UButton>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-slate-900">最近文章</h3>
          </template>
          <div v-if="recentArticles.length > 0" class="space-y-3">
            <NuxtLink
              v-for="article in recentArticles"
              :key="article.id"
              :to="`/admin/articles/${article.id}`"
              class="block group"
            >
              <p
                class="text-sm font-medium text-slate-700 group-hover:text-green-600 transition-colors line-clamp-1"
              >
                {{ article.title }}
              </p>
              <p class="text-xs text-slate-400 mt-0.5">
                {{ article.section }} / {{ article.category }}
              </p>
            </NuxtLink>
          </div>
          <p v-else class="text-slate-500 text-sm">暫無文章</p>
        </UCard>
      </div>
    </div>
  </div>
</template>
