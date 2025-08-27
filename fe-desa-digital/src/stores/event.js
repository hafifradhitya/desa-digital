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
    }
})