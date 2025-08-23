<script setup>
import { useDashboardStore } from '@/stores/dashboard';
import { storeToRefs } from 'pinia';
import { computed, onMounted, watch } from 'vue';
import { Chart } from 'chart.js/auto';

import { ref } from 'vue'
import { format, addDays, startOfWeek, isToday, subWeeks, addWeeks, subDays } from 'date-fns'
import { id } from 'date-fns/locale'

const dashboardStore = useDashboardStore();
const { dashboardData, loading } = storeToRefs(dashboardStore);
const { fetchDashboardData } = dashboardStore;

let chartInstance = null;

const renderChart = () => {
  const chart = document.getElementById('myChart');

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(chart, {
    type: 'doughnut',
    data: {
      labels: ['Pria', 'Wanita', 'Anak-anak', 'Balita'],
      datasets: [
        {
          data: [
            dashboardData.value?.resident_statistics?.male || 0,
            dashboardData.value?.resident_statistics?.female || 0,
            dashboardData.value?.resident_statistics?.children || 0,
            dashboardData.value?.resident_statistics?.toddler || 0
          ],
          backgroundColor: ['#34613A', '#8EBD55', '#FA7139', '#FBAD48']
        }
      ]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
      datasets: {
        doughnut: {
          spacing: 2,
          borderRadius: 6,
          cutout: '69%'
        }
      }
    }
  });
};

watch(dashboardData, (newVal) => {
  if (newVal && newVal.resident_statistics) {
    renderChart();
  }
});

onMounted(async () => {
  await fetchDashboardData();
});

function getIcon(thumbnail) {
  const moneyIcon = new URL('@/assets/images/icons/money-dark-green.svg', import.meta.url).href;
  const bagIcon = new URL('@/assets/images/icons/bag-2-dark-green.svg', import.meta.url).href;

  if (!thumbnail) return moneyIcon;

  const c = thumbnail.toLowerCase();
  if (c.includes('uang') || c.includes('tunai')) return moneyIcon;
  if (c.includes('beras') || c.includes('pangan')) return bagIcon;

  return moneyIcon;
}


function formatAssistanceAmount(item) {
  if (item.amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(item.amount);
  }
  return item.social_assistance?.name ?? 'Bantuan';
}

function getStatusClass(status) {
  switch ((status || '').toLowerCase()) {
    case 'approved':
      return 'bg-desa-dark-green';
    case 'rejected':
      return 'bg-desa-orange';
    case 'pending':
    default:
      return 'bg-desa-yellow';
  }
}

function translateStatus(status) {
  switch ((status || '').toLowerCase()) {
    case 'approved':
      return 'Diterima';
    case 'rejected':
      return 'Ditolak';
    case 'pending':
    default:
      return 'Menunggu';
  }
}

// function getThumbnail(path) {
//   if (!path) {
//     // fallback jika tidak ada thumbnail
//     return new URL('@/assets/images/icons/money-dark-green.svg', import.meta.url).href;
//   }

//   // jika path sudah URL penuh (misal dari S3), kembalikan langsung
//   if (path.startsWith('http://') || path.startsWith('https://')) {
//     return path;
//   }

//   // jika path local dari storage Laravel
//   return `/storage/${path}`;
// }

const today = new Date()

// hari yang sedang jadi patokan
const selectedDay = ref(today)

const currentWeekStart = ref(startOfWeek(today, { weekStartsOn: 1 }))

// generate range 7 hari, dimulai dari currentDay
const weekDays = computed(() =>
  Array.from({ length: 7 }, (_, i) => {
    const d = addDays(currentWeekStart.value, i)
    return {
      date: d,
      day: format(d, 'EEE', { locale: id }), // Sen, Sel, Rab
      num: format(d, 'd'),                   // 23, 24, ...
      isToday: d.toDateString() === today.toDateString(),
      isSelected: d.toDateString() === selectedDay.value.toDateString()
    }
  })
)

// judul bulan (ambil dari currentDay)
const monthTitle = computed(() =>
  format(currentWeekStart.value, 'MMMM yyyy', { locale: id })
)

// navigasi geser 1 hari
const prevWeek = () => {
  currentWeekStart.value = subDays(currentWeekStart.value, 1)
}
const nextWeek = () => {
  currentWeekStart.value = addDays(currentWeekStart.value, 1)
}

const selectDay = (day) => {
  selectedDay.value = day.date
}
</script>

<template>
  <h1 class="font-semibold text-2xl">Desa Statistics</h1>
  <div id="Row-1" class="flex gap-[14px]">
    <div class="flex flex-col w-[calc(389/1000*100%)] h-[358px] rounded-2xl p-6 gap-6 gradient-vertical">
      <img src="@/assets/images/icons/gift-orange-background.svg" class="flex size-[86px] shrink-0" alt="icon">
      <div class="flex flex-col gap-3">
        <p class="font-medium text-sm text-desa-lime">— Bantuan Sosial</p>
        <p class="font-semibold text-2xl text-white text-nowrap">Dari Desa untuk Warga ❤️ </p>
        <p class="text-white">Wujudkan kesejahteraan desa dengan bantuan sosial yang tepat sasaran.</p>
      </div>
      <a href="#" class="flex items-center justify-between rounded-2xl p-4 gap-[10px] bg-white">
        <span class="font-medium text-desa-dark-green leading-5">Bikin Bantuan Sosial</span>
        <img src="@/assets/images/icons/add-square-dark-green.svg" class="flex size-6 shrink-0" alt="icon">
      </a>
    </div>
    <section id="Statistics" class="grid grid-cols-2 flex-1 shrink-0 gap-[14px]">
      <div class="card flex flex-col w-full rounded-2xl p-6 gap-3 bg-white">
        <div class="flex items-center justify-between">
          <p class="font-medium text-desa-secondary">Jumlah Penduduk</p>
          <img src="@/assets/images/icons/profil-2user-foreshadow-background.svg" class="flex size-12 shrink-0"
            alt="icon">
        </div>
        <div class="flex flex-col gap-[6px]">
          <p class="font-semibold text-[32px] leading-10">{{ dashboardData?.residents }}</p>
          <div class="flex items-center gap-0.5">
            <img src="@/assets/images/icons/trend-up-dark-green-fill.svg" class="flex size-[18px] shrink-0" alt="icon">
            <p class="font-medium text-sm text-desa-secondary">
              <span class="text-desa-dark-green">+12%</span>
              dari bulan sebelumnya
            </p>
          </div>
        </div>
      </div>
      <div class="card flex flex-col w-full rounded-2xl p-6 gap-3 bg-white">
        <div class="flex items-center justify-between">
          <p class="font-medium text-desa-secondary">Pembangunan</p>
          <img src="@/assets/images/icons/buildings-foreshadow-background.svg" class="flex size-12 shrink-0" alt="icon">
        </div>
        <div class="flex flex-col gap-[6px]">
          <p class="font-semibold text-[32px] leading-10">{{ dashboardData?.developments }}</p>
          <div class="flex items-center gap-0.5">
            <img src="@/assets/images/icons/trend-up-dark-green-fill.svg" class="flex size-[18px] shrink-0" alt="icon">
            <p class="font-medium text-sm text-desa-secondary">
              <span class="text-desa-dark-green">+12%</span>
              dari bulan sebelumnya
            </p>
          </div>
        </div>
      </div>
      <div class="card flex flex-col w-full rounded-2xl p-6 gap-3 bg-white">
        <div class="flex items-center justify-between">
          <p class="font-medium text-desa-secondary">Kepala Rumah</p>
          <img src="@/assets/images/icons/crown-foreshadow-background.svg" class="flex size-12 shrink-0" alt="icon">
        </div>
        <div class="flex flex-col gap-[6px]">
          <p class="font-semibold text-[32px] leading-10">{{ dashboardData?.head_of_families }}</p>
          <div class="flex items-center gap-0.5">
            <img src="@/assets/images/icons/trend-up-dark-green-fill.svg" class="flex size-[18px] shrink-0" alt="icon">
            <p class="font-medium text-sm text-desa-secondary">
              <span class="text-desa-dark-green">+12%</span>
              dari bulan sebelumnya
            </p>
          </div>
        </div>
      </div>
      <div class="card flex flex-col w-full rounded-2xl p-6 gap-3 bg-white">
        <div class="flex items-center justify-between">
          <p class="font-medium text-desa-secondary">Total Events</p>
          <img src="@/assets/images/icons/calendar-2-foreshadow-background.svg" class="flex size-12 shrink-0"
            alt="icon">
        </div>
        <div class="flex flex-col gap-[6px]">
          <p class="font-semibold text-[32px] leading-10">{{ dashboardData?.events }}</p>
          <div class="flex items-center gap-0.5">
            <img src="@/assets/images/icons/trend-up-dark-green-fill.svg" class="flex size-[18px] shrink-0" alt="icon">
            <p class="font-medium text-sm text-desa-secondary">
              <span class="text-desa-dark-green">+12%</span>
              dari bulan sebelumnya
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
  <div id="Row-2" class="flex gap-[14px]">
    <section id="Bantuan-Sosial" class="flex flex-col w-[calc(497/1000*100%)] shrink-0 rounded-2xl bg-white">
      <div class="flex flex-col gap-3 p-6">
        <div class="flex items-center justify-between">
          <p class="font-medium text-desa-secondary">Bantuan Sosial</p>
          <img src="@/assets/images/icons/bag-2-foreshadow-background.svg" class="flex size-12 shrink-0" alt="icon">
        </div>
        <div class="flex flex-col gap-[6px]">
          <p class="font-semibold text-[32px] leading-10">{{ dashboardData?.social_assistances }}</p>
          <div class="flex items-center gap-0.5">
            <img src="@/assets/images/icons/trend-up-dark-green-fill.svg" class="flex size-[18px] shrink-0" alt="icon">
            <p class="font-medium text-sm text-desa-secondary">
              <span class="text-desa-dark-green">+12%</span>
              dari bulan sebelumnya
            </p>
          </div>
        </div>
      </div>
      <hr class="border-desa-foreshadow">
      <div class="flex flex-col gap-4 p-6">
        <p class="font-semibold text-[20px] leading-[25px] text-left w-full">Bansos Terakhir</p>

        <template v-if="dashboardData?.latest_social_assistances?.length">
          <template v-for="(item, index) in dashboardData.latest_social_assistances" :key="index">
            <div class="card flex items-center w-full gap-3">
              <div class="flex size-[72px] shrink-0 rounded-2xl bg-desa-foreshadow items-center justify-center">
                <img :src="getIcon(item.social_assistance?.thumbnail)" class="flex size-9 shrink-0" alt="icon" />
              </div>
              <div class="flex flex-col gap-[6px] w-full">
                <p class="font-semibold text-xl leading-[25px]">
                  {{ formatAssistanceAmount(item) }}
                </p>
                <div class="flex items-center gap-0.5 font-medium text-desa-secondary">
                  <img src="@/assets/images/icons/profile-secondary-green.svg" class="flex size-[18px] shrink-0"
                    alt="icon" />
                  <span class="line-clamp-1">
                    Diberikan oleh {{ item.head_of_family?.user?.name ?? '-' }}
                  </span>
                </div>
              </div>
              <div class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0"
                :class="getStatusClass(item.status)">
                <span class="font-semibold text-xs text-white uppercase">
                  {{ translateStatus(item.status) }}
                </span>
              </div>
            </div>
            <hr class="border-desa-foreshadow last-of-type:hidden" />
          </template>
        </template>

        <div v-else class="m-auto h-[384px] flex flex-col shrink-0 justify-center items-center gap-6">
          <img src="@/assets/images/icons/bag-cross-secondary.svg" class="flex size-[52px] shrink-0" alt="icon" />
          <p class="font-medium leading-5 text-center text-desa-secondary">
            Ups, nampaknya belum ada bansos
          </p>
        </div>
      </div>
    </section>
    <section id="Event" class="flex flex-col flex-1 shrink-0 rounded-2xl bg-white">
      <div id="Date-Picker" class="flex flex-col gap-4 p-6">
        <div class="flex items-center justify-between">
          <button @click="prevWeek"
            class="flex items-center justify-center size-14 rounded-2xl border border-desa-foreshadow hover:border-desa-dark-green">
            <img src="@/assets/images/icons/arrow-left-secondary-green.svg" class="flex size-6 shrink-0" alt="icon">
          </button>
          <p class="font-semibold text-xl">
            {{ monthTitle }}
          </p>
          <button @click="nextWeek"
            class="flex items-center justify-center size-14 rounded-2xl border border-desa-foreshadow hover:border-desa-dark-green">
            <img src="@/assets/images/icons/arrow-left-secondary-green.svg" class="flex size-6 shrink-0 rotate-180"
              alt="icon">
          </button>
        </div>
        <div class="flex justify-between">
          <button v-for="day in weekDays" :key="day.date" @click="selectDay(day)"
            class="group flex flex-col items-center w-[46px] h-[76px] shrink-0 gap-3"
            :class="{ 'active': day.isSelected }">
            <div
              class="flex rounded-full size-[46px] items-center justify-center bg-desa-foreshadow group-[.active]:bg-desa-soft-green">
              <span class="font-medium text-desa-dark-green group-[.active]:text-white">
                {{ day.num }}
              </span>
            </div>
            <span class="font-medium text-sm text-desa-secondary group-[.active]:text-desa-black">
              {{ day.day }}
            </span>
          </button>
        </div>
      </div>
      <template v-if="dashboardData?.events?.length">
        <div v-for="event in dashboardData.events" :key="event.id"
          class="event-card relative flex w-full h-[365px] shrink-0 rounded-2xl bg-desa-background overflow-hidden">
          <img :src="event.thumbnail" class="w-full h-full object-cover object-top" alt="thumbnails">
          <div
            class="absolute inset-3 top-auto text-white flex flex-col rounded-[18px] border border-white/20 p-4 gap-[6px] backdrop-blur-xl bg-white/[2%]">
            <p class="font-semibold text-xl leading-[25px]">{{ event.name }}</p>
            <div class="flex items-center gap-1">
              <img src="@/assets/images/icons/clock-white.svg" class="flex size-[18px] shrink-0" alt="icon">
              <p class="font-medium">{{ event.time }}</p>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="event-empty-state m-auto h-[384px] flex flex-col shrink-0 justify-center items-center gap-6">
          <img src="@/assets/images/icons/calendar-remove-secondary-green.svg" class="flex size-[52px] shrink-0"
            alt="icon">
          <p class="font-medium leading-5 text-center text-desa-secondary">Ups, nampaknya belum ada event</p>
        </div>
      </template>

    </section>
  </div>
  <div id="Row-3" class="flex gap-[14px]">
    <section id="Total-Applicants" class="flex flex-col gap-[14px] w-[calc(603/1000*100%)]">
      <div class="flex flex-col flex-1 shrink-0 rounded-2xl bg-white">
        <!-- Header -->
        <div class="flex flex-col gap-3 p-6">
          <div class="flex items-center justify-between">
            <p class="font-medium text-desa-secondary">Total Applicants</p>
            <img src="@/assets/images/icons/document-text-foreshadow-background.svg" class="flex size-12 shrink-0"
              alt="icon">
          </div>
          <div class="flex flex-col gap-[6px]">
            <p class="font-semibold text-[32px] leading-10">
              {{ dashboardData.total_applicants }}
            </p>
            <div class="flex items-center gap-0.5">
              <img src="@/assets/images/icons/trend-up-dark-green-fill.svg" class="flex size-[18px] shrink-0"
                alt="icon">
              <p class="font-medium text-sm text-desa-secondary">
                <span class="text-desa-dark-green">+12%</span>
                dari bulan sebelumnya
              </p>
            </div>
          </div>
        </div>

        <hr class="border-desa-foreshadow">

        <!-- Latest Applicants -->
        <div class="flex flex-col gap-4 p-6">
          <p class="font-semibold text-[20px] leading-[25px] text-left w-full">Applicant Terakhir</p>

          <!-- Loop Applicants -->
          <template v-if="dashboardData.latest_applicants && dashboardData.latest_applicants.length">
            <div v-for="applicant in dashboardData.latest_applicants" :key="applicant.id">
              <div class="card flex items-center w-full gap-3">
                <!-- Thumbnail Development -->
                <div class="flex size-[72px] shrink-0 rounded-2xl bg-desa-foreshadow overflow-hidden">
                  <img :src="applicant.development.thumbnail_url ?? '/assets/images/thumbnails/default.png'"
                    class="w-full h-full object-cover" alt="thumbnail">
                </div>

                <!-- Applicant Info -->
                <div class="flex flex-col gap-[6px] w-full">
                  <div class="flex items-center gap-[6px]">
                    <div class="flex size-8 rounded-full overflow-hidden bg-desa-foreshadow">
                      <img :src="applicant.user.profile_picture_url ?? '/assets/images/photos/default.png'"
                        class="w-full h-full object-cover" alt="foto user">
                    </div>
                    <p class="font-medium text-xl leading-[22.5px] line-clamp-1">
                      {{ applicant.user.name }}
                    </p>
                  </div>
                  <span class="font-medium text-desa-secondary line-clamp-1">
                    {{ applicant.development.name }}
                  </span>
                </div>

                <!-- Status Badge -->
                <div class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0" :class="{
                  'bg-desa-yellow': applicant.status === 'pending',
                  'bg-desa-dark-green': applicant.status === 'approved',
                  'bg-desa-orange': applicant.status === 'rejected'
                }">
                  <span class="font-semibold text-xs text-white uppercase">
                    {{ applicant.status }}
                  </span>
                </div>
              </div>
              <hr class="border-desa-foreshadow last-of-type:hidden">
            </div>
          </template>

          <!-- Kalau kosong -->
          <div v-else class="m-auto h-[280px] flex flex-col shrink-0 justify-center items-center gap-6">
            <img src="@/assets/images/icons/note-remove-secondary.svg" class="flex size-[52px] shrink-0" alt="icon">
            <p class="font-medium leading-5 text-center text-desa-secondary">
              Ups, nampaknya belum ada Applicant
            </p>
          </div>
        </div>
      </div>

      <!-- Footer Download -->
      <div class="flex items-center justify-between h-[125px] rounded-2xl p-8 gap-4 gradient-horizontal">
        <div class="flex flex-col gap-[6px]">
          <p class="font-medium text-sm text-desa-lime">— Unduh Data Desa</p>
          <p class="font-semibold text-2xl text-white text-nowrap">Data Desa Terkini</p>
        </div>
        <a href="#" class="flex items-center flex-nowrap rounded-2xl p-4 gap-[10px] bg-white">
          <span class="font-medium text-desa-dark-green">Download Laporan</span>
          <img src="@/assets/images/icons/receive-square-dark-green.svg" class="flex size-6 shrink-0" alt="icon">
        </a>
      </div>
    </section>

    <section id="statistik-Penduduk" class="flex flex-col flex-1 shrink-0 gap-4 p-6 rounded-2xl bg-white">
      <div class="flex items-center justify-between">
        <p class="font-medium text-desa-secondary">Statistics Penduduk</p>
        <img src="@/assets/images/icons/profile-2user-foreshadow-background.svg" class="flex size-12 shrink-0"
          alt="icon">
      </div>

      <!-- lingkaran chart -->
      <div class="relative">
        <div class="absolute flex flex-col gap-1 justify-center items-center text-center inset-0">
          <!-- jumlah total penduduk dari API -->
          <p class="font-semibold text-[32px] leading-10">{{ dashboardData?.residents || 0 }}</p>
          <p class="font-medium text-sm text-desa-secondary">Jumlah Penduduk</p>
        </div>
        <canvas id="myChart" class="size-[288px] mx-auto"></canvas>
      </div>

      <!-- breakdown -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-1">
            <p class="font-medium leading-5 flex">
              <span class="block size-2 rounded-full my-auto bg-desa-dark-green mr-[6px]"></span>
              Pria
            </p>
            <p class="font-medium text-sm text-desa-secondary">Rentang usia: 32-36 tahun</p>
          </div>
          <p class="flex items-center font-medium leading-5">
            {{ dashboardData?.resident_statistics?.male || 0 }}
            <img src="@/assets/images/icons/user-black.svg" class="flex size-[18px] shrink-0 ml-0.5" alt="icon">
          </p>
        </div>
        <hr class="border-desa-foreshadow">

        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-1">
            <p class="font-medium leading-5 flex">
              <span class="block size-2 rounded-full my-auto bg-desa-soft-green mr-[6px]"></span>
              Wanita
            </p>
            <p class="font-medium text-sm text-desa-secondary">Rentang usia: 26-31 tahun</p>
          </div>
          <p class="flex items-center font-medium leading-5">
            {{ dashboardData?.resident_statistics?.female || 0 }}
            <img src="@/assets/images/icons/user-black.svg" class="flex size-[18px] shrink-0 ml-0.5" alt="icon">
          </p>
        </div>
        <hr class="border-desa-foreshadow">

        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-1">
            <p class="font-medium leading-5 flex">
              <span class="block size-2 rounded-full my-auto bg-desa-orange mr-[6px]"></span>
              Anak-anak
            </p>
            <p class="font-medium text-sm text-desa-secondary">Rentang usia: 6-12 tahun</p>
          </div>
          <p class="flex items-center font-medium leading-5">
            {{ dashboardData?.resident_statistics?.children || 0 }}
            <img src="@/assets/images/icons/user-black.svg" class="flex size-[18px] shrink-0 ml-0.5" alt="icon">
          </p>
        </div>
        <hr class="border-desa-foreshadow">

        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-1">
            <p class="font-medium leading-5 flex">
              <span class="block size-2 rounded-full my-auto bg-desa-yellow mr-[6px]"></span>
              Balita
            </p>
            <p class="font-medium text-sm text-desa-secondary">Rentang usia: 0-5 tahun</p>
          </div>
          <p class="flex items-center font-medium leading-5">
            {{ dashboardData?.resident_statistics?.toddler || 0 }}
            <img src="@/assets/images/icons/user-black.svg" class="flex size-[18px] shrink-0 ml-0.5" alt="icon">
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
