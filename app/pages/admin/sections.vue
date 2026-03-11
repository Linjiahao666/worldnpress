<script setup lang="ts">
import type { Section } from "~/types";

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

const { t } = useI18n();

useHead({
  title: () => `${t("admin.sections")} - WorldnPress ${t("admin.title")}`,
});

const localePath = useLocalePath();
const toast = useToast();

// 获取所有模块
const {
  data: sections,
  refresh,
  status,
} = useFetch<Section[]>("/api/sections");

// 新增/编辑对话框
const showDialog = ref(false);
const isEditing = ref(false);
const editForm = ref({
  id: "",
  labelKey: "",
  icon: "",
  color: "",
  sortOrder: 0,
  showOnHome: false,
});

// 删除确认对话框
const showDeleteDialog = ref(false);
const deleteTarget = ref<Section | null>(null);
const isDeleting = ref(false);

function openCreateDialog() {
  isEditing.value = false;
  editForm.value = {
    id: "",
    labelKey: "",
    icon: "i-lucide-folder",
    color: "text-slate-600",
    sortOrder: (sections.value?.length ?? 0) + 1,
    showOnHome: false,
  };
  showDialog.value = true;
}

function openEditDialog(section: Section) {
  isEditing.value = true;
  editForm.value = {
    id: section.id,
    labelKey: section.labelKey,
    icon: section.icon,
    color: section.color,
    sortOrder: section.sortOrder,
    showOnHome: section.showOnHome,
  };
  showDialog.value = true;
}

const isSaving = ref(false);

async function handleSave() {
  isSaving.value = true;
  try {
    if (isEditing.value) {
      await $fetch(`/api/sections/${editForm.value.id}`, {
        method: "PUT",
        body: {
          labelKey: editForm.value.labelKey,
          icon: editForm.value.icon,
          color: editForm.value.color,
          sortOrder: editForm.value.sortOrder,
          showOnHome: editForm.value.showOnHome,
        },
      });
      toast.add({ title: t("admin.sectionsPage.updated"), color: "success" });
    } else {
      await $fetch("/api/sections", {
        method: "POST",
        body: editForm.value,
      });
      toast.add({ title: t("admin.sectionsPage.created"), color: "success" });
    }
    showDialog.value = false;
    refresh();
  } catch (err: any) {
    toast.add({
      title: t("admin.sectionsPage.actionFailed"),
      description:
        err?.data?.statusMessage || t("admin.sectionsPage.unknownError"),
      color: "error",
    });
  } finally {
    isSaving.value = false;
  }
}

function confirmDelete(section: Section) {
  deleteTarget.value = section;
  showDeleteDialog.value = true;
}

async function handleDelete() {
  if (!deleteTarget.value) return;
  isDeleting.value = true;
  try {
    await $fetch(`/api/sections/${deleteTarget.value.id}`, {
      method: "DELETE",
    });
    toast.add({ title: t("admin.sectionsPage.deleted"), color: "success" });
    showDeleteDialog.value = false;
    refresh();
  } catch (err: any) {
    toast.add({
      title: t("admin.sectionsPage.deleteFailed"),
      description:
        err?.data?.statusMessage || t("admin.sectionsPage.unknownError"),
      color: "error",
    });
  } finally {
    isDeleting.value = false;
  }
}

// 乐观更新：切换首页展示
async function toggleHomeDisplay(section: Section) {
  const original = section.showOnHome;
  section.showOnHome = !original;
  try {
    await $fetch(`/api/sections/${section.id}`, {
      method: "PUT",
      body: { showOnHome: !original },
    });
  } catch {
    section.showOnHome = original;
    toast.add({ title: t("admin.sectionsPage.actionFailed"), color: "error" });
  }
}

// 乐观更新：切换启用状态
async function toggleActive(section: Section) {
  const original = section.isActive;
  section.isActive = !original;
  try {
    await $fetch(`/api/sections/${section.id}`, {
      method: "PUT",
      body: { isActive: !original },
    });
  } catch {
    section.isActive = original;
    toast.add({ title: t("admin.sectionsPage.actionFailed"), color: "error" });
  }
}

// 获取翻译后的模块名称
function getSectionName(section: Section) {
  const translated = t(section.labelKey);
  // 如果翻译键不存在，t() 会返回原始 key，此时尝试用 id 生成可读名称
  if (translated === section.labelKey) {
    return section.id
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  return translated;
}

// 常用图标选项
const iconOptions = [
  "i-lucide-globe",
  "i-lucide-landmark",
  "i-lucide-factory",
  "i-lucide-leaf",
  "i-lucide-newspaper",
  "i-lucide-lightbulb",
  "i-lucide-database",
  "i-lucide-shield-check",
  "i-lucide-trending-up",
  "i-lucide-bar-chart-3",
  "i-lucide-building-2",
  "i-lucide-zap",
  "i-lucide-cpu",
  "i-lucide-recycle",
  "i-lucide-award",
  "i-lucide-graduation-cap",
];

const colorOptions = [
  { label: t("admin.sectionsPage.colors.blue"), value: "text-blue-600" },
  { label: t("admin.sectionsPage.colors.red"), value: "text-red-600" },
  { label: t("admin.sectionsPage.colors.green"), value: "text-green-600" },
  { label: t("admin.sectionsPage.colors.amber"), value: "text-amber-600" },
  { label: t("admin.sectionsPage.colors.purple"), value: "text-purple-600" },
  { label: t("admin.sectionsPage.colors.indigo"), value: "text-indigo-600" },
  { label: t("admin.sectionsPage.colors.cyan"), value: "text-cyan-600" },
  { label: t("admin.sectionsPage.colors.slate"), value: "text-slate-600" },
  { label: t("admin.sectionsPage.colors.pink"), value: "text-pink-600" },
  { label: t("admin.sectionsPage.colors.orange"), value: "text-orange-600" },
];
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- 顶部导航 -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <NuxtLink
            :to="localePath('/admin')"
            class="text-slate-500 hover:text-blue-600 flex items-center gap-1"
          >
            <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
            {{ t("admin.backToDashboard") }}
          </NuxtLink>
          <h1 class="text-lg font-bold text-slate-900">
            {{ t("admin.sections") }}
          </h1>
        </div>
        <UButton icon="i-lucide-plus" color="primary" @click="openCreateDialog">
          {{ t("admin.createSection") }}
        </UButton>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 模块列表 -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900">
              {{
                t("admin.sectionsPage.allSections", {
                  count: sections?.length ?? 0,
                })
              }}
            </h2>
            <p class="text-sm text-slate-500">
              {{ t("admin.sectionsPage.listHint") }}
            </p>
          </div>
        </template>

        <div
          v-if="status === 'pending'"
          class="text-center py-12 text-slate-400"
        >
          {{ t("common.loading") }}
        </div>

        <div
          v-else-if="sections && sections.length > 0"
          class="divide-y divide-slate-100"
        >
          <div
            v-for="section in sections"
            :key="section.id"
            class="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors"
          >
            <!-- 图标 -->
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              :class="[section.isActive ? 'bg-blue-50' : 'bg-slate-100']"
            >
              <UIcon
                :name="section.icon || 'i-lucide-folder'"
                class="w-5 h-5"
                :class="section.isActive ? section.color : 'text-slate-400'"
              />
            </div>

            <!-- 信息 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-semibold text-slate-800">
                  {{ getSectionName(section) }}
                </h3>
                <span
                  class="text-xs text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded"
                  >{{ section.id }}</span
                >
                <span
                  v-if="!section.isActive"
                  class="px-1.5 py-0.5 text-xs rounded bg-red-50 text-red-500"
                >
                  {{ t("admin.sectionsPage.disabled") }}
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">
                {{
                  t("admin.sectionsPage.sortAndCategories", {
                    sort: section.sortOrder,
                    count: section.categories?.length ?? 0,
                  })
                }}
              </p>
            </div>

            <!-- 首页展示开关 -->
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-xs text-slate-500">{{
                t("admin.showOnHome")
              }}</span>
              <button
                class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                :class="section.showOnHome ? 'bg-blue-500' : 'bg-slate-300'"
                @click="toggleHomeDisplay(section)"
              >
                <span
                  class="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                  :class="
                    section.showOnHome ? 'translate-x-4.5' : 'translate-x-0.5'
                  "
                />
              </button>
            </div>

            <!-- 启用/停用 -->
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-xs text-slate-500">{{
                t("admin.sectionActive")
              }}</span>
              <button
                class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                :class="section.isActive ? 'bg-blue-500' : 'bg-slate-300'"
                @click="toggleActive(section)"
              >
                <span
                  class="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                  :class="
                    section.isActive ? 'translate-x-4.5' : 'translate-x-0.5'
                  "
                />
              </button>
            </div>

            <!-- 操作按钮 -->
            <div class="flex items-center gap-1 shrink-0">
              <UButton
                variant="ghost"
                color="neutral"
                size="xs"
                icon="i-lucide-pencil"
                @click="openEditDialog(section)"
              />
              <UButton
                variant="ghost"
                color="error"
                size="xs"
                icon="i-lucide-trash-2"
                @click="confirmDelete(section)"
              />
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12 text-slate-400">
          <UIcon
            name="i-lucide-inbox"
            class="w-12 h-12 mx-auto mb-3 text-slate-300"
          />
          <p>{{ t("admin.sectionsPage.empty") }}</p>
        </div>
      </UCard>
    </div>

    <!-- 新增/编辑对话框 -->
    <UModal v-model:open="showDialog">
      <template #content>
        <div class="bg-white rounded-xl overflow-hidden">
          <!-- 对话框标题栏 -->
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50"
          >
            <div class="flex items-center gap-2">
              <UIcon
                :name="isEditing ? 'i-lucide-pencil' : 'i-lucide-plus-circle'"
                class="w-5 h-5 text-blue-600"
              />
              <h3 class="text-lg font-bold text-slate-900">
                {{
                  isEditing ? t("admin.editSection") : t("admin.createSection")
                }}
              </h3>
            </div>
            <button
              class="p-1 rounded-lg hover:bg-slate-200 transition-colors"
              @click="showDialog = false"
            >
              <UIcon name="i-lucide-x" class="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <!-- 对话框内容 -->
          <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <!-- ID -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >{{ t("admin.sectionId") }} (slug)</label
              >
              <input
                v-model="editForm.id"
                type="text"
                :disabled="isEditing"
                :placeholder="t('admin.sectionsPage.sectionIdPlaceholder')"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
              />
              <p class="text-xs text-slate-400 mt-1">
                {{ t("admin.sectionsPage.sectionIdHelp") }}
              </p>
            </div>

            <!-- Label Key -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >{{ t("admin.sectionLabelKey") }} (labelKey)</label
              >
              <input
                v-model="editForm.labelKey"
                type="text"
                :placeholder="t('admin.sectionsPage.labelKeyPlaceholder')"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p class="text-xs text-slate-400 mt-1">
                {{ t("admin.sectionsPage.labelKeyHelp") }}
              </p>
            </div>

            <!-- 图标 -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">{{
                t("admin.sectionIcon")
              }}</label>
              <div class="grid grid-cols-8 gap-2">
                <button
                  v-for="icon in iconOptions"
                  :key="icon"
                  class="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors"
                  :class="
                    editForm.icon === icon
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  "
                  @click="editForm.icon = icon"
                >
                  <UIcon :name="icon" class="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <input
                v-model="editForm.icon"
                type="text"
                :placeholder="t('admin.sectionsPage.iconPlaceholder')"
                class="w-full px-3 py-2 mt-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- 颜色 -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">{{
                t("admin.sectionColor")
              }}</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="color in colorOptions"
                  :key="color.value"
                  class="px-3 py-1 rounded-full text-xs border transition-colors"
                  :class="
                    editForm.color === color.value
                      ? 'border-blue-500 bg-blue-50 font-semibold'
                      : 'border-slate-200 hover:border-slate-300'
                  "
                  @click="editForm.color = color.value"
                >
                  <span :class="color.value">●</span> {{ color.label }}
                </button>
              </div>
            </div>

            <!-- 排序 -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">{{
                t("admin.sectionSortOrder")
              }}</label>
              <input
                v-model.number="editForm.sortOrder"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- 首页展示 -->
            <div class="flex items-center gap-3">
              <input
                v-model="editForm.showOnHome"
                type="checkbox"
                class="w-4 h-4 rounded text-blue-500 focus:ring-blue-500"
              />
              <label class="text-sm text-slate-700">{{
                t("admin.sectionsPage.showOnHomeLabel")
              }}</label>
            </div>
          </div>

          <!-- 对话框底部按钮 -->
          <div
            class="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50"
          >
            <UButton
              variant="outline"
              color="neutral"
              @click="showDialog = false"
            >
              {{ t("common.cancel") }}
            </UButton>
            <UButton color="primary" :loading="isSaving" @click="handleSave">
              {{ isEditing ? t("admin.save") : t("admin.sectionsPage.create") }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- 删除确认对话框 -->
    <UModal v-model:open="showDeleteDialog">
      <template #content>
        <div class="bg-white rounded-xl overflow-hidden">
          <!-- 对话框标题栏 -->
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
              <h3 class="text-lg font-bold text-slate-900">
                {{ t("admin.sectionsPage.confirmDeleteTitle") }}
              </h3>
            </div>
            <button
              class="p-1 rounded-lg hover:bg-slate-200 transition-colors"
              @click="showDeleteDialog = false"
            >
              <UIcon name="i-lucide-x" class="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <!-- 内容 -->
          <div class="p-6">
            <p class="text-sm text-slate-600">
              {{ t("admin.sectionsPage.confirmDeletePrefix") }}
              <strong class="text-slate-900">{{
                deleteTarget ? getSectionName(deleteTarget) : ""
              }}</strong>
              <span class="text-xs text-slate-400 ml-1"
                >({{ deleteTarget?.id }})</span
              >
              {{ t("admin.sectionsPage.confirmDeleteSuffix") }}
            </p>
            <p class="text-xs text-red-500 mt-2">
              {{ t("admin.sectionsPage.deleteWarning") }}
            </p>
          </div>

          <!-- 底部按钮 -->
          <div
            class="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50"
          >
            <UButton
              variant="outline"
              color="neutral"
              @click="showDeleteDialog = false"
            >
              {{ t("common.cancel") }}
            </UButton>
            <UButton color="error" :loading="isDeleting" @click="handleDelete">
              {{ t("admin.sectionsPage.confirmDeleteButton") }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
