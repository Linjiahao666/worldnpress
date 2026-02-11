<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

useHead({
  title: "文章管理 - WorldnPress",
});

const { articles, status } = useArticles({ page: 1, pageSize: 50 });
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 頁面標題 -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">文章管理</h1>
          <p class="mt-1 text-sm text-slate-500">管理所有文章内容</p>
        </div>
        <UButton
          to="/admin/articles/create"
          icon="i-lucide-plus"
          color="primary"
        >
          發佈新文章
        </UButton>
      </div>

      <!-- 文章表格 -->
      <UCard>
        <div v-if="status === 'pending'" class="flex justify-center py-12">
          <UIcon
            name="i-lucide-loader-2"
            class="text-3xl text-green-500 animate-spin"
          />
        </div>

        <div v-else-if="articles?.length">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-slate-200">
                  <th class="text-left py-3 px-4 font-medium text-slate-500">
                    標題
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-slate-500">
                    版塊
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-slate-500">
                    分類
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-slate-500">
                    日期
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-slate-500">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="article in articles"
                  :key="article.id"
                  class="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td class="py-3 px-4 font-medium text-slate-900">
                    <NuxtLink
                      :to="`/admin/articles/${article.id}`"
                      class="hover:text-green-600"
                    >
                      {{ article.title }}
                    </NuxtLink>
                  </td>
                  <td class="py-3 px-4">
                    <UBadge
                      :color="article.section === 'news' ? 'primary' : 'info'"
                      variant="subtle"
                    >
                      {{ article.section === "news" ? "新聞" : "ESG" }}
                    </UBadge>
                  </td>
                  <td class="py-3 px-4 text-slate-600">
                    {{ article.category }}
                  </td>
                  <td class="py-3 px-4 text-slate-500">
                    {{
                      new Date(article.publishedAt).toLocaleDateString("zh-TW")
                    }}
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex gap-2">
                      <UButton
                        :to="`/admin/articles/${article.id}`"
                        icon="i-lucide-pencil"
                        size="xs"
                        color="neutral"
                        variant="ghost"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else class="text-center py-12 text-slate-500">暫無文章數據</div>
      </UCard>

      <!-- 返回 -->
      <div class="mt-6">
        <UButton
          to="/admin"
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="ghost"
        >
          返回後台首頁
        </UButton>
      </div>
    </div>
  </div>
</template>
