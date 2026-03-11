<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({ title: () => `${t("reporters.title")} - ${t("site.title")}` });

const { reporters } = useReporters({ activeOnly: true });
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- 页面标题 -->
    <div class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 class="text-3xl font-bold text-slate-900">
          {{ t("reporters.title") }}
        </h1>
        <p class="mt-2 text-slate-500">
          {{ t("reporters.description") }}
        </p>
      </div>
    </div>

    <!-- 表格内容 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div
        class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-green-600 text-white">
                <th class="px-6 py-4 text-sm font-semibold whitespace-nowrap">
                  {{ t("reporters.table.index") }}
                </th>
                <th class="px-6 py-4 text-sm font-semibold whitespace-nowrap">
                  {{ t("reporters.table.name") }}
                </th>
                <th class="px-6 py-4 text-sm font-semibold whitespace-nowrap">
                  {{ t("reporters.table.department") }}
                </th>
                <th class="px-6 py-4 text-sm font-semibold whitespace-nowrap">
                  {{ t("reporters.table.position") }}
                </th>
                <th class="px-6 py-4 text-sm font-semibold whitespace-nowrap">
                  {{ t("reporters.table.contact") }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="reporter in reporters"
                :key="reporter.id"
                class="hover:bg-slate-50 transition-colors"
              >
                <td class="px-6 py-4 text-sm text-slate-500 text-center">
                  {{ reporter.id }}
                </td>
                <td class="px-6 py-4 text-sm font-medium text-slate-900">
                  {{ reporter.name }}
                </td>
                <td class="px-6 py-4 text-sm text-slate-600">
                  {{ reporter.department }}
                </td>
                <td class="px-6 py-4 text-sm text-slate-600">
                  {{ reporter.position }}
                </td>
                <td class="px-6 py-4 text-sm text-slate-600">
                  <a
                    :href="`mailto:${reporter.contact}`"
                    class="text-green-600 hover:text-green-700 hover:underline transition-colors"
                  >
                    {{ reporter.contact }}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 说明信息 -->
      <div class="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div class="flex items-start gap-3">
          <UIcon
            name="i-lucide-info"
            class="w-5 h-5 text-amber-600 mt-0.5 shrink-0"
          />
          <p class="text-sm text-amber-800">
            {{ t("reporters.notice") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
