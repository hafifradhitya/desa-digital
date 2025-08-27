import { handleError } from "@/helpers/errorHelper";
import { axiosInstance } from "@/plugins/axios";
import router from "@/router";
import { defineStore } from "pinia";

export const useDevelopmentStore = defineStore("development", {
    state: () => ({
        developments: [],
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

        async fetchDevelopmentsPaginated(params){
            this.loading = true

            try {
                const response = await axiosInstance.get(`development/all/paginated`, { params })

                this.developments = response.data.data.data
                this.meta = response.data.data.meta
            } catch (error) {
                this.error = handleError(error)
            } finally {
                this.loading = false
            }
        },

        async fetchDevelopment(id){
            this.loading = true

            try {
                const response = await axiosInstance.get(`/development/${id}`)

                return response.data.data
            } catch (error) {
                this.error = handleError(error)
            } finally {
                this.loading = false
            }
        },

        async createDevelopment(payload) {
            this.loading = true

            try {
                const response = await axiosInstance.post("/development", payload)

                this.success = response.data.message

                router.push({ name: 'development' })
            } catch (error) {
                this.error = handleError(error)
            } finally {
                this.loading = false
            }
        },

        async updateDevelopment(payload) {
            this.loading = true

            try {
                const response = await axiosInstance.post(`/development/${payload.id}`, {
                    ...payload,
                    _method: 'PUT'
                })

                this.success = response.data.message

                router.push({ name: 'manage-development', params: { id: payload.id } })
            } catch (error) {
                this.error = handleError(error)
            } finally {
                this.loading = false
            }
        },

        // async updateDevelopment(payload) {
        //     this.loading = true
        //     try {
        //         const formData = new FormData()

        //         Object.keys(payload).forEach(key => {
        //         if (key === "thumbnail") {
        //             if (payload.thumbnail instanceof File) {
        //             formData.append("thumbnail", payload.thumbnail)
        //             }
        //         } else if (key !== "thumbnail_url") {
        //             formData.append(key, payload[key])
        //         }
        //         })

        //         formData.append("_method", "PUT")

        //         const response = await axiosInstance.post(
        //         `/development/${payload.id}`,
        //         formData
        //         )

        //         this.success = response.data.message
        //         router.push({ name: "manage-development", params: { id: payload.id } })
        //     } catch (error) {
        //         this.error = handleError(error)
        //     } finally {
        //         this.loading = false
        //     }
        // },

        async deleteDevelopment(id){
            this.loading = true

            try {
                const response = await axiosInstance.delete(`/development/${id}`)

                this.success = response.data.message
            } catch (error) {
                this.error = handleError(error)
            } finally {
                this.loading = false
            }
        }
    }
})