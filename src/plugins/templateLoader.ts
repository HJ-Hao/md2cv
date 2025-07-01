// plugins/templateLoader.ts
import type { App, Component } from 'vue'

export type TemplateMeta = {
    name: string
    component: Component
    getCurrentPageHeight: (page: number) => number
}

export const TemplateProvideKey = 'Templates'

const templateLoaderPlugin = {
    install(app: App) {
        const componentModules = import.meta.glob(
            '../components/templates/**/index.tsx',
            { eager: true }
        )
        const templates: Record<string, TemplateMeta> = {}

        const getTemplateName = (path: string) => {
            const match = path.match(/templates\/([^/]+)\//)
            return match ? match?.[1] : null
        }

        // path => component Name
        for (const path in componentModules) {
            // eg: ../components/templates/simple/index.vue => simple
            const name = getTemplateName(path)
            if (name) {
                const config = (componentModules as any)[path]
                templates[name] = {
                    component: config.default,
                    name: config.name || name,
                    getCurrentPageHeight: config.getCurrentPageHeight,
                } as TemplateMeta
            }
        }

        app.provide(TemplateProvideKey, templates)
    },
}

export default templateLoaderPlugin
