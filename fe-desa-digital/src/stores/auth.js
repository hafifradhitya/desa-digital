import { handleError } from "@/helpers/errorHelper";
import { axiosInstance } from "@/plugins/axios";
import router from "@/router";
import Cookies from "js-cookie";
import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: Cookies.get('token') || null, // simpan di state juga
        loading: false,
        error: null,
        success: null
    }),
    actions: {
        async login(credentials) {
            this.loading = true
            try {
                const response = await axiosInstance.post('/login', credentials)
                const token = response.data.token

                // simpan ke state + cookie
                this.token = token
                Cookies.set('token', token)

                // kalau API login balikin data user langsung
                this.user = response.data.user || null
                if (!this.user) {
                    await this.checkAuth() // fallback fetch user
                }

                this.success = 'Login successful'
                router.replace({ name: 'dashboard' })
            } catch (error) {
                this.error = handleError(error)
            } finally {
                this.loading = false
            }
        },
        async logout() {
            this.loading = true
            try {
                await axiosInstance.post('/logout')
            } catch (error) {
                this.error = handleError(error)
            } finally {
                // reset state
                this.token = null
                this.user = null
                this.error = null
                this.success = 'Logout successful'

                Cookies.remove('token')

                this.loading = false
                router.replace({ name: 'login' })
            }
        },
        async checkAuth() {
            this.loading = true
            try {
                const response = await axiosInstance.get('/me')
                this.user = response.data.data
                return this.user
            } catch (error) {
                if (error.response?.status === 401) {
                    this.logout()
                }
            } finally {
                this.loading = false
            }
        },
    },
})
