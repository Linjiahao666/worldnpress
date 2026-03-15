<script setup lang="ts">
import type { Article } from "~/types";

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

useHead({
  title: "文章管理 - WorldnPress",
});

const toast = useToast();
const { articles, status, refresh } = useArticles({ page: 1, pageSize: 50 });
const deletingId = ref<string | null>(null);

// 删除确认对话框
const showDeleteDialog = ref(false);
const deleteTarget = ref<Article | null>(null);

function confirmDelete(article: Article) {
  deleteTarget.value = article;
  showDeleteDialog.value = true;
}

async function handleDelete() {
  if (!deleteTarget.value) return;

  deletingId.value = deleteTarget.value.id;
  try {
    await $fetch(`/api/articles/${deleteTarget.value.id}`, {
      method: "DELETE" as never,
    });
    toast.add({ title: "文章已刪除", color: "success" });
    showDeleteDialog.value = false;
    await refresh();
  } catch (error: any) {
    toast.add({
      title: "刪除失敗",
      description: error?.data?.statusMessage,
      color: "error",
    });
  } finally {
    deletingId.value = null;
  }
}
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
                      <UButton
                        icon="i-lucide-trash-2"
                        size="xs"
                        color="error"
                        variant="ghost"
                        :loading="deletingId === article.id"
                        @click="confirmDelete(article)"
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

    <!-- 删除确认对话框 -->
    <UModal v-model:open="showDeleteDialog">
      <template #content>
        <div class="bg-white rounded-xl overflow-hidden">
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-slate-200"
          >
            <div class="flex items-center gap-2">
              <div
                class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center"
              >
                <UIcon
                  name="i-lucide-alert-triangle"
                  class="w-4 h-4 text-red-600"
                />
              </div>
              <h3 class="text-lg font-bold text-slate-900">確認刪除文章</h3>
            </div>
            <button
              class="p-1 rounded-lg hover:bg-slate-200 transition-colors"
              @click="showDeleteDialog = false"
            >
              <UIcon name="i-lucide-x" class="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <div class="p-6">
            <p class="text-sm text-slate-600">
              確定要刪除文章
              <strong class="text-slate-900">{{ deleteTarget?.title }}</strong>
              嗎？
            </p>
            <p class="text-xs text-red-500 mt-2">
              此操作不可撤銷，文章內容將被永久刪除。
            </p>
          </div>
          <div
            class="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50"
          >
            <UButton
              variant="outline"
              color="neutral"
              @click="showDeleteDialog = false"
            >
              取消
            </UButton>
            <UButton
              color="error"
              :loading="!!deletingId"
              @click="handleDelete"
            >
              確認刪除
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
