import { defineStore } from 'pinia'
import { ref, computed, inject } from 'vue'
import { TemplateProvideKey, type TemplateMeta } from '@/plugins/templateLoader';

export const useTemplateStore = defineStore('template', () => {
    const templates: Record<string, TemplateMeta> = inject(TemplateProvideKey, {});

    const templateList = computed(() => Object.keys(templates));
    const currentTemplate = ref('SimpleTemplate');
    const currentComponent = computed(() => templates[currentTemplate.value]?.component);
    const currentConfig = computed(() => templates[currentTemplate.value] || {});

    const updateTemplate = (templateName: string) => {
        if (!templates[templateName]) {
            console.warn(`Template "${templateName}" not found.`);
            return;
        }
        currentTemplate.value = templateName;
    };

    return {
        templateList,
        currentTemplate,
        updateTemplate,
        currentComponent,
        currentConfig,
    };
});