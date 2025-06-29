<template>
    <aside
        class="w-60 p-4 bg-surface-100 dark:bg-surface-800 border-r border-surface-300 dark:border-surface-700 flex flex-col gap-4"
    >
        <h3 class="text-lg font-medium">工具栏</h3>
        <div>
            <label class="block mb-2 text-sm font-medium">选择模板</label>
            <Dropdown
                v-model="currentTemplate"
                :options="templateList"
                class="w-full"
            />
        </div>
        <FileUpload
            name="md"
            accept=".md"
            mode="basic"
            choose-label="上传 Markdown"
            class="w-full"
            auto
            customUpload
            @select="handleMarkdownUpload"
        />
        <Button
            label="导出 PDF"
            icon="pi pi-file-pdf"
            severity="danger"
            class="w-full"
            @click="onExportPdf"
        />
        <Button
            label="导出 Markdown"
            icon="pi pi-download"
            class="w-full"
            @click="exportMarkdown"
        />
        <div class="flex items-center gap-1">
            <i class="pi pi-palette"></i>
            <span>样式配置</span>
        </div>
        <div class="mb-0.5">边距</div>
        <Slider
            :model-value="pagePadding"
            :min="30"
            :max="60"
            @change="handleStyleConfigChange('pagePadding', $event)"
        />
    </aside>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMarkdownStore } from '@/store/markdown'
import { useTemplateStore } from '@/store/template'
import { useStyleConfigStore } from '@/store/styleConfig'

defineProps<{ onExportPdf: () => void }>()

const mdStore = useMarkdownStore()
const templateStore = useTemplateStore()
const styleConfigStore = useStyleConfigStore()

const { input } = storeToRefs(mdStore)
const { templateList, currentTemplate } = storeToRefs(templateStore)

const { pagePadding } = storeToRefs(styleConfigStore)

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
