<template>
    <main class="flex-1">
        <div
            class="h-full bg-surface-50 dark:bg-surface-800 rounded-xl shadow-inner p-4 flex flex-col gap-2"
        >
            <!-- 工具栏（Icon + Tooltip）-->
            <div
                class="flex flex-wrap gap-2 border-b border-surface-300 dark:border-surface-700"
            >
                <Button
                    size="small"
                    text
                    @click="insert(EditorInsertType.HEADING)"
                >
                    <Heading1 :size="20" />
                </Button>
                <Button
                    size="small"
                    text
                    @click="insert(EditorInsertType.LIST)"
                >
                    <List :size="20" />
                </Button>
                <Button
                    size="small"
                    text
                    @click="insert(EditorInsertType.BOLD)"
                >
                    <Bold :size="20" />
                </Button>
                <Button
                    size="small"
                    text
                    @click="insert(EditorInsertType.ITALIC)"
                >
                    <Italic :size="20" />
                </Button>
                <Button
                    size="small"
                    text
                    @click="insert(EditorInsertType.LAYOUT)"
                >
                    <Columns2 :size="20" />
                </Button>
            </div>

            <!-- 编辑器输入框 -->
            <Textarea
                ref="editorRef"
                v-model="input"
                class="w-full h-full text-sm resize-none bg-transparent border-none focus:ring-0 focus:outline-none"
                placeholder="请输入 Markdown..."
                @scroll="handleEditorScroll"
            />
        </div>
    </main>

    <!-- preview box -->
    <div
        class="bg-white dark:bg-surface-800 rounded-lg shadow-md overflow-auto"
        ref="previewRef"
        @scroll="handlePreviewScroll"
    >
        <component
            v-for="(content, index) in renderList"
            :key="index"
            :is="currentComponent"
            :config="result.data"
            :content="content"
            :page="index + 1"
        />
    </div>

    <!-- hidden box to slice page -->
    <div ref="renderRef" class="render-area">
        <component
            :is="currentComponent"
            :config="result.data"
            :content="result.content"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMarkdownStore } from '@/store/markdown'
import { useTemplateStore } from '@/store/template'
import { useSlicePage } from '@/composables/useSlicePage'
import {
    useEditorInsert,
    EditorInsertType,
} from '@/composables/useEditorInsert'
import { useVueToPrint } from 'vue-to-print'
import { Heading1, List, Columns2, Bold, Italic } from 'lucide-vue-next'

const renderRef = ref<HTMLElement | null>(null)
const previewRef = ref<HTMLElement | null>(null)
const editorRef = ref<any>(null)

const mdStore = useMarkdownStore()
const templateStore = useTemplateStore()

const { result, input } = storeToRefs(mdStore)
const { currentComponent } = storeToRefs(templateStore)

const { insert } = useEditorInsert(editorRef, input)
const { renderList } = useSlicePage(renderRef)

const { handlePrint } = useVueToPrint({
    content: previewRef as any,
    documentTitle: 'AwesomeFileName',
})

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

defineExpose({
    exportPDF: () => {
        handlePrint()
    },
})
</script>
