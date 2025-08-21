import { handleError } from "@/helpers/errorHelper";
import { axiosInstance } from "@/plugins/axios";
import router from "@/router";
import { defineStore } from "pinia";

export const useSocialAssistanceStore = defineStore("social-assistance", {
    state: () => ({
        socialAssistances: [],
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
        async fetchSocialAssistancePaginated(params) {
            this.loading = true

            try {
                const response = await axiosInstance.get(`social-assistance/all/paginated`, { params })

                // console.log('API Response:', response.data) // 🔎 cek struktur JSON dari backend


                this.socialAssistances = response.data.data.data
                this.meta = response.data.data.meta
            } catch (error) {
                this.error = handleError(error)
            } finally {
                this.loading = false
            }
        },
        async fetchSocialAssistance(id){
            this.loading = true

            try {
                const response = await axiosInstance.get(`/social-assistance/${id}`)

                return response.data.data
            } catch (error) {
                this.error = handleError(error)
            } finally {
                this.loading = false
            }
        },

        // async updateSocialAssistance(payload){
        //     this.loading = true

        //     try {
        //         const response = await axiosInstance.post(`/social-assistance/${payload.id}`, {
        //             ...payload,
        //             _method: 'PUT'
        //         })

        //         this.success = response.data.message

        //         router.push({name: 'manage-social-assistance', params: {id: payload.id}})
        //     } catch (error) {
        //         this.error = handleError(error)
        //     } finally {
        //         this.loading = false
        //     }
        // },

        async createSocialAssistance(payload) {
            this.loading = true

            try {
                const response = await axiosInstance.post("/social-assistance", payload)

                this.success = response.data.message

                router.push({ name: 'social-assistance' })
            } catch (error) {
                this.error = handleError(error)
            } finally {
                this.loading = false
            }
        },

        async updateSocialAssistance(payload) {
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
                `/social-assistance/${payload.id}`,
                formData
                )

                this.success = response.data.message
                router.push({ name: "manage-social-assistance", params: { id: payload.id } })
            } catch (error) {
                this.error = handleError(error)
            } finally {
                this.loading = false
            }
        },

        async deleteSocialAssistance(id){
            this.loading = true

            try {
                const response = await axiosInstance.delete(`/social-assistance/${id}`)

                this.success = response.data.message
            } catch (error) {
                this.error = handleError(error)
            } finally {
                this.loading = false
            }
        }
    }
})