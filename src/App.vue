<script setup lang="ts">
import { onMounted } from 'vue'
import ResumeDetail from './pages/ResumeDetail.vue'
import { useImageStorage } from '@/composables/useImageStorage'

const { loadImage } = useImageStorage()

onMounted(async () => {
    // load indexDB image data
    await loadImage()
})
</script>

<template>
    <main>
        <ResumeDetail />
    </main>
</template>

<style scoped></style>
