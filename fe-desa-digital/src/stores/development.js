import { handleError } from "@/helpers/errorHelper";
import { axiosInstance } from "@/plugins/axios";
import router from "@/router";
import { defineStore } from "pinia";

export const useDevelopementStore = defineStore("development", {
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
    }
})