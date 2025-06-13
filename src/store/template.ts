import { defineStore } from 'pinia'
import { computed, inject } from 'vue'
import { TemplateProvideKey, type TemplateMeta } from '@/plugins/templateLoader'
import { useLocalStorage } from '@vueuse/core'

export const useTemplateStore = defineStore('template', () => {
    const templates: Record<string, TemplateMeta> = inject(
        TemplateProvideKey,
        {}
    )

    const templateList = computed(() => Object.keys(templates))
    const currentTemplate = useLocalStorage(
        'current-template',
        'SimpleTemplate'
    )
    const currentComponent = computed(
        () => templates[currentTemplate.value]?.component
    )
    const currentConfig = computed(() => templates[currentTemplate.value] || {})

    const updateTemplate = (templateName: string) => {
        if (!templates[templateName]) {
            console.warn(`Template "${templateName}" not found.`)
            return
        }
        currentTemplate.value = templateName
    }

    return {
        templateList,
        currentTemplate,
        updateTemplate,
        currentComponent,
        currentConfig,
    }
})
