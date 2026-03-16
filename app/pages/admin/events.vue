<script setup lang="ts">
import type { EventItem } from "~/types";

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

useHead({ title: "活动管理 - WorldnPress" });

const toast = useToast();

// 数据加载
const {
  data: events,
  status,
  refresh,
} = useFetch<EventItem[]>("/api/admin/events");

// 编辑/新增对话框
const showForm = ref(false);
const editTarget = ref<EventItem | null>(null);
const saving = ref(false);

const categoryOptions = [
  { label: "近期活动", value: "upcoming" },
  { label: "往期活动", value: "past" },
];

const colorOptions = [
  {
    label: "绿色",
    value: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  { label: "蓝色", value: "bg-blue-50 text-blue-700 border-blue-200" },
  { label: "紫色", value: "bg-purple-50 text-purple-700 border-purple-200" },
  { label: "橙色", value: "bg-amber-50 text-amber-700 border-amber-200" },
  { label: "红色", value: "bg-red-50 text-red-700 border-red-200" },
  { label: "靛蓝", value: "bg-indigo-50 text-indigo-700 border-indigo-200" },
];

const form = reactive({
  titleKey: "",
  date: "",
  locationKey: "",
  typeKey: "",
  statusKey: "",
  descKey: "",
  icon: "",
  color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  category: "upcoming" as "upcoming" | "past",
  sortOrder: 0,
  isActive: true,
});

function resetForm() {
  form.titleKey = "";
  form.date = "";
  form.locationKey = "";
  form.typeKey = "";
  form.statusKey = "";
  form.descKey = "";
  form.icon = "";
  form.color = "bg-emerald-50 text-emerald-700 border-emerald-200";
  form.category = "upcoming";
  form.sortOrder = 0;
  form.isActive = true;
}

function openCreate() {
  editTarget.value = null;
  resetForm();
  showForm.value = true;
}

function openEdit(item: EventItem) {
  editTarget.value = item;
  form.titleKey = item.titleKey;
  form.date = item.date;
  form.locationKey = item.locationKey;
  form.typeKey = item.typeKey;
  form.statusKey = item.statusKey;
  form.descKey = item.descKey;
  form.icon = item.icon;
  form.color = item.color;
  form.category = item.category;
  form.sortOrder = item.sortOrder;
  form.isActive = item.isActive;
  showForm.value = true;
}

async function handleSave() {
  if (!form.titleKey || !form.date || !form.locationKey) {
    toast.add({ title: "请填写标题、日期、地点", color: "warning" });
    return;
  }

  saving.value = true;
  try {
    if (editTarget.value) {
      await $fetch(`/api/admin/events/${editTarget.value.id}`, {
        method: "PUT",
        body: { ...form },
      });
      toast.add({ title: "活动已更新", color: "success" });
    } else {
      await $fetch("/api/admin/events", {
        method: "POST",
        body: { ...form },
      });
      toast.add({ title: "活动已添加", color: "success" });
    }
    showForm.value = false;
    await refresh();
  } catch (error: any) {
    toast.add({
      title: "操作失败",
      description: error?.data?.statusMessage,
      color: "error",
    });
  } finally {
    saving.value = false;
  }
}

// 删除
const showDeleteDialog = ref(false);
const deleteTarget = ref<EventItem | null>(null);
const deleting = ref(false);

function confirmDelete(item: EventItem) {
  deleteTarget.value = item;
  showDeleteDialog.value = true;
}

async function handleDelete() {
  if (!deleteTarget.value) return;
  deleting.value = true;
  try {
    await $fetch(`/api/admin/events/${deleteTarget.value.id}`, {
      method: "DELETE",
    });
    toast.add({ title: "活动已删除", color: "success" });
    showDeleteDialog.value = false;
    await refresh();
  } catch (error: any) {
    toast.add({
      title: "删除失败",
      description: error?.data?.statusMessage,
      color: "error",
    });
  } finally {
    deleting.value = false;
  }
}

function getCategoryLabel(cat: string) {
  return cat === "upcoming" ? "近期" : "往期";
}

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(d.getDate()).padStart(2, "0")}`;
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页面标题 -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">活动管理</h1>
          <p class="mt-1 text-sm text-slate-500">管理网站活动信息</p>
        </div>
        <UButton icon="i-lucide-plus" color="primary" @click="openCreate">
          添加活动
        </UButton>
      </div>

      <!-- 表格 -->
      <UCard>
        <div v-if="status === 'pending'" class="flex justify-center py-12">
          <UIcon
            name="i-lucide-loader-2"
            class="text-3xl text-green-500 animate-spin"
          />
        </div>

        <div v-else-if="events?.length">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-slate-200">
                  <th class="text-left py-3 px-4 font-medium text-slate-500">
                    ID
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-slate-500">
                    标题 Key
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-slate-500">
                    日期
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-slate-500">
                    分类
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-slate-500">
                    图标
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-slate-500">
                    排序
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-slate-500">
                    状态
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-slate-500">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in events"
                  :key="item.id"
                  class="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td class="py-3 px-4 text-slate-500">{{ item.id }}</td>
                  <td
                    class="py-3 px-4 font-medium text-slate-900 max-w-50 truncate"
                  >
                    {{ item.titleKey }}
                  </td>
                  <td class="py-3 px-4 text-slate-600">
                    {{ formatDate(item.date) }}
                  </td>
                  <td class="py-3 px-4">
                    <UBadge
                      :color="
                        item.category === 'upcoming' ? 'primary' : 'neutral'
                      "
                      variant="subtle"
                    >
                      {{ getCategoryLabel(item.category) }}
                    </UBadge>
                  </td>
                  <td class="py-3 px-4 text-slate-600">
                    <UIcon v-if="item.icon" :name="item.icon" class="w-5 h-5" />
                    <span v-else class="text-slate-400">-</span>
                  </td>
                  <td class="py-3 px-4 text-slate-500">
                    {{ item.sortOrder }}
                  </td>
                  <td class="py-3 px-4">
                    <UBadge
                      :color="item.isActive ? 'success' : 'neutral'"
                      variant="subtle"
                    >
                      {{ item.isActive ? "启用" : "停用" }}
                    </UBadge>
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex gap-2">
                      <UButton
                        icon="i-lucide-pencil"
                        size="xs"
                        color="neutral"
                        variant="ghost"
                        @click="openEdit(item)"
                      />
                      <UButton
                        icon="i-lucide-trash-2"
                        size="xs"
                        color="error"
                        variant="ghost"
                        @click="confirmDelete(item)"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else class="text-center py-12 text-slate-500">
          暂无活动数据，点击"添加活动"开始
        </div>
      </UCard>

      <!-- 返回 -->
      <div class="mt-6">
        <UButton
          to="/admin"
          icon="i-lucide-arrow-left"
          color="neutral"
          variant="ghost"
        >
          返回后台首页
        </UButton>
      </div>
    </div>

    <!-- 新增/编辑对话框 -->
    <UModal v-model:open="showForm">
      <template #content>
        <div
          class="bg-white rounded-xl overflow-hidden max-h-[85vh] flex flex-col"
        >
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0"
          >
            <h3 class="text-lg font-bold text-slate-900">
              {{ editTarget ? "编辑活动" : "添加活动" }}
            </h3>
            <button
              class="p-1 rounded-lg hover:bg-slate-200 transition-colors"
              @click="showForm = false"
            >
              <UIcon name="i-lucide-x" class="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <div class="p-6 space-y-4 overflow-y-auto">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >标题 Key *</label
              >
              <UInput
                v-model="form.titleKey"
                placeholder="如：events.page.upcoming.items.xxx.title"
              />
              <p class="text-xs text-slate-400 mt-1">
                i18n 翻译键，对应多语言文件中的路径
              </p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1"
                  >日期 *</label
                >
                <UInput v-model="form.date" type="date" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1"
                  >分类 *</label
                >
                <select
                  v-model="form.category"
                  class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option
                    v-for="opt in categoryOptions"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >地点 Key *</label
              >
              <UInput
                v-model="form.locationKey"
                placeholder="如：events.page.upcoming.items.xxx.location"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1"
                  >类型 Key</label
                >
                <UInput
                  v-model="form.typeKey"
                  placeholder="如：events.page.upcoming.items.xxx.type"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1"
                  >状态 Key</label
                >
                <UInput
                  v-model="form.statusKey"
                  placeholder="如：events.page.status.open"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >描述 Key</label
              >
              <UInput
                v-model="form.descKey"
                placeholder="如：events.page.upcoming.items.xxx.desc"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1"
                  >图标</label
                >
                <UInput
                  v-model="form.icon"
                  placeholder="如：i-lucide-mountain"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1"
                  >配色</label
                >
                <select
                  v-model="form.color"
                  class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option
                    v-for="opt in colorOptions"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1"
                  >排序</label
                >
                <UInput v-model.number="form.sortOrder" type="number" />
              </div>
              <div class="flex items-end">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="form.isActive"
                    type="checkbox"
                    class="rounded border-slate-300 text-green-600 focus:ring-green-500"
                  />
                  <span class="text-sm text-slate-700">启用</span>
                </label>
              </div>
            </div>
          </div>
          <div
            class="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 shrink-0"
          >
            <UButton
              color="neutral"
              variant="outline"
              @click="showForm = false"
            >
              取消
            </UButton>
            <UButton color="primary" :loading="saving" @click="handleSave">
              {{ editTarget ? "保存修改" : "确认添加" }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- 删除确认 -->
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
              <h3 class="text-lg font-bold text-slate-900">确认删除活动</h3>
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
              确定要删除活动
              <strong class="text-slate-900">{{
                deleteTarget?.titleKey
              }}</strong>
              吗？此操作不可撤销。
            </p>
          </div>
          <div
            class="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50"
          >
            <UButton
              color="neutral"
              variant="outline"
              @click="showDeleteDialog = false"
            >
              取消
            </UButton>
            <UButton color="error" :loading="deleting" @click="handleDelete">
              确认删除
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
