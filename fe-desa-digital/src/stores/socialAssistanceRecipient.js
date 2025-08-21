import { handleError } from "@/helpers/errorHelper";
import { axiosInstance } from "@/plugins/axios";
import router from "@/router";
import { defineStore } from "pinia";

export const useSocialAssistanceRecipientStore = defineStore("social-assistance-recipient", {
    state: () => ({
        socialAssistancesRecipients: [],
        meta: {
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0,
        },
        loading: false,
        error: null,
        success: null,
    }),
    actions: {
        async fetchSocialAssistancesRecipientsPaginated(params) {
            this.loading = true

            try {
                const response = await axiosInstance.get(`social-assistance-recipient/all/paginated`, { params })

                // console.log('API Response:', response.data) // 🔎 cek struktur JSON dari backend


                this.socialAssistancesRecipients = response.data.data.data
                this.meta = response.data.data.meta
            } catch (error) {
                this.error = handleError(error)
            } finally {
                this.loading = false
            }
        },

        async fetchSocialAssistanceRecipient(id){
            this.loading = true

            try {
                const response = await axiosInstance.get(`/social-assistance-recipient/${id}`)

                return response.data.data
            } catch (error) {
                this.error = handleError(error)
            } finally {
                this.loading = false
            }
        },
    }
})