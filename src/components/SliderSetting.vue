<template>
    <div class="mb-2">
        <div class="text-sm font-medium mb-1">{{ label }}</div>
        <div class="flex items-center gap-4">
            <span
                class="text-xs text-gray-500 dark:text-gray-400 w-6 text-right"
                >{{ min }}</span
            >
            <Slider
                class="flex-1"
                :model-value="modelValue"
                :min="min"
                :max="max"
                @update:modelValue="
                    $emit('update:modelValue', $event as number)
                "
            />
            <span
                class="text-xs text-gray-500 dark:text-gray-400 w-6 text-left"
                >{{ max }}</span
            >
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    label: string
    modelValue: number
    min: number
    max: number
}>()

defineEmits<{
    (e: 'update:modelValue', value: number): void
}>()
</script>

<style scoped>
/* 可根据主题调整样式 */
</style>
