<script setup lang="ts">
import type { Reporter } from "~/types";

definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

useHead({ title: "记者管理 - WorldnPress" });

const toast = useToast();

// 数据加载
const {
  data: reporters,
  status,
  refresh,
} = useFetch<Reporter[]>("/api/admin/reporters");

// 编辑/新增对话框
const showForm = ref(false);
const editTarget = ref<Reporter | null>(null);
const saving = ref(false);

const form = reactive({
  name: "",
  department: "",
  position: "",
  contact: "",
  sortOrder: 0,
  isActive: true,
});

function resetForm() {
  form.name = "";
  form.department = "";
  form.position = "";
  form.contact = "";
  form.sortOrder = 0;
  form.isActive = true;
}

function openCreate() {
  editTarget.value = null;
  resetForm();
  showForm.value = true;
}

function openEdit(reporter: Reporter) {
  editTarget.value = reporter;
  form.name = reporter.name;
  form.department = reporter.department;
  form.position = reporter.position;
  form.contact = reporter.contact;
  form.sortOrder = reporter.sortOrder;
  form.isActive = reporter.isActive;
  showForm.value = true;
}

async function handleSave() {
  if (!form.name || !form.department || !form.position || !form.contact) {
    toast.add({ title: "请填写所有必填字段", color: "warning" });
    return;
  }

  saving.value = true;
  try {
    if (editTarget.value) {
      await $fetch(`/api/admin/reporters/${editTarget.value.id}`, {
        method: "PUT",
        body: { ...form },
      });
      toast.add({ title: "记者信息已更新", color: "success" });
    } else {
      await $fetch("/api/admin/reporters", {
        method: "POST",
        body: { ...form },
      });
      toast.add({ title: "记者已添加", color: "success" });
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
const deleteTarget = ref<Reporter | null>(null);
const deleting = ref(false);

function confirmDelete(reporter: Reporter) {
  deleteTarget.value = reporter;
  showDeleteDialog.value = true;
}

async function handleDelete() {
  if (!deleteTarget.value) return;
  deleting.value = true;
  try {
    await $fetch(`/api/admin/reporters/${deleteTarget.value.id}`, {
      method: "DELETE",
    });
    toast.add({ title: "记者已删除", color: "success" });
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
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 页面标题 -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">记者管理</h1>
          <p class="mt-1 text-sm text-slate-500">管理网站记者信息</p>
        </div>
        <UButton icon="i-lucide-plus" color="primary" @click="openCreate">
          添加记者
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

        <div v-else-if="reporters?.length">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-slate-200">
                  <th class="text-left py-3 px-4 font-medium text-slate-500">
                    ID
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-slate-500">
                    姓名
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-slate-500">
                    部门
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-slate-500">
                    职位
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-slate-500">
                    联系方式
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
                  v-for="reporter in reporters"
                  :key="reporter.id"
                  class="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td class="py-3 px-4 text-slate-500">{{ reporter.id }}</td>
                  <td class="py-3 px-4 font-medium text-slate-900">
                    {{ reporter.name }}
                  </td>
                  <td class="py-3 px-4 text-slate-600">
                    {{ reporter.department }}
                  </td>
                  <td class="py-3 px-4 text-slate-600">
                    {{ reporter.position }}
                  </td>
                  <td class="py-3 px-4 text-slate-600">
                    {{ reporter.contact }}
                  </td>
                  <td class="py-3 px-4 text-slate-500">
                    {{ reporter.sortOrder }}
                  </td>
                  <td class="py-3 px-4">
                    <UBadge
                      :color="reporter.isActive ? 'success' : 'neutral'"
                      variant="subtle"
                    >
                      {{ reporter.isActive ? "启用" : "停用" }}
                    </UBadge>
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex gap-2">
                      <UButton
                        icon="i-lucide-pencil"
                        size="xs"
                        color="neutral"
                        variant="ghost"
                        @click="openEdit(reporter)"
                      />
                      <UButton
                        icon="i-lucide-trash-2"
                        size="xs"
                        color="error"
                        variant="ghost"
                        @click="confirmDelete(reporter)"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else class="text-center py-12 text-slate-500">
          暂无记者数据，点击"添加记者"开始
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
        <div class="bg-white rounded-xl overflow-hidden">
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-slate-200"
          >
            <h3 class="text-lg font-bold text-slate-900">
              {{ editTarget ? "编辑记者" : "添加记者" }}
            </h3>
            <button
              class="p-1 rounded-lg hover:bg-slate-200 transition-colors"
              @click="showForm = false"
            >
              <UIcon name="i-lucide-x" class="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >姓名 *</label
              >
              <UInput v-model="form.name" placeholder="请输入姓名" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >部门 *</label
              >
              <UInput v-model="form.department" placeholder="如：新闻采编部" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >职位 *</label
              >
              <UInput v-model="form.position" placeholder="如：首席记者" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1"
                >联系方式 *</label
              >
              <UInput
                v-model="form.contact"
                placeholder="如：name@worldnpress.com"
              />
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
            class="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50"
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
              <h3 class="text-lg font-bold text-slate-900">确认删除记者</h3>
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
              确定要删除记者
              <strong class="text-slate-900">{{ deleteTarget?.name }}</strong>
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
