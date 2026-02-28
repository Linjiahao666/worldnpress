<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({ title: () => `${t("nav.events")} - ${t("site.title")}` });

const upcomingEvents = [
  {
    id: 1,
    title: "2026 全球ESG峰会",
    date: "2026-04-15",
    location: "深圳·国际会展中心",
    type: "峰会论坛",
    status: "报名中",
    desc: "聚集全球ESG领域专家学者，探讨最新ESG发展趋势与实践案例。",
    icon: "i-lucide-mountain",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: 2,
    title: "粤港澳大湾区经济论坛",
    date: "2026-05-20",
    location: "香港·会展中心",
    type: "国际论坛",
    status: "即将开放",
    desc: "大湾区经济协同发展、跨境金融创新与产业合作深度探讨。",
    icon: "i-lucide-globe",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: 3,
    title: "绿色金融投资路演",
    date: "2026-06-10",
    location: "北京·金融街",
    type: "路演活动",
    status: "筹备中",
    desc: "绿色债券、碳金融产品等绿色金融领域精选项目投资对接。",
    icon: "i-lucide-presentation",
    color: "bg-teal-50 text-teal-700 border-teal-200",
  },
  {
    id: 4,
    title: "AI赋能财经媒体研讨会",
    date: "2026-07-08",
    location: "线上直播",
    type: "线上会议",
    status: "筹备中",
    desc: "探讨人工智能在财经新闻生产、舆情分析与数据可视化的应用。",
    icon: "i-lucide-cloud",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
];

const pastEvents = [
  {
    id: 101,
    title: "2025 年度ESG评级发布会",
    date: "2025-12-15",
    location: "广州",
  },
  {
    id: 102,
    title: "碳中和产业博览会",
    date: "2025-11-08",
    location: "上海",
  },
  {
    id: 103,
    title: "国际经济形势座谈会",
    date: "2025-10-20",
    location: "北京",
  },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-linear-to-r from-indigo-900 to-purple-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <CommonBreadcrumb
          :items="[
            { label: t('nav.home'), to: localePath('/') },
            { label: t('nav.events') },
          ]"
          class="mb-6 opacity-70"
        />
        <h1 class="text-3xl sm:text-4xl font-bold mb-3">会展与活动中心</h1>
        <p class="text-lg text-indigo-200 max-w-2xl">
          汇聚全球经济论坛、ESG峰会、投资路演、行业博览等高端财经活动资讯
        </p>
      </div>
    </section>

    <!-- 近期活动 -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 class="text-2xl font-bold text-slate-800 mb-6">近期活动</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="event in upcomingEvents"
          :key="event.id"
          class="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
        >
          <div class="p-6">
            <div class="flex items-start gap-4">
              <div
                class="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                :class="event.color"
              >
                <UIcon :name="event.icon" class="w-7 h-7" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span
                    class="text-xs px-2 py-0.5 rounded-full font-medium"
                    :class="event.color"
                  >
                    {{ event.type }}
                  </span>
                  <span
                    class="text-xs px-2 py-0.5 rounded-full font-medium"
                    :class="
                      event.status === '报名中'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-slate-100 text-slate-500'
                    "
                  >
                    {{ event.status }}
                  </span>
                </div>
                <h3
                  class="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors"
                >
                  {{ event.title }}
                </h3>
                <p class="text-sm text-slate-500 mb-3 line-clamp-2">
                  {{ event.desc }}
                </p>
                <div class="flex items-center gap-4 text-sm text-slate-400">
                  <span class="flex items-center gap-1">
                    <UIcon name="i-lucide-calendar" class="w-4 h-4" />
                    {{ formatDate(event.date) }}
                  </span>
                  <span class="flex items-center gap-1">
                    <UIcon name="i-lucide-map-pin" class="w-4 h-4" />
                    {{ event.location }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 往期活动 -->
    <section class="bg-slate-50 border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 class="text-xl font-bold text-slate-800 mb-5">往期活动回顾</h2>
        <div class="space-y-3">
          <div
            v-for="event in pastEvents"
            :key="event.id"
            class="flex items-center justify-between bg-white rounded-lg border border-slate-200 px-5 py-3 hover:border-blue-200 transition-colors"
          >
            <div class="flex items-center gap-3">
              <UIcon
                name="i-lucide-calendar-check"
                class="w-5 h-5 text-slate-400"
              />
              <span class="font-medium text-slate-700">{{
                event.title
              }}</span>
            </div>
            <div class="flex items-center gap-4 text-sm text-slate-400">
              <span>{{ formatDate(event.date) }}</span>
              <span>{{ event.location }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
