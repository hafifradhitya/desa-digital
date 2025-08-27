import { handleError } from "@/helpers/errorHelper";
import { axiosInstance } from "@/plugins/axios";
import router from "@/router";
import { defineStore } from "pinia";

export const useEventStore = defineStore("event", {
    state: () => ({
        events: [],
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

        async fetchEventsPaginated(params){
            this.loading = true

            try {
                const response = await axiosInstance.get(`event/all/paginated`, { params })

                this.events = response.data.data.data
                this.meta = response.data.data.meta
            } catch (error) {
                this.error = handleError(error)
            } finally {
                this.loading = false
            }
        },

        async fetchEvent(id){
            this.loading = true

            try {
                const response = await axiosInstance.get(`/event/${id}`)

                return response.data.data
            } catch (error) {
                this.error = handleError(error)
            } finally {
                this.loading = false
            }
        },

        async updateEvent(payload) {
          this.loading = true
          try {
            const formData = new FormData()
            Object.keys(payload).forEach(key => {
              if (payload[key] !== null && payload[key] !== undefined) {
                formData.append(key, payload[key])
              }
            })
            formData.append('_method', 'PUT')

            const response = await axiosInstance.post(`/event/${payload.id}`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            })

            this.success = response.data.message
            router.push({ name: 'manage-event', params: { id: payload.id } })
          } catch (error) {
            this.error = handleError(error)
          } finally {
            this.loading = false
          }
        }
    }
})