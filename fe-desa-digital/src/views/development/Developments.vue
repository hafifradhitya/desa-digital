<script setup>
import CardList from '@/components/development/CardList.vue';
import Pagination from '@/components/ui/Pagination.vue';
import { useDevelopmentStore } from '@/stores/development';
import { debounce } from 'lodash';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch  } from 'vue';

const developmentStore = useDevelopmentStore()
const { developments, meta, loading, error, success } = storeToRefs(developmentStore)
const { fetchDevelopmentsPaginate } = developmentStore

const serverOptions = ref({
    page: 1,
    row_per_page: 10
});

const filters = ref({
    search: null
})

const fetchData = async () => {
    await fetchDevelopmentsPaginate({...serverOptions.value,...filters.value})
}

const debounceFetchData = debounce(fetchData, 500);

onMounted(fetchData)

watch(serverOptions, () => {
    fetchData()
}, { deep: true })

watch(filters, () => {
    debounceFetchData()
}, { deep: true })
</script>

<template>

</template>