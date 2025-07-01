<template>
    <button
        class="flex items-center justify-between px-4 py-2 cursor-pointer rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white transition-colors duration-150"
        @click="$emit('click')"
    >
        <span class="flex items-center gap-2">
            <slot name="icon" />
            {{ label }}
        </span>
        <ChevronRight :size="16" />
    </button>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
defineProps<{
    label: string
}>()
defineEmits(['click'])
</script>
