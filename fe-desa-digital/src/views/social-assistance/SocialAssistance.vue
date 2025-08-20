<script setup>
import ModalDelete from '@/components/ui/ModalDelete.vue';
import router from '@/router';
import { useSocialAssistanceStore } from '@/stores/socialAssistance';
import { head } from 'lodash';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const socialAssistance = ref({})

const socialAssistanceStore = useSocialAssistanceStore();
const { loading } = storeToRefs(socialAssistanceStore)
const { fetchSocialAssistance, deleteSocialAssistance } = socialAssistanceStore

const fetchData = async () => {
    const response = await fetchSocialAssistance(route.params.id)

    socialAssistance.value = response
}

const showModalDelete = ref(false)

async function handleDelete() {
    await deleteSocialAssistance(route.params.id)

    router.push({ name: 'social-assistance' })
}

onMounted(fetchData)
</script>

<template>
    <div id="Header" class="flex items-center justify-between">
        <div class="flex flex-col gap-2">
            <div class="flex gap-1 items-center leading-5 text-desa-secondary">
                <p class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize ">Bantuan sosial</p>
                <span>/</span>
                <p class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize ">Manage bantuan
                    sosial</p>
            </div>
            <h1 class="font-semibold text-2xl">Manage Bantuan Sosial</h1>
        </div>
        <div class="flex items-center gap-3">
            <button data-modal="Modal-Delete" class="flex items-center rounded-2xl py-4 px-6 gap-[10px] bg-desa-red"
                @click="showModalDelete = true">
                <p class="font-medium text-white">Hapus Data</p>
                <img src="@/assets/images/icons/trash-white.svg" class="flex size-6 shrink-0" alt="icon">
            </button>
            <a href="kd-bantuan-sosial-edit.html"
                class="flex items-center rounded-2xl py-4 px-6 gap-[10px] bg-desa-black">
                <p class="font-medium text-white">Ubah Data</p>
                <img src="@/assets/images/icons/edit-white.svg" class="flex size-6 shrink-0" alt="icon">
            </a>
        </div>
    </div>
    <div class="flex gap-[14px]">
        <section id="Informasi-Bantuan-Sosial"
            class="flex flex-col shrink-0 w-[calc(545/1000*100%)] h-fit rounded-3xl p-6 gap-6 bg-white">
            <p class="font-medium leading-5 text-desa-secondary">Informasi Bantuan Sosial</p>
            <div class="flex items-center justify-between gap-4">
                <div class="flex w-[120px] h-[100px] shrink-0 rounded-2xl overflow-hidden bg-desa-foreshadow">
                    <img src="@/assets/images/thumbnails/kk-bansos-1.png" class="w-full h-full object-cover" alt="photo">
                </div>
                <div class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-soft-green">
                    <span class="font-semibold text-xs text-white uppercase">Tersedia</span>
                </div>
            </div>
            <div class="flex flex-col gap-[6px] w-full">
                <p class="font-semibold text-xl">Bantuan Untuk Rakyat Kurang Mampu</p>
                <p class="flex items-center gap-1">
                    <img src="@/assets/images/icons/profile-secondary-green.svg" class="flex size-[18px] shrink-0"
                        alt="icon">
                    <span class="font-medium text-sm text-desa-secondary">PT Shaynakit Meningkatkan Bangsa</span>
                </p>
            </div>
            <hr class="border-desa-foreshadow">
            <div class="flex items-center w-full gap-3">
                <div class="flex size-[52px] shrink-0 rounded-2xl bg-desa-foreshadow items-center justify-center">
                    <img src="@/assets/images/icons/money-dark-green.svg" class="flex size-6 shrink-0" alt="icon">
                </div>
                <div class="flex flex-col gap-1 w-full">
                    <p class="font-semibold text-lg leading-[22.5px] text-desa-dark-green">Rp120.000.000</p>
                    <span class="font-medium text-desa-secondary">
                        Uang Tunai
                    </span>
                </div>
            </div>
            <hr class="border-desa-foreshadow">
            <div class="flex items-center w-full gap-3">
                <div class="flex size-[52px] shrink-0 rounded-2xl bg-desa-blue/10 items-center justify-center">
                    <img src="@/assets/images/icons/profile-2user-blue.svg" class="flex size-6 shrink-0" alt="icon">
                </div>
                <div class="flex flex-col gap-1 w-full">
                    <p class="font-semibold text-lg leading-[22.5px] text-desa-blue">15.600 Warga</p>
                    <span class="font-medium text-desa-secondary">
                        Total Pengajuan
                    </span>
                </div>
            </div>
            <hr class="border-desa-foreshadow">
            <div class="flex flex-col gap-3">
                <p class="font-medium text-sm text-desa-secondary">Tentang Bantuan</p>
                <p class="font-medium leading-8">Program Bantuan Sosial ini hadir untuk memberikan dukungan nyata bagi
                    masyarakat yang membutuhkan. Kami berkomitmen membantu memenuhi kebutuhan dasar seperti pangan,
                    kesehatan, dan pendidikan, demi meningkatkan kualitas hidup. Dengan semangat gotong royong, kami
                    mengajak semua pihak untuk bersama-sama menciptakan perubahan positif.</p>
            </div>
        </section>
        <section id="Penerima-Bansos-Terakhir"
            class="flex flex-col flex-1 h-fit shrink-0 rounded-3xl p-6 gap-6 bg-white">
            <p class="font-medium leading-5 text-desa-secondary">Penerima Bansos Terakhir</p>
            <div id="List-Bansos-Terkahir" class="flex flex-col gap-6">
                <div class="card flex flex-col rounded-2xl border border-desa-background p-4 gap-4">
                    <div class="flex items-center justify-between">
                        <p class="font-medium text-sm text-desa-secondary">Tue, 31 Dec 2024 </p>
                        <img src="@/assets/images/icons/calendar-2-secondary-green.svg" class="flex size-[18px] shrink-0"
                            alt="icon">
                    </div>
                    <hr class="border-desa-background">
                    <div class="flex items-center gap-3">
                        <div class="flex flex-col gap-[6px] w-full">
                            <p class="font-semibold text-lg leading-5">Rp120.000.000</p>
                            <p class="font-medium text-sm text-desa-secondary">Nominal Pengajuan</p>
                        </div>
                        <div class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-yellow">
                            <span class="font-semibold text-xs text-white uppercase">Menunggu</span>
                        </div>
                    </div>
                    <hr class="border-desa-background">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-0.5">
                            <img src="@/assets/images/icons/profile-secondary-green.svg" class="flex size-[18px] shrink-0"
                                alt="icon">
                            <p class="font-medium text-sm text-desa-secondary">Diberikan Kepada:</p>
                        </div>
                        <div class="flex items-center gap-1">
                            <p class="font-medium leading-5">Udin Louvre</p>
                            <div class="flex size-8 shrink-0 rounded-full bg-desa-foreshadow overflow-hidden">
                                <img src="@/assets/images/photos/kk-photo-5.png" class="w-full h-full object-cover"
                                    alt="photo">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card flex flex-col rounded-2xl border border-desa-background p-4 gap-4">
                    <div class="flex items-center justify-between">
                        <p class="font-medium text-sm text-desa-secondary">Tue, 31 Dec 2024 </p>
                        <img src="@/assets/images/icons/calendar-2-secondary-green.svg" class="flex size-[18px] shrink-0"
                            alt="icon">
                    </div>
                    <hr class="border-desa-background">
                    <div class="flex items-center gap-3">
                        <div class="flex flex-col gap-[6px] w-full">
                            <p class="font-semibold text-lg leading-5">Rp120.000.000</p>
                            <p class="font-medium text-sm text-desa-secondary">Nominal Pengajuan</p>
                        </div>
                        <div class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-red">
                            <span class="font-semibold text-xs text-white uppercase">Ditolak</span>
                        </div>
                    </div>
                    <hr class="border-desa-background">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-0.5">
                            <img src="@/assets/images/icons/profile-secondary-green.svg" class="flex size-[18px] shrink-0"
                                alt="icon">
                            <p class="font-medium text-sm text-desa-secondary">Diberikan Kepada:</p>
                        </div>
                        <div class="flex items-center gap-1">
                            <p class="font-medium leading-5">Udin Louvre</p>
                            <div class="flex size-8 shrink-0 rounded-full bg-desa-foreshadow overflow-hidden">
                                <img src="@/assets/images/photos/kk-photo-5.png" class="w-full h-full object-cover"
                                    alt="photo">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card flex flex-col rounded-2xl border border-desa-background p-4 gap-4">
                    <div class="flex items-center justify-between">
                        <p class="font-medium text-sm text-desa-secondary">Tue, 31 Dec 2024 </p>
                        <img src="@/assets/images/icons/calendar-2-secondary-green.svg" class="flex size-[18px] shrink-0"
                            alt="icon">
                    </div>
                    <hr class="border-desa-background">
                    <div class="flex items-center gap-3">
                        <div class="flex flex-col gap-[6px] w-full">
                            <p class="font-semibold text-lg leading-5">Rp120.000.000</p>
                            <p class="font-medium text-sm text-desa-secondary">Nominal Pengajuan</p>
                        </div>
                        <div
                            class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-dark-green">
                            <span class="font-semibold text-xs text-white uppercase">Diterima</span>
                        </div>
                    </div>
                    <hr class="border-desa-background">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-0.5">
                            <img src="@/assets/images/icons/profile-secondary-green.svg" class="flex size-[18px] shrink-0"
                                alt="icon">
                            <p class="font-medium text-sm text-desa-secondary">Diberikan Kepada:</p>
                        </div>
                        <div class="flex items-center gap-1">
                            <p class="font-medium leading-5">Udin Louvre</p>
                            <div class="flex size-8 shrink-0 rounded-full bg-desa-foreshadow overflow-hidden">
                                <img src="@/assets/images/photos/kk-photo-5.png" class="w-full h-full object-cover"
                                    alt="photo">
                            </div>
                        </div>
                    </div>
                </div>
                <a href="#"
                    class="flex items-center justify-center h-14 rounded-2xl py-4 px-6 gap-[10px] bg-desa-dark-green">
                    <span class="font-medium leading-5 text-white">View All</span>
                </a>
            </div>
        </section>
    </div>

    <ModalDelete :show="showModalDelete" title="Hapus Bantuan Sosial" :loading="loading" @close="showModalDelete = false" @confirm="handleDelete" />
</template>