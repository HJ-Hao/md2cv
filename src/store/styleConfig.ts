import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'

const defaultStyleConfig = {
    fontSize: 16,
    lineHeight: 1.6,
    pagePadding: 48,
}

export const useStyleConfigStore = defineStore('styleConfig', () => {
    const styleConfig = useLocalStorage('style-config', defaultStyleConfig)

    const pagePadding = computed(() => styleConfig.value.pagePadding)

    const fontSize = computed(() => styleConfig.value.fontSize)

    const lineHeight = computed(() => styleConfig.value.lineHeight)

    const updateStyleConfig = (
        newConfig: Partial<typeof defaultStyleConfig>
    ) => {
        styleConfig.value = {
            ...styleConfig.value,
            ...newConfig,
        }
    }

    const resetStyleConfig = () => {
        styleConfig.value = { ...defaultStyleConfig }
    }

    return {
        updateStyleConfig,
        resetStyleConfig,
        pagePadding,
        fontSize,
        lineHeight,
    }
})
