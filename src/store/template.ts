import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const templateMap: Record<string, any> = {};
const templateStyleMap: Record<string, string> = {};
const injectedStyles = new Set<string>();

(async () => {
    const componentModules = import.meta.glob('../components/templates/**/*.vue', { eager: true })
    const styleModules = import.meta.glob('../components/templates/**/*.{css,scss}', { query: '?url', import: 'default' })

    // 解析组件路径 => 模板名
    for (const path in componentModules) {
        // eg: ../components/templates/simple/index.vue => simple
        const match = path.match(/templates\/([^/]+)\/index\.vue$/)
        const name = match?.[1]
        if (name) {
        templateMap[name] = (componentModules as any)[path].default
        }
    }

    for (const path in styleModules) {
        // eg: ../components/templates/simple/index.css => simple
        const match = path.match(/templates\/([^/]+)\/index\.(css|scss)$/)
        const name = match?.[1]
        if (name) {
            templateStyleMap[name] = await (styleModules as any)[path]();
        }
    }
})();

export const useTemplateStore = defineStore('template', () => {
    const templateList = computed(() => Object.keys(templateMap));
    const currentTemplate = ref('SimpleTemplate');
    const currentComponent = computed(() => templateMap[currentTemplate.value]);

    const injectStyleOnce = (href: string) => {
        if (injectedStyles.has(href)) return
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        document.head.appendChild(link)
        injectedStyles.add(href)
    }

    const updateTemplate = (templateName: string) => {
        if (!templateMap[templateName]) {
            console.warn(`Template "${templateName}" not found.`);
            return;
        }
        currentTemplate.value = templateName;
        
        // Inject the corresponding style if it exists
        const styleHref = templateStyleMap[templateName];
        if (styleHref) {
            injectStyleOnce(styleHref);
        }
    };

    // 初始化
    injectStyleOnce(templateStyleMap[currentTemplate.value] || '');

    return {
        templateList,
        currentTemplate,
        updateTemplate,
        currentComponent,
    };
});