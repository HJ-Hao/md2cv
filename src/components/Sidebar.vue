<template>
    <aside
        class="w-64 p-4 bg-white dark:bg-[#1e1e2f] shadow-xl rounded-xl flex flex-col gap-6 border border-transparent"
    >
        <div
            class="flex items-center text-xl font-semibold gap-2 text-gray-800 dark:text-white"
        >
            <i class="pi pi-tools text-primary" />
            <span>工具栏</span>
        </div>

        <div>
            <label class="block mb-1 text-sm text-gray-500 dark:text-gray-300"
                >模板选择</label
            >
            <Dropdown
                v-model="currentTemplate"
                :options="templateList"
                class="w-full"
            />
        </div>

        <div>
            <label class="block mb-1 text-sm text-gray-500 dark:text-gray-300"
                >上传 Markdown</label
            >
            <FileUpload
                name="md"
                accept=".md"
                mode="basic"
                choose-label="上传文件"
                class="w-full"
                auto
                customUpload
                @select="handleMarkdownUpload"
            />
        </div>

        <div class="flex flex-col gap-2">
            <SidebarButton
                icon="pi pi-file-pdf"
                label="导出 PDF"
                @click="onExportPdf"
            />
            <SidebarButton
                icon="pi pi-download"
                label="导出 Markdown"
                @click="exportMarkdown"
            />
        </div>

        <div class="space-y-1">
            <div
                class="flex items-center text-sm font-medium gap-2 text-gray-600 dark:text-gray-300"
            >
                <i class="pi pi-palette" />
                <span>样式配置</span>
            </div>

            <SliderSetting
                label="边距"
                :min="30"
                :max="60"
                :model-value="pagePadding"
                @update:model-value="
                    handleStyleConfigChange('pagePadding', $event)
                "
            />

            <SliderSetting
                label="字体大小"
                :model-value="fontSize"
                :min="12"
                :max="24"
                @update:model-value="
                    handleStyleConfigChange('fontSize', $event)
                "
            />
        </div>
    </aside>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import SliderSetting from './SliderSetting.vue'
import SidebarButton from './SidebarButton.vue'
import { useMarkdownStore } from '@/store/markdown'
import { useTemplateStore } from '@/store/template'
import { useStyleConfigStore } from '@/store/styleConfig'

defineProps<{ onExportPdf: () => void }>()

const mdStore = useMarkdownStore()
const templateStore = useTemplateStore()
const styleConfigStore = useStyleConfigStore()

const { input } = storeToRefs(mdStore)
const { templateList, currentTemplate } = storeToRefs(templateStore)

const { pagePadding, fontSize } = storeToRefs(styleConfigStore)

const handleMarkdownUpload = (event: any) => {
    const file = event.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
        const content = e.target?.result as string
        input.value = content
    }
    reader.readAsText(file)
}

// 导出 Markdown
const exportMarkdown = () => {
    const blob = new Blob([input.value], {
        type: 'text/markdown;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'resume.md'
    a.click()
    URL.revokeObjectURL(url)
}

const handleStyleConfigChange = (key: string, value: any) => {
    styleConfigStore.updateStyleConfig({
        [key]: value,
    })
}
</script>
