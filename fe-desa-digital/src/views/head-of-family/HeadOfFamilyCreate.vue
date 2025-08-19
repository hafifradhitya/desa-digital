<script setup>
import { useHeadOfFamilyStore } from '@/stores/headOfFamily';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

import IconProfileSecondaryGreen from '@/assets/images/icons/user-secondary-green.svg';
import IconProfileBlack from '@/assets/images/icons/user-black.svg';

import IconKeyboardSecondaryGreen from '@/assets/images/icons/keyboard-secondary-green.svg';
import IconKeyboardBlack from '@/assets/images/icons/keyboard-black.svg';

import IconCallSecondaryGreen from '@/assets/images/icons/call-secondary-green.svg';
import IconCallBlack from '@/assets/images/icons/call-black.svg';

import IconBriefCaseSecondaryGreen from '@/assets/images/icons/briefcase-secondary-green.svg';
import IconBriefCaseBlack from '@/assets/images/icons/briefcase-black.svg';

import Input from '@/components/ui/Input.vue';

const headOfFamilyStore = useHeadOfFamilyStore()
const { loading, error } = storeToRefs(useHeadOfFamilyStore)
const { createHeadOfFamily } = headOfFamilyStore

const headOfFamily = ref({
    name: null,
    email: null,
    password: null,
    profile_picture: null,
    profile_picture_url: null,
    identity_number: null,
    gender: null,
    date_of_birth: null,
    phone_number: null,
    occupation: null,
    marital_status: null
})

const handleSubmit = async () => {
    await createHeadOfFamily(headOfFamily.value)
}

const handleImageChange = (event) => {
    const file = event.target.files[0];
    headOfFamily.value.profile_picture = file
    headOfFamily.value.profile_picture_url = URL.createObjectURL(file)
}
</script>

<template>
    <div id="Header" class="flex items-center justify-between">
        <div class="flex flex-col gap-2">
            <div class="flex gap-1 items-center leading-5 text-desa-secondary">
                <p class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize ">Kepala Rumah</p>
                <span>/</span>
                <p class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize ">Tambah Kepala Rumah
                </p>
            </div>
            <h1 class="font-semibold text-2xl">Tambah Kepala Rumah Baru</h1>
        </div>
    </div>
    <form @submit.prevent="handleSubmit" id="myForm" class="capitalize">
        <div class="shrink-0 rounded-3xl p-6 bg-white flex flex-col gap-6 h-fit">
            <section id="Photo-Profile" class="flex items-center justify-between">
                <h2 class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]">Profile Kepala Rumah</h2>
                <div class="flex-1 flex items-center justify-between">
                    <div id="Photo-Preview"
                        class="flex itce justify-center size-[100px] rounded-full overflow-hidden bg-desa-foreshadow">
                        <img id="Photo" :src="headOfFamily.profile_picture_url" alt="image"
                            class="size-full object-cover" /> 
                    </div>
                    <div class="relative">
                        <input required id="File" type="file" name="file"
                            class="absolute opacity-0 left-0 w-full top-0 h-full" @change="handleImageChange"
                            ref="profile_picture" />
                        <button id="Upload" type="button"
                            class="relative flex items-center py-4 px-6 rounded-2xl bg-desa-black gap-[10px]"
                            @click="$refs.profile_picture.click()">
                            <img src="@/assets/images/icons/send-square-white.svg" alt="icon" class="size-6 shrink-0" />
                            <p class="font-medium leading-5 text-white">Upload</p>
                        </button>
                    </div>
                </div>
            </section>  
            <hr class="border-desa-background" />
            <section id="Nama-Kepala-Rumah" class="flex items-center justify-between">
                <p class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]">Nama Kepala Rumah</p>
                <div class="flex flex-col gap-3 flex-1 shrink-0">
                    <Input v-model="headOfFamily.name" type="text" placeholder="Ketik Nama Kamu" 
                        :error-message="error?.name" 
                        :icon="IconProfileSecondaryGreen" :filled-icon="IconProfileBlack" />
                </div>
            </section>
            <hr class="border-desa-background" />
            <section id="NIK" class="flex items-center justify-between">
                <p class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]">Nomor Induk Kependudukan</p>
                <div class="flex flex-col gap-3 flex-1 shrink-0">
                    <Input v-model="headOfFamily.identity_number" type="text" placeholder="Ketik NIK Kamu" 
                        :error-message="error?.identity_number" 
                        :icon="IconKeyboardSecondaryGreen" :filled-icon="IconKeyboardBlack" />
                </div>
            </section>
            <hr class="border-desa-background" />
            <section id="Phone" class="flex items-center justify-between">
                <p class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]">Nomor Handphone</p>
                <div class="flex flex-col gap-3 flex-1 shrink-0">
                    <Input v-model="headOfFamily.phone_number" type="text" placeholder="Ketik Nomor Handphone Kamu" 
                        :error-message="error?.phone_number" 
                        :icon="IconCallSecondaryGreen" :filled-icon="IconCallBlack" /> 
                </div>
            </section>
            <hr class="border-desa-background" />
            <section id="Pekerjaan" class="flex items-center justify-between">
                <p class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]">Pekerjaan</p>
                <div class="flex flex-col gap-3 flex-1 shrink-0">
                    <Input v-model="headOfFamily.occupation" type="text" placeholder="Ketik Pekerjaan Kamu" 
                        :error-message="error?.occupation" 
                        :icon="IconBriefCaseSecondaryGreen" :filled-icon="IconBriefCaseBlack" /> 
                </div>
            </section>
            <hr class="border-desa-background" />
            <section id="Tanggal-Lahir" class="flex items-center justify-between">
                <p class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]">Tanggal Lahir</p>
                <div class="flex items-center gap-6 flex-1 shrink-0">
                    <label class="relative group peer w-full valid">
                        <input required type="date" id="birthdate" placeholder="Masukan tanggal lahir"
                            class="appearance-none outline-none w-full h-14 rounded-2xl ring-[1.5px] ring-desa-background focus:ring-desa-black p-4 pl-12 gap-2 font-medium invalid:text-desa-secondary transition-all duration-300 [&::-webkit-calendar-picker-indicator]:hidden"
                            onclick="this.showPicker();">
                        <div class="absolute transform -translate-y-1/2 top-1/2 left-4 flex size-6 shrink-0">
                            <img src="@/assets/images/icons/calendar-2-secondary-green.svg"
                                class="size-6 hidden group-has-[:invalid]:flex" alt="icon">
                            <img src="@/assets/images/icons/calendar-2-black.svg"
                                class="size-6 flex group-has-[:invalid]:hidden" alt="icon">
                        </div>
                        <img src="@/assets/images/icons/Checklist-dark-green-fill.svg"
                            class="absolute transform -translate-y-1/2 top-1/2 right-4 size-6 shrink-0 hidden group-[.valid]:flex"
                            alt="icon">
                    </label>
                    <div
                        class="w-[180px] flex shrink-0 h-[52px] rounded-2xl bg-desa-foreshadow p-4 font-medium leading-5 text-desa-dark-green justify-center">
                        <p>Umur: <span id="Age">0</span> tahun</p>
                    </div>
                </div>
            </section>
            <hr class="border-desa-background" />
            <section id="Jenis-Kelamin" class="flex items-center justify-between">
                <p class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]">Jenis Kelamin</p>
                <div class="flex flex-1 gap-6 shrink-0">
                    <label
                        class="group flex w-full items-center h-14 rounded-2xl p-4 ring-[1.5px] ring-desa-background gap-2 has-[:checked]:ring-desa-dark-green transition-setup">
                        <input type="radio" name="gender" id=""
                            class="flex size-[18px] shrink-0 accent-desa-secondary checked:accent-desa-dark-green transition-setup">
                        <span
                            class="font-medium leading-5 text-desa-secondary w-full group-has-[:checked]:text-desa-dark-green transition-setup">
                            Pria
                        </span>
                        <div class="flex size-6 shrink-0">
                            <img src="@/assets/images/icons/man-secondary-green.svg"
                                class="size-6 flex group-has-[:checked]:hidden" alt="icon">
                            <img src="@/assets/images/icons/man-dark-green.svg"
                                class="size-6 hidden group-has-[:checked]:flex" alt="icon">
                        </div>
                    </label>
                    <label
                        class="group flex w-full items-center h-14 rounded-2xl p-4 ring-[1.5px] ring-desa-background gap-2 has-[:checked]:ring-desa-dark-green transition-setup">
                        <input type="radio" name="gender" id=""
                            class="flex size-[18px] shrink-0 accent-desa-secondary checked:accent-desa-dark-green transition-setup">
                        <span
                            class="font-medium leading-5 text-desa-secondary w-full group-has-[:checked]:text-desa-dark-green transition-setup">
                            Wanita
                        </span>
                        <div class="flex size-6 shrink-0">
                            <img src="@/assets/images/icons/woman-secondary-green.svg"
                                class="size-6 flex group-has-[:checked]:hidden" alt="icon">
                            <img src="@/assets/images/icons/woman-dark-green.svg"
                                class="size-6 hidden group-has-[:checked]:flex" alt="icon">
                        </div>
                    </label>
                </div>
            </section>
            <hr class="border-desa-background" />
            <section id="Status" class="flex items-center justify-between">
                <p class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]">Status</p>
                <div class="flex flex-1 gap-6 shrink-0">
                    <label
                        class="group flex w-full items-center h-14 rounded-2xl p-4 ring-[1.5px] ring-desa-background gap-2 has-[:checked]:ring-desa-dark-green transition-setup">
                        <input type="radio" name="status" id=""
                            class="flex size-[18px] shrink-0 accent-desa-secondary checked:accent-desa-dark-green transition-setup">
                        <span
                            class="font-medium leading-5 text-desa-secondary w-full group-has-[:checked]:text-desa-dark-green transition-setup">
                            Belum Menikah
                        </span>
                        <div class="flex size-6 shrink-0">
                            <img src="@/assets/images/icons/profile-secondary-green.svg"
                                class="size-6 flex group-has-[:checked]:hidden" alt="icon">
                            <img src="@/assets/images/icons/profile-dark-green.svg"
                                class="size-6 hidden group-has-[:checked]:flex" alt="icon">
                        </div>
                    </label>
                    <label
                        class="group flex w-full items-center h-14 rounded-2xl p-4 ring-[1.5px] ring-desa-background gap-2 has-[:checked]:ring-desa-dark-green transition-setup">
                        <input type="radio" name="status" id=""
                            class="flex size-[18px] shrink-0 accent-desa-secondary checked:accent-desa-dark-green transition-setup">
                        <span
                            class="font-medium leading-5 text-desa-secondary w-full group-has-[:checked]:text-desa-dark-green transition-setup">
                            Sudah Menikah
                        </span>
                        <div class="flex size-6 shrink-0">
                            <img src="@/assets/images/icons/profile-2user-secondary-green.svg"
                                class="size-6 flex group-has-[:checked]:hidden" alt="icon">
                            <img src="@/assets/images/icons/profile-2user-dark-green.svg"
                                class="size-6 hidden group-has-[:checked]:flex" alt="icon">
                        </div>
                    </label>
                </div>
            </section>
            <hr class="border-desa-background w-[calc(100%+48px)] -mx-6" />
            <p class="font-medium leading-5">Akun Dashboard</p>
            <section id="Email" class="flex items-center justify-between">
                <p class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]">Email Address</p>
                <div class="flex flex-col gap-3 flex-1 shrink-0">
                    <!-- add or remove .invalid class for error state (red border, icon, and text) -->
                    <label class="relative group peer w-full invalid">
                        <input type="email" placeholder="Masukan Email"
                            class="appearance-none outline-none w-full h-14 rounded-2xl ring-[1.5px] ring-desa-background focus:ring-desa-black py-4 px-12 gap-2 font-medium placeholder:text-desa-secondary transition-all duration-300 group-[.invalid]:input-invalid-state">
                        <div class="absolute transform -translate-y-1/2 top-1/2 left-4 flex size-6 shrink-0">
                            <img src="@/assets/images/icons/sms-secondary-green.svg"
                                class="size-6 hidden group-has-[:placeholder-shown]:flex group-[.invalid]:!hidden"
                                alt="icon">
                            <img src="@/assets/images/icons/sms-black.svg"
                                class="size-6 flex group-has-[:placeholder-shown]:hidden group-[.invalid]:hidden"
                                alt="icon">
                            <img src="@/assets/images/icons/sms-red.svg" class="size-6 hidden group-[.invalid]:flex"
                                alt="icon">
                        </div>
                        <img src="@/assets/images/icons/Checklist-dark-green-fill.svg"
                            class="absolute transform -translate-y-1/2 top-1/2 right-4 size-6 shrink-0 hidden group-[.valid]:flex"
                            alt="icon">
                        <img src="@/assets/images/icons/close-circle-red-fill.svg"
                            class="absolute transform -translate-y-1/2 top-1/2 right-4 size-6 shrink-0 hidden group-[.invalid]:flex"
                            alt="icon">
                    </label>
                    <span class="font-medium text-sm text-desa-red hidden peer-[.invalid]:block">Email sudah
                        digunakan</span>
                </div>
            </section>
            <hr class="border-desa-background" />
            <section id="Passwords" class="flex items-center justify-between">
                <p class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]">Passwords</p>
                <div class="flex flex-col gap-3 flex-1 shrink-0">
                    <label class="relative group peer w-full">
                        <input type="password" placeholder="Masukan Password"
                            class="appearance-none outline-none w-full h-14 rounded-2xl ring-[1.5px] ring-desa-background focus:ring-desa-black py-4 px-12 gap-2 font-medium placeholder:text-desa-secondary transition-all duration-300 tracking-[4px] placeholder:tracking-normal">
                        <div class="absolute transform -translate-y-1/2 top-1/2 left-4 flex size-6 shrink-0">
                            <img src="@/assets/images/icons/key-secondary-green.svg"
                                class="size-6 hidden group-has-[:placeholder-shown]:flex" alt="icon">
                            <img src="@/assets/images/icons/key-black.svg"
                                class="size-6 flex group-has-[:placeholder-shown]:hidden" alt="icon">
                        </div>
                    </label>
                </div>
            </section>
            <hr class="border-desa-background" />
            <section id="Buttons" class="flex items-center justify-end gap-4">
                <a href="kd-kepala-rumah.html">
                    <div
                        class="py-[18px] rounded-2xl bg-desa-red w-[180px] text-center flex justify-center font-medium text-white">
                        Batal, Tidak jadi</div>
                </a>
                <button disabled id="submitButton" type="submit"
                    class="py-[18px] rounded-2xl disabled:bg-desa-grey w-[180px] text-center flex justify-center font-medium text-white bg-desa-dark-green transition-all duration-300">Create
                    Now</button>
            </section>
        </div>
    </form>
</template>