<template>
    <!-- 中间 Markdown 输入 -->
    <main class="flex-1">
        <div
            class="h-full bg-surface-50 dark:bg-surface-800 rounded-xl shadow-inner p-4"
        >
            <Textarea
                ref="editorRef"
                v-model="input"
                class="w-full h-full text-sm"
                placeholder="请输入 Markdown..."
                @scroll="handleEditorScroll"
            />
        </div>
    </main>

    <!-- 右侧预览区域 -->
    <div
        class="bg-white dark:bg-surface-800 p-6 rounded-lg shadow-md overflow-auto"
        ref="previewRef"
        @scroll="handlePreviewScroll"
    >
        <div v-html="renderContent" />
    </div>

    <!-- 隐藏的区域用于渲染分页 -->
    <div
        ref="renderRef"
        class="absolute top-0 left-0 -z-10 invisible pointer-events-none w-[794px]"
    >
        <component
            :is="currentComponent"
            :config="result.data"
            :content="result.content"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMarkdownStore } from '@/store/markdown'
import { useTemplateStore } from '@/store/template'
import { useSlicePage } from '@/composables/useSlicePage'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

const renderRef = ref<HTMLElement | null>(null)
const previewRef = ref<HTMLElement | null>(null)
const editorRef = ref<any>(null)

const mdStore = useMarkdownStore()
const templateStore = useTemplateStore()

const { result, input } = storeToRefs(mdStore)
const { currentTemplate, currentComponent } = storeToRefs(templateStore)

const { getSlicePage, renderContent } = useSlicePage(renderRef)

// syncing scroll positions between editor and preview
// add flags to prevent infinite loops
let isSyncingFromEditor = false
let isSyncingFromPreview = false

const handleEditorScroll = () => {
    if (isSyncingFromPreview) {
        return
    }
    const editor = editorRef.value?.$el as HTMLElement | null
    const renderEl = renderRef.value

    if (!editor || !renderEl || !previewRef.value) return

    isSyncingFromEditor = true

    const editorScrollRatio =
        editor.scrollTop / (editor.scrollHeight - editor.clientHeight)

    previewRef.value.scrollTop = renderEl.clientHeight * editorScrollRatio

    requestAnimationFrame(() => {
        isSyncingFromEditor = false
    })
}

const handlePreviewScroll = () => {
    if (isSyncingFromEditor) {
        return
    }
    const editor = editorRef.value?.$el as HTMLElement | null
    const renderEl = renderRef.value
    const previewEl = previewRef.value

    if (!editor || !renderEl || !previewEl) return

    isSyncingFromPreview = true

    // 如果预览区域滚动超过内容高度，保持编辑器滚动到底部
    if (previewEl.scrollTop + previewEl.clientHeight > renderEl.clientHeight) {
        editor.scrollTop = editor.scrollHeight - editor.clientHeight
    } else {
        const previewScrollRatio =
            previewEl.scrollTop /
            (renderEl.clientHeight - previewEl.clientHeight)

        editor.scrollTop =
            (editor.scrollHeight - editor.clientHeight) * previewScrollRatio
    }

    requestAnimationFrame(() => {
        isSyncingFromPreview = false
    })
}

const exportPDF = async () => {
    // 等待 DOM 更新 + 样式应用完成
    await nextTick()
    const element = previewRef.value
    if (!element) {
        console.warn('Preview element not found.')
        return
    }

    const pages = element.querySelectorAll('.page')
    if (pages.length === 0) {
        console.warn('No pages found in the preview element.')
        return
    }

    const pdf = new jsPDF('p', 'mm', 'a4')

    for (let i = 0; i < pages.length; i++) {
        const el = pages[i] as HTMLElement

        const canvas = await html2canvas(el, {
            scale: 2, // 提高清晰度
            useCORS: true,
        })
        const imgData = canvas.toDataURL('image/png')

        const imgProps = pdf.getImageProperties(imgData)
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

        if (i !== 0) pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    }

    pdf.save('md2cv-resume.pdf')
}

watch(
    () => [result.value, currentTemplate.value],
    () => {
        nextTick(() => {
            getSlicePage()
        })
    }
)

onMounted(() => {
    nextTick(() => {
        getSlicePage()
    })
})

defineExpose({
    exportPDF,
})
</script>
