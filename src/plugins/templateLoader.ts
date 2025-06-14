// plugins/templateLoader.ts
import type { App, Component } from 'vue'

export type TemplateMeta = {
    name: string
    className: string
    component: Component
}

export const TemplateProvideKey = 'Templates'

const templateLoaderPlugin = {
    install(app: App) {
        const componentModules = import.meta.glob(
            '../components/templates/**/index.vue',
            { eager: true }
        )
        const configModules = import.meta.glob(
            '../components/templates/**/index.ts',
            { eager: true }
        )

        const templates: Record<string, TemplateMeta> = {}

        const getTemplateName = (path: string) => {
            const match = path.match(/templates\/([^/]+)\//)
            return match ? match?.[1] : null
        }

        // 解析组件路径 => 模板名
        for (const path in componentModules) {
            // eg: ../components/templates/simple/index.vue => simple
            const name = getTemplateName(path)
            if (name) {
                const component = (componentModules as any)[path].default
                templates[name] = {
                    component,
                } as TemplateMeta
            }
        }

        for (const path in configModules) {
            // eg: ../components/templates/simple/index.ts => simple
            const name = getTemplateName(path)
            if (name) {
                const config = (configModules as any)[path]
                if (config) {
                    templates[name] = {
                        ...(templates[name] || {}),
                        name: config.name || name,
                        className: config.className || '',
                    }
                }
            }
        }

        app.provide(TemplateProvideKey, templates)
    },
}

export const loadTemplateStyles = () => {
    const styleModules = import.meta.glob(
        '../components/templates/**/index.{css,scss}',
        { query: '?url', import: 'default' }
    ) as Record<string, () => Promise<string>>

    return new Promise<void>((resolve) => {
        Promise.all(Object.values(styleModules).map((module) => module())).then(
            (hrefs) => {
                const loadPromises = hrefs.map((href) => {
                    return new Promise<void>((res) => {
                        const link = document.createElement('link')
                        link.rel = 'stylesheet'
                        link.href = href
                        link.onload = () => res()
                        link.onerror = () => {
                            console.warn('样式加载失败:', href)
                            res()
                        }
                        document.head.appendChild(link)
                    })
                })

                // 确保所有 link 都加载完成后再 resolve
                Promise.all(loadPromises).then(() => resolve())
            }
        )
    })
}

export default templateLoaderPlugin
