<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["admin-auth"],
});

useHead({
  title: "备份管理 - WorldnPress",
});

const router = useRouter();
const isLoggingOut = ref(false);
const isCreating = ref(false);
const isRestoring = ref(false);
const restoringFile = ref("");

interface BackupItem {
  fileName: string;
  size: number;
  sizeFormatted: string;
  createdAt: string;
}

const backups = ref<BackupItem[]>([]);
const loading = ref(true);

async function fetchBackups() {
  loading.value = true;
  try {
    const data = await $fetch<{ backups: BackupItem[] }>("/api/backup/list");
    backups.value = data.backups;
  } catch {
    backups.value = [];
  } finally {
    loading.value = false;
  }
}

async function createBackup() {
  isCreating.value = true;
  try {
    await $fetch("/api/backup/create", { method: "POST" });
    await fetchBackups();
  } catch (err: any) {
    console.error("备份创建失败:", err);
  } finally {
    isCreating.value = false;
  }
}

async function restoreBackup(fileName: string) {
  const confirmed = window.confirm(
    "恢复操作将覆盖当前数据库，系统会自动备份当前数据。确定要继续吗？",
  );
  if (!confirmed) return;

  isRestoring.value = true;
  restoringFile.value = fileName;
  try {
    await $fetch("/api/backup/restore", {
      method: "POST",
      body: { fileName },
    });
    await fetchBackups();
  } catch (err: any) {
    console.error("恢复失败:", err);
  } finally {
    isRestoring.value = false;
    restoringFile.value = "";
  }
}

function downloadBackup(fileName: string) {
  const link = document.createElement("a");
  link.href = `/api/backup/download?file=${encodeURIComponent(fileName)}`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function deleteBackup(fileName: string) {
  const confirmed = window.confirm("确认删除这个备份文件吗？此操作不可撤销。");
  if (!confirmed) return;

  try {
    await $fetch("/api/backup/delete", {
      method: "POST",
      body: { fileName },
    });
    await fetchBackups();
  } catch (err: any) {
    console.error("删除失败:", err);
  }
}

async function handleLogout() {
  isLoggingOut.value = true;
  try {
    await $fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  } catch {
    router.push("/admin/login");
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

onMounted(() => {
  fetchBackups();
});
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
            to="/admin"
            class="text-sm text-slate-500 hover:text-green-600 flex items-center gap-1"
          >
            <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
            返回仪表板
          </NuxtLink>
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
      <!-- 页面标题 -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center"
          >
            <UIcon
              name="i-lucide-database-backup"
              class="w-6 h-6 text-amber-600"
            />
          </div>
          备份管理
        </h2>
        <p class="mt-2 text-slate-500">管理数据库备份与恢复，确保数据安全</p>
      </div>

      <!-- 创建备份 -->
      <UCard class="mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"
            >
              <UIcon
                name="i-lucide-hard-drive-upload"
                class="w-5 h-5 text-green-600"
              />
            </div>
            <div>
              <h3 class="font-semibold text-slate-900">创建新备份</h3>
              <p class="text-sm text-slate-500">
                立即创建数据库快照，保存当前所有数据
              </p>
            </div>
          </div>
          <UButton
            color="primary"
            icon="i-lucide-plus"
            :loading="isCreating"
            @click="createBackup"
          >
            {{ isCreating ? "正在创建备份..." : "创建备份" }}
          </UButton>
        </div>
      </UCard>

      <!-- 备份列表 -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-lg font-semibold text-slate-900 flex items-center gap-2"
            >
              <UIcon name="i-lucide-list" class="w-5 h-5" />
              备份列表
            </h3>
            <UButton
              variant="ghost"
              color="neutral"
              icon="i-lucide-refresh-cw"
              size="sm"
              @click="fetchBackups"
            >
              刷新
            </UButton>
          </div>
        </template>

        <!-- 加载中 -->
        <div v-if="loading" class="py-12 text-center">
          <UIcon
            name="i-lucide-loader-2"
            class="w-8 h-8 text-slate-400 animate-spin mx-auto mb-3"
          />
          <p class="text-slate-500">加载备份列表...</p>
        </div>

        <!-- 空状态 -->
        <div v-else-if="backups.length === 0" class="py-12 text-center">
          <UIcon
            name="i-lucide-database"
            class="w-12 h-12 text-slate-300 mx-auto mb-3"
          />
          <p class="text-slate-500 font-medium">暂无备份文件</p>
          <p class="text-sm text-slate-400 mt-1">点击上方按钮创建第一个备份</p>
        </div>

        <!-- 备份列表 -->
        <div v-else class="divide-y divide-slate-100">
          <div
            v-for="backup in backups"
            :key="backup.fileName"
            class="py-4 first:pt-0 last:pb-0"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 min-w-0">
                <div
                  class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0"
                >
                  <UIcon
                    name="i-lucide-file-archive"
                    class="w-5 h-5 text-slate-500"
                  />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-slate-900 truncate">
                    {{ backup.fileName }}
                  </p>
                  <div
                    class="flex items-center gap-3 text-xs text-slate-400 mt-1"
                  >
                    <span class="flex items-center gap-1">
                      <UIcon name="i-lucide-hard-drive" class="w-3 h-3" />
                      {{ backup.sizeFormatted }}
                    </span>
                    <span class="flex items-center gap-1">
                      <UIcon name="i-lucide-clock" class="w-3 h-3" />
                      {{ formatDate(backup.createdAt) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0 ml-4">
                <UButton
                  variant="soft"
                  color="primary"
                  size="xs"
                  icon="i-lucide-download"
                  @click="downloadBackup(backup.fileName)"
                >
                  下载
                </UButton>
                <UButton
                  variant="soft"
                  color="warning"
                  size="xs"
                  icon="i-lucide-rotate-ccw"
                  :loading="isRestoring && restoringFile === backup.fileName"
                  @click="restoreBackup(backup.fileName)"
                >
                  恢复
                </UButton>
                <UButton
                  variant="soft"
                  color="error"
                  size="xs"
                  icon="i-lucide-trash-2"
                  @click="deleteBackup(backup.fileName)"
                >
                  删除
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- 说明 -->
      <div class="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div class="flex items-start gap-3">
          <UIcon
            name="i-lucide-info"
            class="w-5 h-5 text-amber-600 shrink-0 mt-0.5"
          />
          <div class="text-sm text-amber-800">
            <p class="font-medium mb-1">备份说明</p>
            <ul class="list-disc list-inside space-y-1 text-amber-700">
              <li>
                备份文件包含完整的数据库内容（文章、分类、作者等所有数据）
              </li>
              <li>
                恢复操作会覆盖当前数据库，系统会在恢复前自动创建一份安全备份
              </li>
              <li>建议定期创建备份，并将重要备份下载到本地保存</li>
              <li>备份文件存储在服务器 data/backups/ 目录下</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
