<script setup>
import Sidebar from '@/components/sidebar/Sidebar.vue';
import Topbar from '@/components/sidebar/Topbar.vue';
import { RouterView } from 'vue-router';

</script>

<template>
    <div class="flex flex-1">
        <Sidebar />

        <div id="Main-Container" class="flex flex-col flex-1">
            <Topbar />

            <div id="Content" class="relative flex flex-col flex-1 gap-[14px] p-6 pb-[30px] w-full shrink-0">
                <RouterView />
            </div>
        </div>
    </div>
</template>