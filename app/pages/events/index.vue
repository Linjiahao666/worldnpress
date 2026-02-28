<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({ title: () => `${t("nav.events")} - ${t("site.title")}` });

const upcomingEvents = [
  {
    id: 1,
    titleKey: "events.page.upcoming.items.esgSummit.title",
    date: "2026-04-15",
    locationKey: "events.page.upcoming.items.esgSummit.location",
    typeKey: "events.page.upcoming.items.esgSummit.type",
    statusKey: "events.page.status.open",
    descKey: "events.page.upcoming.items.esgSummit.desc",
    icon: "i-lucide-mountain",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: 2,
    titleKey: "events.page.upcoming.items.gbaForum.title",
    date: "2026-05-20",
    locationKey: "events.page.upcoming.items.gbaForum.location",
    typeKey: "events.page.upcoming.items.gbaForum.type",
    statusKey: "events.page.status.soon",
    descKey: "events.page.upcoming.items.gbaForum.desc",
    icon: "i-lucide-globe",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: 3,
    titleKey: "events.page.upcoming.items.greenRoadshow.title",
    date: "2026-06-10",
    locationKey: "events.page.upcoming.items.greenRoadshow.location",
    typeKey: "events.page.upcoming.items.greenRoadshow.type",
    statusKey: "events.page.status.preparing",
    descKey: "events.page.upcoming.items.greenRoadshow.desc",
    icon: "i-lucide-presentation",
    color: "bg-teal-50 text-teal-700 border-teal-200",
  },
  {
    id: 4,
    titleKey: "events.page.upcoming.items.aiSeminar.title",
    date: "2026-07-08",
    locationKey: "events.page.upcoming.items.aiSeminar.location",
    typeKey: "events.page.upcoming.items.aiSeminar.type",
    statusKey: "events.page.status.preparing",
    descKey: "events.page.upcoming.items.aiSeminar.desc",
    icon: "i-lucide-cloud",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
];

const pastEvents = [
  {
    id: 101,
    titleKey: "events.page.past.items.esgRating.title",
    date: "2025-12-15",
    locationKey: "events.page.past.items.esgRating.location",
  },
  {
    id: 102,
    titleKey: "events.page.past.items.carbonExpo.title",
    date: "2025-11-08",
    locationKey: "events.page.past.items.carbonExpo.location",
  },
  {
    id: 103,
    titleKey: "events.page.past.items.economyTalk.title",
    date: "2025-10-20",
    locationKey: "events.page.past.items.economyTalk.location",
  },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
    2,
    "0",
  )}.${String(d.getDate()).padStart(2, "0")}`;
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
        <h1 class="text-3xl sm:text-4xl font-bold mb-3">
          {{ t("events.page.hero.title") }}
        </h1>
        <p class="text-lg text-indigo-200 max-w-2xl">
          {{ t("events.page.hero.subtitle") }}
        </p>
      </div>
    </section>

    <!-- 近期活动 -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 class="text-2xl font-bold text-slate-800 mb-6">
        {{ t("events.page.upcoming.title") }}
      </h2>
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
                    {{ t(event.typeKey) }}
                  </span>
                  <span
                    class="text-xs px-2 py-0.5 rounded-full font-medium"
                    :class="
                      event.statusKey === 'events.page.status.open'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-slate-100 text-slate-500'
                    "
                  >
                    {{ t(event.statusKey) }}
                  </span>
                </div>
                <h3
                  class="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors"
                >
                  {{ t(event.titleKey) }}
                </h3>
                <p class="text-sm text-slate-500 mb-3 line-clamp-2">
                  {{ t(event.descKey) }}
                </p>
                <div class="flex items-center gap-4 text-sm text-slate-400">
                  <span class="flex items-center gap-1">
                    <UIcon name="i-lucide-calendar" class="w-4 h-4" />
                    {{ formatDate(event.date) }}
                  </span>
                  <span class="flex items-center gap-1">
                    <UIcon name="i-lucide-map-pin" class="w-4 h-4" />
                    {{ t(event.locationKey) }}
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
        <h2 class="text-xl font-bold text-slate-800 mb-5">
          {{ t("events.page.past.title") }}
        </h2>
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
                t(event.titleKey)
              }}</span>
            </div>
            <div class="flex items-center gap-4 text-sm text-slate-400">
              <span>{{ formatDate(event.date) }}</span>
              <span>{{ t(event.locationKey) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
