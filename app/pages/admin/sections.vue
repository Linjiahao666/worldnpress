<script setup lang="ts">
import type { Section } from "~/types";

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

useHead({
  title: "模块管理 - WorldnPress 管理后台",
});

const toast = useToast();

// 获取所有模块
const {
  data: sections,
  refresh,
  status,
} = useFetch<Section[]>("/api/sections");

// 新增/编辑模态框
const showModal = ref(false);
const isEditing = ref(false);
const editForm = ref({
  id: "",
  labelKey: "",
  icon: "",
  color: "",
  sortOrder: 0,
  showOnHome: false,
});

// 删除确认
const showDeleteConfirm = ref(false);
const deleteTarget = ref<string>("");

function openCreateModal() {
  isEditing.value = false;
  editForm.value = {
    id: "",
    labelKey: "",
    icon: "i-lucide-folder",
    color: "text-slate-600",
    sortOrder: (sections.value?.length ?? 0) + 1,
    showOnHome: false,
  };
  showModal.value = true;
}

function openEditModal(section: Section) {
  isEditing.value = true;
  editForm.value = {
    id: section.id,
    labelKey: section.labelKey,
    icon: section.icon,
    color: section.color,
    sortOrder: section.sortOrder,
    showOnHome: section.showOnHome,
  };
  showModal.value = true;
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
      toast.add({ title: "模块更新成功", color: "success" });
    } else {
      await $fetch("/api/sections", {
        method: "POST",
        body: editForm.value,
      });
      toast.add({ title: "模块创建成功", color: "success" });
    }
    showModal.value = false;
    refresh();
  } catch (err: any) {
    toast.add({
      title: "操作失败",
      description: err?.data?.statusMessage || "未知错误",
      color: "error",
    });
  } finally {
    isSaving.value = false;
  }
}

function confirmDelete(id: string) {
  deleteTarget.value = id;
  showDeleteConfirm.value = true;
}

async function handleDelete() {
  try {
    await $fetch(`/api/sections/${deleteTarget.value}`, { method: "DELETE" });
    toast.add({ title: "模块已删除", color: "success" });
    showDeleteConfirm.value = false;
    refresh();
  } catch (err: any) {
    toast.add({
      title: "删除失败",
      description: err?.data?.statusMessage || "未知错误",
      color: "error",
    });
  }
}

async function toggleHomeDisplay(section: Section) {
  try {
    await $fetch(`/api/sections/${section.id}`, {
      method: "PUT",
      body: { showOnHome: !section.showOnHome },
    });
    refresh();
  } catch {
    toast.add({ title: "操作失败", color: "error" });
  }
}

async function toggleActive(section: Section) {
  try {
    await $fetch(`/api/sections/${section.id}`, {
      method: "PUT",
      body: { isActive: !section.isActive },
    });
    refresh();
  } catch {
    toast.add({ title: "操作失败", color: "error" });
  }
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
  { label: "蓝色", value: "text-blue-600" },
  { label: "红色", value: "text-red-600" },
  { label: "绿色", value: "text-green-600" },
  { label: "琥珀", value: "text-amber-600" },
  { label: "紫色", value: "text-purple-600" },
  { label: "靛蓝", value: "text-indigo-600" },
  { label: "青色", value: "text-cyan-600" },
  { label: "灰色", value: "text-slate-600" },
  { label: "粉色", value: "text-pink-600" },
  { label: "橙色", value: "text-orange-600" },
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
            to="/admin"
            class="text-slate-500 hover:text-green-600 flex items-center gap-1"
          >
            <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
            返回
          </NuxtLink>
          <h1 class="text-lg font-bold text-slate-900">模块管理</h1>
        </div>
        <UButton icon="i-lucide-plus" color="primary" @click="openCreateModal">
          新增模块
        </UButton>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 模块列表 -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900">
              全部模块 ({{ sections?.length ?? 0 }})
            </h2>
            <p class="text-sm text-slate-500">
              拖拽排序 · 开关首页展示 · 编辑删除
            </p>
          </div>
        </template>

        <div
          v-if="status === 'pending'"
          class="text-center py-12 text-slate-400"
        >
          加载中...
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
              :class="[section.isActive ? 'bg-green-50' : 'bg-slate-100']"
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
                  {{ section.labelKey }}
                </h3>
                <span class="text-xs text-slate-400 font-mono">{{
                  section.id
                }}</span>
                <span
                  v-if="!section.isActive"
                  class="px-1.5 py-0.5 text-xs rounded bg-slate-100 text-slate-500"
                >
                  已停用
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">
                排序: {{ section.sortOrder }} · 分类:
                {{ section.categories?.length ?? 0 }} 个
              </p>
            </div>

            <!-- 首页展示开关 -->
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-xs text-slate-500">首页展示</span>
              <button
                class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                :class="section.showOnHome ? 'bg-green-500' : 'bg-slate-300'"
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
              <span class="text-xs text-slate-500">启用</span>
              <button
                class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                :class="section.isActive ? 'bg-green-500' : 'bg-slate-300'"
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
                @click="openEditModal(section)"
              />
              <UButton
                variant="ghost"
                color="error"
                size="xs"
                icon="i-lucide-trash-2"
                @click="confirmDelete(section.id)"
              />
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12 text-slate-400">
          <UIcon
            name="i-lucide-inbox"
            class="w-12 h-12 mx-auto mb-3 text-slate-300"
          />
          <p>暂无模块，点击"新增模块"创建第一个</p>
        </div>
      </UCard>
    </div>

    <!-- 新增/编辑模态框 -->
    <UModal v-model:open="showModal">
      <template #default>
        <div class="p-6">
          <h3 class="text-lg font-bold text-slate-900 mb-4">
            {{ isEditing ? "编辑模块" : "新增模块" }}
          </h3>
          <div class="space-y-4">
            <!-- ID -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >模块 ID (slug)</label
              >
              <input
                v-model="editForm.id"
                type="text"
                :disabled="isEditing"
                placeholder="例如: global-economy"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-slate-100 disabled:text-slate-500"
              />
              <p class="text-xs text-slate-400 mt-1">
                用于 URL 路径，创建后不可修改
              </p>
            </div>

            <!-- Label Key -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >国际化标签键 (labelKey)</label
              >
              <input
                v-model="editForm.labelKey"
                type="text"
                placeholder="例如: nav.globalEconomy"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p class="text-xs text-slate-400 mt-1">对应 i18n 翻译键</p>
            </div>

            <!-- 图标 -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >图标</label
              >
              <div class="grid grid-cols-8 gap-2">
                <button
                  v-for="icon in iconOptions"
                  :key="icon"
                  class="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors"
                  :class="
                    editForm.icon === icon
                      ? 'border-green-500 bg-green-50'
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
                placeholder="或直接输入图标类名"
                class="w-full px-3 py-2 mt-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <!-- 颜色 -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >颜色</label
              >
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="color in colorOptions"
                  :key="color.value"
                  class="px-3 py-1 rounded-full text-xs border transition-colors"
                  :class="
                    editForm.color === color.value
                      ? 'border-green-500 bg-green-50 font-semibold'
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
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >排序</label
              >
              <input
                v-model.number="editForm.sortOrder"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <!-- 首页展示 -->
            <div class="flex items-center gap-3">
              <input
                v-model="editForm.showOnHome"
                type="checkbox"
                class="w-4 h-4 rounded text-green-500 focus:ring-green-500"
              />
              <label class="text-sm text-slate-700">在首页展示此模块</label>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <UButton
              variant="outline"
              color="neutral"
              @click="showModal = false"
            >
              取消
            </UButton>
            <UButton color="primary" :loading="isSaving" @click="handleSave">
              {{ isEditing ? "保存" : "创建" }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- 删除确认 -->
    <UModal v-model:open="showDeleteConfirm">
      <template #default>
        <div class="p-6">
          <h3 class="text-lg font-bold text-slate-900 mb-2">确认删除</h3>
          <p class="text-sm text-slate-600 mb-4">
            确定要删除模块
            <strong>{{ deleteTarget }}</strong> 吗？此操作不可撤销。
          </p>
          <div class="flex justify-end gap-3">
            <UButton
              variant="outline"
              color="neutral"
              @click="showDeleteConfirm = false"
            >
              取消
            </UButton>
            <UButton color="error" @click="handleDelete"> 确认删除 </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
