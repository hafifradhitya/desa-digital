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

        async updateSocialAssistanceRecipient(payload) {
            this.loading = true
            try {
                const formData = new FormData()

                Object.keys(payload).forEach(key => {
                if (key === "thumbnail") {
                    if (payload.thumbnail instanceof File) {
                    formData.append("thumbnail", payload.thumbnail)
                    }
                } else if (key !== "thumbnail_url") {
                    formData.append(key, payload[key])
                }
                })

                formData.append("_method", "PUT")

                const response = await axiosInstance.post(
                `/social-assistance-recipient/${payload.id}`,
                formData
                )

                this.success = response.data.message
                router.push({ name: "manage-social-assistance-recipient", params: { id: payload.id } })
            } catch (error) {
                this.error = handleError(error)
            } finally {
                this.loading = false
            }
        },
    }
})