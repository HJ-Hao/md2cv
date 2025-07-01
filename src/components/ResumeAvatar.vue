<template>
    <div
        class="relative group"
        :style="{ width: `${width}px`, height: `${height}px` }"
    >
        <img
            v-if="uploadedImage"
            :src="uploadedImage.url"
            alt="头像"
            class="w-full h-full object-contain"
        />

        <!-- placeholder -->
        <div
            v-else
            class="flex items-center justify-center border-surface-300 bg-surface-100 w-full h-full"
        >
            <User class="resume-avater-placeholder" :size="20" />
        </div>

        <div
            v-if="uploadedImage"
            class="absolute -top-2.5 -right-2.5 w-6 h-6 bg-surface-900 flex items-center justify-center rounded-full cursor-pointer overflow-hidden opacity-0 group-hover:opacity-100 transition"
            @click="deleteImage"
        >
            <X class="text-white" :size="20" />
        </div>

        <input
            v-else
            type="file"
            accept="image/*"
            class="absolute inset-0 opacity-0 cursor-pointer"
            @change="onFileChange"
        />
    </div>
</template>

<script setup lang="ts">
import { X, User } from 'lucide-vue-next'
import { useImageStorage } from '@/composables/useImageStorage'

defineProps({
    width: {
        type: Number,
        default: 90,
    },
    height: {
        type: Number,
        default: 120,
    },
})

const { uploadedImage, saveImage, deleteImage } = useImageStorage()

const onFileChange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    await saveImage(file)
}
</script>
