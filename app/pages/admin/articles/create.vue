<script setup lang="ts">
import { newsCategories, esgCategories } from "~/utils/navigation";

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

useHead({
  title: "發佈新文章 - WorldnPress",
});

const { t } = useI18n();
const router = useRouter();

const form = reactive({
  title: "",
  summary: "",
  content: "",
  section: "news" as "news" | "esg",
  category: "",
  coverImage: "",
  tags: "",
  authorName: "",
});

const coverPreview = ref("");
const isUploading = ref(false);
const coverFileInput = ref<HTMLInputElement | null>(null);

function handleCoverRemove() {
  coverPreview.value = "";
  form.coverImage = "";
  if (coverFileInput.value) coverFileInput.value.value = "";
}

async function handleCoverChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) {
    coverPreview.value = "";
    form.coverImage = "";
    return;
  }

  // 限制大小 5MB
  if (file.size > 5 * 1024 * 1024) {
    alert("圖片大小不能超過 5MB");
    input.value = "";
    return;
  }

  isUploading.value = true;
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await $fetch<{ url: string }>("/api/upload", {
      method: "POST",
      body: formData,
    });
    coverPreview.value = res.url;
    form.coverImage = res.url;
  } catch (error) {
    console.error("上傳封面失敗：", error);
    alert("上傳封面失敗，請重試");
  } finally {
    isUploading.value = false;
  }
}

const sectionOptions = [
  { label: "新聞中心", value: "news" },
  { label: "ESG 可持續發展", value: "esg" },
];

const categoryOptions = computed(() => {
  const cats = form.section === "news" ? newsCategories : esgCategories;
  return cats.map((c) => ({ label: t(c.labelKey), value: c.slug }));
});

// 版块切换时重置分类
watch(
  () => form.section,
  () => {
    form.category = "";
  },
);

const isSubmitting = ref(false);

async function handleSubmit() {
  isSubmitting.value = true;
  try {
    await $fetch("/api/articles", {
      method: "POST",
      body: {
        ...form,
        tags: form.tags
          .split(",")
          .map((tag: string) => tag.trim())
          .filter(Boolean),
        author: {
          name: form.authorName || "編輯部",
          avatar: "",
        },
      },
    });
    router.push("/admin/articles");
  } catch (error) {
    console.error("创建文章失败：", error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 頁面標題 -->
      <div class="mb-8">
        <UButton
          to="/admin/articles"
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="ghost"
          class="mb-4"
        >
          返回文章列表
        </UButton>
        <h1 class="text-2xl font-bold text-slate-900">發佈新文章</h1>
      </div>

      <!-- 表單 -->
      <form @submit.prevent="handleSubmit">
        <div class="space-y-6">
          <!-- 基本信息 -->
          <UCard>
            <template #header>
              <h3 class="font-semibold text-slate-900">基本信息</h3>
            </template>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  文章標題 *
                </label>
                <UInput
                  v-model="form.title"
                  placeholder="請輸入文章標題"
                  size="lg"
                  required
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">
                    版塊 *
                  </label>
                  <USelect
                    v-model="form.section"
                    :items="sectionOptions"
                    value-key="value"
                    size="lg"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">
                    分類 *
                  </label>
                  <USelect
                    v-model="form.category"
                    :items="categoryOptions"
                    value-key="value"
                    placeholder="請選擇分類"
                    size="lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  封面圖片
                </label>
                <!-- 已上传预览 -->
                <div v-if="coverPreview" class="mb-3">
                  <div class="relative inline-block w-full">
                    <img
                      :src="coverPreview"
                      alt="封面預覽"
                      class="w-full max-h-64 object-cover rounded-lg border border-slate-200"
                    />
                    <button
                      type="button"
                      class="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                      @click="handleCoverRemove"
                    >
                      <UIcon name="i-lucide-x" class="w-4 h-4" />
                    </button>
                  </div>
                  <p class="text-xs text-slate-400 mt-1">
                    {{ form.coverImage }}
                  </p>
                </div>
                <!-- 上传按钮 -->
                <div
                  v-if="!coverPreview"
                  class="flex items-center justify-center w-full"
                >
                  <label
                    class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer"
                    :class="
                      isUploading
                        ? 'border-green-300 bg-green-50/50'
                        : 'border-slate-300 hover:border-green-400 bg-slate-50 hover:bg-green-50/30'
                    "
                  >
                    <div
                      class="flex flex-col items-center justify-center pt-5 pb-6"
                    >
                      <UIcon
                        v-if="!isUploading"
                        name="i-lucide-image-plus"
                        class="w-10 h-10 mb-3 text-slate-400"
                      />
                      <UIcon
                        v-else
                        name="i-lucide-loader-2"
                        class="w-10 h-10 mb-3 text-green-500 animate-spin"
                      />
                      <p class="mb-1 text-sm text-slate-500">
                        <span class="font-semibold">{{
                          isUploading ? "正在上傳..." : "點擊上傳封面圖片"
                        }}</span>
                      </p>
                      <p class="text-xs text-slate-400">
                        支持 PNG、JPG、WEBP，最大 5MB
                      </p>
                    </div>
                    <input
                      ref="coverFileInput"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      :disabled="isUploading"
                      @change="handleCoverChange"
                    />
                  </label>
                </div>
              </div>
            </div>
          </UCard>

          <!-- 作者信息 -->
          <UCard>
            <template #header>
              <h3 class="font-semibold text-slate-900">作者信息</h3>
            </template>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  作者名稱
                </label>
                <UInput v-model="form.authorName" placeholder="編輯部" />
              </div>
            </div>
          </UCard>

          <!-- 內容編輯 -->
          <UCard>
            <template #header>
              <h3 class="font-semibold text-slate-900">文章內容</h3>
            </template>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  摘要 *
                </label>
                <UTextarea
                  v-model="form.summary"
                  :rows="3"
                  placeholder="請輸入文章摘要..."
                  required
                  class="w-full [&_textarea]:resize-none"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  內容 (支持 HTML) *
                </label>
                <UTextarea
                  v-model="form.content"
                  :rows="16"
                  placeholder="請輸入文章內容，支持 HTML 格式..."
                  required
                  class="w-full [&_textarea]:min-h-64"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  標籤 (以逗號分隔)
                </label>
                <UInput v-model="form.tags" placeholder="金融, ESG, 綠色債券" />
              </div>
            </div>
          </UCard>

          <!-- 操作區 -->
          <div class="flex justify-end gap-3">
            <UButton to="/admin/articles" color="neutral" variant="outline">
              取消
            </UButton>
            <UButton
              type="submit"
              color="primary"
              icon="i-lucide-check"
              :loading="isSubmitting"
            >
              發佈文章
            </UButton>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
