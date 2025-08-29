<script setup>

import { formatRupiah, formatToClientTimezone, parseRupiah } from '@/helpers/format';
import { useSocialAssistanceRecipientStore } from '@/stores/socialAssistanceRecipient';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const socialAssistanceRecipient = ref({
    id: null,
    social_assistance_id: null,
    head_of_family: null,
    amount: null,
    reason: null,
    bank: null,
    account_number: null,
    proof: null,
    proof_url: null,
    status: null
})

const socialAssistanceRecipientStore = useSocialAssistanceRecipientStore();
const { loading, error, success } = storeToRefs(socialAssistanceRecipientStore)
const { fetchSocialAssistanceRecipient, updateSocialAssistanceRecipient } = socialAssistanceRecipientStore

const fetchData = async () => {
    const response = await fetchSocialAssistanceRecipient(route.params.id)

    socialAssistanceRecipient.value = response
    socialAssistanceRecipient.value.head_of_family_id = response.head_of_family?.id
    socialAssistanceRecipient.value.social_assistance_id = response.social_assistance?.id
}

const handleSubmit = async () => {
    await updateSocialAssistanceRecipient({
        ...socialAssistanceRecipient.value,
        amount: parseInt(parseRupiah(socialAssistanceRecipient.value.amount))
    })
}

const setStatusAndSubmit = async (status) => {
    socialAssistanceRecipient.value.status = status
    await handleSubmit()
}

const handleImageChange = (event) => {
    const file = event.target.files[0];
    socialAssistanceRecipient.value.proof = file
    socialAssistanceRecipient.value.proof_url = URL.createObjectURL(file)
}

onMounted(fetchData)
</script>

<template>
    <div id="Header" class="flex items-center justify-between">
        <div class="flex flex-col gap-2">
            <div class="flex gap-1 items-center leading-5 text-desa-secondary">
                <p class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize ">Pengajuan Bantuan
                    sosial</p>
                <span>/</span>
                <p class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize ">manage pengajuan
                    bansos
                </p>
            </div>
            <h1 class="font-semibold text-2xl">Manage Pengajuan Bansos </h1>
        </div>
    </div>

    <div v-if="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-2xl relative mb-4"
        role="alert">
        <span class="block sm:inline">{{ success }}</span>

        <button type="button" @click="success = null" class="absolute top-1/2 -translate-y-1/2 right-4">
            <img src="@/assets/images/icons/close-circle-white.svg" class="flex size-6 shrink-0" alt="icon">
        </button>
    </div>

    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl relative mb-4"
        role="alert">
        <span class="block sm:inline">{{ error }}</span>

        <button type="button" @click="error = null" class="absolute top-1/2 -translate-y-1/2 right-4">
            <img src="@/assets/images/icons/close-circle-white.svg" class="flex size-6 shrink-0" alt="icon">
        </button>
    </div>

    <div class="flex gap-[14px]">
        <section id="Detail"
            class="flex flex-col shrink-0 w-[calc(545/1000*100%)] h-fit rounded-3xl p-6 gap-6 bg-white">
            <p class="font-medium leading-5 text-desa-secondary">Detail Bantuan Sosials</p>
            <div class="flex items-center justify-between gap-4">
                <div class="flex w-[120px] h-[100px] shrink-0 rounded-2xl overflow-hidden bg-desa-foreshadow">
                    <img :src="socialAssistanceRecipient.social_assistance?.thumbnail"
                        class="w-full h-full object-cover" alt="photo">
                </div>
                <div class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-yellow"
                    v-if="socialAssistanceRecipient.status === 'pending'">
                    <span class="font-semibold text-xs text-white uppercase">Menunggu</span>
                </div>
                <div class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-green"
                    v-if="socialAssistanceRecipient.status === 'approved'">
                    <span class="font-semibold text-xs text-white uppercase">Disetujui</span>
                </div>
                <div class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-red"
                    v-if="socialAssistanceRecipient.status === 'rejected'">
                    <span class="font-semibold text-xs text-white uppercase">Ditolak</span>
                </div>
            </div>
            <div class="flex flex-col gap-[6px] w-full">
                <p class="font-semibold text-xl line-clamp-1">{{ socialAssistanceRecipient.social_assistance?.name }}
                </p>
                <p class="flex items-center gap-1">
                    <img src="@/assets/images/icons/profile-secondary-green.svg" class="flex size-[18px] shrink-0"
                        alt="icon">
                    <span class="font-medium text-sm text-desa-secondary">{{
                        socialAssistanceRecipient.social_assistance?.provider }}</span>
                </p>
            </div>
            <hr class="border-desa-foreshadow">
            <div class="flex items-center w-full gap-3">
                <div class="flex size-[52px] shrink-0 rounded-2xl bg-desa-foreshadow items-center justify-center">
                    <img src="@/assets/images/icons/money-dark-green.svg" class="flex size-6 shrink-0" alt="icon">
                </div>
                <div class="flex flex-col gap-1 w-full">
                    <p class="font-semibold text-lg leading-[22.5px] text-desa-dark-green">Rp {{
                        formatRupiah(socialAssistanceRecipient.social_assistance?.amount) }}</p>
                    <span class="font-medium text-desa-secondary">
                        Uang Tunai
                    </span>
                </div>
            </div>
            <hr class="border-desa-foreshadow">
            <div class="flex items-center w-full gap-3">
                <div class="flex size-[52px] shrink-0 rounded-2xl bg-desa-red/10 items-center justify-center">
                    <img src="@/assets/images/icons/minus-square-red.svg" class="flex size-6 shrink-0" alt="icon">
                </div>
                <div class="flex flex-col gap-1 w-full">
                    <p class="font-semibold text-lg leading-[22.5px] text-desa-red">Rp92.000.000</p>
                    <span class="font-medium text-desa-secondary">
                        Sisa Bansos
                    </span>
                </div>
            </div>
            <hr class="border-desa-foreshadow">
            <div class="flex items-center w-full gap-3">
                <div class="flex size-[52px] shrink-0 rounded-2xl bg-desa-blue/10 items-center justify-center">
                    <img src="@/assets/images/icons/profile-2user-blue.svg" class="flex size-6 shrink-0" alt="icon">
                </div>
                <div class="flex flex-col gap-1 w-full">
                    <p class="font-semibold text-lg leading-[22.5px] text-desa-blue">
                        {{ socialAssistanceRecipient.social_assistance?.social_assistance_recipients?.length }} Warga
                    </p>
                    <span class="font-medium text-desa-secondary">
                        Total Pengajuan
                    </span>
                </div>
            </div>
            <hr class="border-desa-foreshadow">
            <div class="flex flex-col gap-3">
                <p class="font-medium text-sm text-desa-secondary">Tentang Bantuan</p>
                <p class="font-medium leading-8">
                    {{ socialAssistanceRecipient.social_assistance?.description }}
                </p>
            </div>
        </section>
        <section class="flex flex-col flex-1 h-fit shrink-0 rounded-3xl p-6 gap-6 bg-white">
            <p class="font-medium leading-5 text-desa-secondary">Detail Pengajuan</p>
            <div class="flex items-center gap-3 w-[302px] shrink-0">
                <div class="flex size-[54px] rounded-full bg-desa-foreshadow overflow-hidden">
                    <img :src="socialAssistanceRecipient.head_of_family?.profile_picture"
                        class="w-full h-full object-cover" alt="icon">
                </div>
                <div class="flex flex-col gap-1">
                    <p class="font-semibold text-lg leading-5 text-desa-black">{{
                        socialAssistanceRecipient.head_of_family?.user?.name }}</p>
                    <p class="flex items-center gap-1">
                        <img src="@/assets/images/icons/briefcase-secondary-green.svg" class="flex size-[18px] shrink-0"
                            alt="icon">
                        <span class="font-medium text-sm text-desa-secondary">{{
                            socialAssistanceRecipient.head_of_family?.occupation }}</span>
                    </p>
                </div>
            </div>
            <hr class="border-desa-background">
            <div class="flex items-center gap-3 w-[302px] shrink-0">
                <div
                    class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden">
                    <img src="@/assets/images/icons/profile-2user-dark-green.svg" class="flex size-6 shrink-0"
                        alt="icon">
                </div>
                <div class="flex flex-col gap-1">
                    <p class="font-semibold text-lg leading-5">{{
                        socialAssistanceRecipient.head_of_family?.family_members?.length }} Anggota</p>
                    <p class="font-medium text-sm text-desa-secondary">Total Keluarga</p>
                </div>
            </div>
            <hr class="border-desa-background">
            <div class="flex items-center gap-3 w-[302px] shrink-0">
                <div
                    class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden">
                    <img src="@/assets/images/icons/keyboard-dark-green.svg" class="flex size-6 shrink-0" alt="icon">
                </div>
                <div class="flex flex-col gap-1">
                    <p class="font-semibold text-lg leading-5">{{
                        socialAssistanceRecipient.head_of_family?.identity_number }}</p>
                    <p class="font-medium text-sm text-desa-secondary">Nomor Induk Kependudukan</p>
                </div>
            </div>
            <hr class="border-desa-background">
            <div class="flex items-center gap-3 w-[302px] shrink-0">
                <div
                    class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden">
                    <img src="@/assets/images/icons/calendar-2-dark-green.svg" class="flex size-6 shrink-0" alt="icon">
                </div>
                <div class="flex flex-col gap-1">
                    <p class="font-semibold text-lg leading-5">{{
                        formatToClientTimezone(socialAssistanceRecipient.created_at) }}</p>
                    <p class="font-medium text-sm text-desa-secondary">Tanggal Pengajuan</p>
                </div>
            </div>
            <hr class="border-desa-background">
            <div class="flex items-center gap-3 w-[302px] shrink-0">
                <div
                    class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden">
                    <img src="@/assets/images/icons/receive-square-2-dark-green.svg" class="flex size-6 shrink-0"
                        alt="icon">
                </div>
                <div class="flex flex-col gap-1">
                    <p class="font-semibold text-lg leading-5">Rp {{ formatRupiah(socialAssistanceRecipient.amount) }}
                    </p>
                    <p class="font-medium text-sm text-desa-secondary">Nominal Pengajuan</p>
                </div>
            </div>
            <hr class="border-desa-background">
            <div class="flex flex-col gap-1">
                <p class="font-medium text-sm text-desa-secondary">Pesan Pengajuan:</p>
                <p class="font-medium leading-8">“
                    {{ socialAssistanceRecipient.reason }}
                </p>
            </div>
            <hr class="border-desa-background">
            <div class="flex flex-col gap-6">
                <p class="font-medium text-sm text-desa-secondary">Rekening Kepala Rumah</p>
                <div class="flex items-center gap-3">
                    <div
                        class="flex w-[120px] h-[60px] rounded-2xl border border-desa-background py-3 px-0.5 items-center justify-center bg-desa-blue/10 overflow-hidden">
                        <img src="@/assets/images/logos/bca.svg" class="w-full h-full object-contain" alt="icon"
                            v-if="socialAssistanceRecipient.bank === 'bca'">
                        <img src="@/assets/images/logos/bca.svg" class="w-full h-full object-contain" alt="icon"
                            v-if="socialAssistanceRecipient.bank === 'bri'">
                        <img src="@/assets/images/logos/bca.svg" class="w-full h-full object-contain" alt="icon"
                            v-if="socialAssistanceRecipient.bank === 'bni'">
                    </div>
                    <div>
                        <p class="font-medium text-sm text-desa-secondary">{{
                            socialAssistanceRecipient.head_of_family?.user?.name }}</p>
                        <div class="flex items-center gap-1">
                            <img src="@/assets/images/icons/document-copy-dark-green.svg"
                                class="flex size-[18px] shrink-0" alt="icon">
                            <p class="font-semibold text-lg text-desa-dark-green">{{
                                socialAssistanceRecipient.account_number }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <hr class="border-desa-background">
            <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
                <p class="font-medium text-sm text-desa-secondary">Bukti Pemberian Bansos</p>
                <div class="flex-1 flex items-center justify-between">
                    <div id="Photo-Preview"
                        class="flex itce justify-center w-[120px] h-[100px] rounded-2xl overflow-hidden bg-desa-foreshadow">
                        <img id="Photo" :src="socialAssistanceRecipient.proof_url" alt="image"
                            class="size-full object-cover" />
                    </div>
                    <div class="relative">
                        <input id="File" type="file" name="file" class="absolute opacity-0 left-0 w-full top-0 h-full"
                            @change="handleImageChange" ref="proof" />
                        <button id="Upload" type="button"
                            class="relative flex items-center py-4 px-6 rounded-2xl bg-desa-black gap-[10px]"
                            @click="$refs.proof.click()" v-if="socialAssistanceRecipient.status === 'pending'">
                            <img src="@/assets/images/icons/send-square-white.svg" alt="icon" class="size-6 shrink-0" />
                            <p class="font-medium leading-5 text-white">Upload</p>
                        </button>
                    </div>
                </div>
                <hr class="border-desa-background">
                <div class="flex items-center gap-3 w-full" v-if="socialAssistanceRecipient.status === 'pending'">
                    <button type="submit"
                        class="flex items-center w-full justify-center gap-[10px] rounded-2xl py-4 px-6 bg-desa-red/10"
                        @click="setStatusAndSubmit('rejected')">
                        <span class="font-medium text-desa-red">Tolak</span>
                    </button>
                    <button type="submit"
                        class="flex items-center w-full justify-center gap-[10px] rounded-2xl py-4 px-6 bg-desa-dark-green"
                        @click="setStatusAndSubmit('approved')">
                        <span class="font-medium text-white">Setuju</span>
                    </button>
                </div>
            </form>
        </section>
    </div>
</template>