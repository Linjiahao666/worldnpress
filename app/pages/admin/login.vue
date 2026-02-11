<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

const router = useRouter();

const form = reactive({
  username: "",
  password: "",
});

const isLoading = ref(false);
const errorMessage = ref("");

async function handleLogin() {
  errorMessage.value = "";
  isLoading.value = true;

  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        username: form.username,
        password: form.password,
      },
    });
    router.push("/admin");
  } catch (err: any) {
    errorMessage.value = err?.data?.statusMessage || "登入失敗，請檢查賬號密碼";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <div class="w-full max-w-lg">
      <!-- Logo 区域 -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 mb-4"
        >
          <UIcon name="i-lucide-shield-check" class="w-8 h-8 text-green-600" />
        </div>
        <h1 class="text-2xl font-bold text-slate-900">WorldnPress 管理後台</h1>
        <p class="text-slate-500 mt-2">請輸入管理員賬號密碼登入</p>
      </div>

      <!-- 登录表单 -->
      <UCard class="w-full">
        <form class="space-y-5" @submit.prevent="handleLogin">
          <!-- 错误提示 -->
          <div
            v-if="errorMessage"
            class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
          >
            <UIcon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0" />
            <span>{{ errorMessage }}</span>
          </div>

          <!-- 用户名 -->
          <div class="w-full">
            <label class="block text-sm font-medium text-slate-700 mb-1.5">
              賬號
            </label>
            <UInput
              v-model="form.username"
              placeholder="請輸入管理員賬號"
              icon="i-lucide-user"
              size="lg"
              required
              autocomplete="username"
              class="w-full"
              :ui="{ base: 'w-full' }"
            />
          </div>

          <!-- 密码 -->
          <div class="w-full">
            <label class="block text-sm font-medium text-slate-700 mb-1.5">
              密碼
            </label>
            <UInput
              v-model="form.password"
              type="password"
              placeholder="請輸入密碼"
              icon="i-lucide-lock"
              size="lg"
              required
              autocomplete="current-password"
              class="w-full"
              :ui="{ base: 'w-full' }"
            />
          </div>

          <!-- 登录按钮 -->
          <UButton
            type="submit"
            color="primary"
            size="lg"
            block
            :loading="isLoading"
            :disabled="isLoading"
          >
            <UIcon
              v-if="!isLoading"
              name="i-lucide-log-in"
              class="w-4 h-4 mr-1"
            />
            {{ isLoading ? "登入中..." : "登 入" }}
          </UButton>
        </form>
      </UCard>

      <!-- 底部提示 -->
      <p class="text-center text-xs text-slate-400 mt-6">
        © 2026 WorldnPress. 管理後台僅限授權人員使用。
      </p>
    </div>
  </div>
</template>
