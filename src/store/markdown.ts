import { computed } from 'vue'
import matter from 'gray-matter'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import md from '@/plugins/markdown'

const defaultInput = `---
name: 张三
blog: https://xxx.com
phone: xx-xxx
location: xx
---

# 掌握技能

- **前端开发**：HTML5, CSS3, JavaScript, TypeScript
- **框架与库**：Vue 3, React, Vite, Pinia, Vue Router
- **工具链**：Webpack, ESLint, Prettier, Git
- **UI 框架**：Element Plus, Ant Design, PrimeVue, TailwindCSS
- **其他技能**：Markdown, RESTful API, WebSocket, Docker（基础）

# 教育经历
::::::row
:::col
**北京理工大学**  计算机科学与技术 本科  
:::

:::col
2016.09 - 2020.07  
:::
::::::

# 工作经历

## ABC科技有限公司 ｜ 前端开发工程师  
2020.08 - 至今

- 负责企业级管理后台系统的架构与开发；
- 主导多模块系统的组件化与模块重构；
- 引入 Vue 3 + Composition API，降低复杂度；
- 推动项目从 Vue 2 向 Vue 3 平滑迁移。

# 实习经历

## 字节跳动 ｜ 前端实习生  
2020.03 - 2020.07

- 参与中后台组件库的维护与优化；
- 开发可复用数据表格与图表组件；
- 编写单元测试与文档，提升开发效率。

# 项目经历

## 在线简历生成器（Vue3 + Markdown + PDF 导出）

**项目简介**：  
一个基于 Markdown 编写的简历生成网站，支持实时预览、模板切换、PDF 导出、主题切换等功能。

**技术栈**：
- 前端框架：Vue 3 + Vite + Pinia
- UI 组件库：PrimeVue + TailwindCSS
- 渲染与导出：html2canvas + jsPDF
- 特性支持：深浅色模式、localStorage 自动保存、组件化模板

**项目职责**：
- 搭建项目架构，封装主题与模板系统；
- 实现 Markdown 实时渲染与分页导出；
- 优化页面性能与导出精度，兼容暗黑模式；
- 编写用户指引和默认模板，提升用户体验。

## 前端低代码平台

**项目简介**：基于 JSON Schema 的可视化页面搭建平台，支持组件拖拽、数据绑定、动态表单。

**职责**：
- 封装核心组件，支持属性配置与事件响应；
- 实现组件注册、拖拽渲染和配置同步逻辑；
- 支持自定义渲染与远程 schema 数据加载。


# 其他信息

1. 语言能力：英语 CET-6，具备良好的英文文档阅读能力；
2. 个人兴趣：技术写作、开源贡献、健身、旅行；
3. 博客地址：[https://zhangsan.dev](https://zhangsan.dev)`

export const useMarkdownStore = defineStore('counter', () => {
    const input = useLocalStorage<string>('markdown-input', defaultInput)

    const result = computed(() => {
        try {
            const { data, content } = matter(input.value)
            return {
                data,
                content: md.render(content),
            }
        } catch (e) {
            console.error('Markdown parsing error:', e)
            return {
                data: {},
                content: input.value, // return raw input on error
            }
        }
    })

    return {
        input,
        result,
    }
})
