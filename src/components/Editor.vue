<template>
    <div class="min-h-screen flex flex-col">
        <!-- 顶部栏 -->
        <Toolbar class="surface-0 shadow-2">
            <template #start>
                <span class="text-xl font-bold ml-2">md2cv</span>
            </template>
            <template #end>
                <Button icon="pi pi-sun" @click="handleChangeDarkMode" class="mr-2" />
            </template>
        </Toolbar>

        <!-- 主体区域 -->
        <div class="flex flex-1 overflow-hidden">
        <!-- 左侧工具栏 -->
        <div class="w-48 bg-surface-100 dark:bg-surface-800 p-4 flex flex-col gap-3">
            <!-- <FileUpload
            mode="basic"
            chooseLabel="上传图片"
            accept="image/*"
            customUpload
            @uploader="() => {}"
            /> -->
             <Button label="导出 PDF" icon="pi pi-file-pdf" :loading="exporting" @click="exportPDF" />
        </div>

        <!-- 中间 Markdown 编辑器 -->
        <div class="flex-1 p-4 overflow-auto">
            <Textarea
                v-model="mdStore.input"
                autoResize
                rows="30"
                class="w-full h-full"
                placeholder="请输入 Markdown..."
            />
        </div>

            <!-- 右侧预览区域 -->
            <div ref="exportRef" class=" p-5 overflow-auto bg-surface-50 dark:bg-surface-900 border-l border-surface-200 dark:border-surface-700">
                
                 <div v-html="renderContent"></div>
            </div>

        </div>
    </div>
        <div ref="previewRef" class=" p-5 absolute z-0 top-0 left-0" style="visibility: hidden; width: 794px;">
            <SimpleTemplate :config="mdStore.result.data" :content="mdStore.result.content" />
        </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from 'vue'
import { useSlicePage } from '@/composables/useSlicePage';
import SimpleTemplate from '@/components/template/SimpleTemplate/index.vue'
// import PdfViewer from '@/components/PdfViewer.vue';
import { useMarkdownStore } from '@/store/markdown';
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'


const previewRef = ref<HTMLElement | null>(null);
const exportRef = ref<HTMLElement | null>(null);
const exporting = ref(false);
// const render = ref<HTMLElement | null>(null);

const mdStore = useMarkdownStore();

const handleChangeDarkMode = () => {
    document.documentElement.classList.toggle('my-app-dark');
}

const exportPDF = async () => {

    exporting.value = true

    // 等待 DOM 更新 + 样式应用完成
    await nextTick()
    const element = exportRef.value
    if (!element) {
        console.warn("Preview element not found.")
        exporting.value = false
        return
    }

    const pages = element.querySelectorAll('.page');
    if (pages.length === 0) {
        console.warn("No pages found in the preview element.")
        exporting.value = false
        return
    }

    try {
        const pdf = new jsPDF('p', 'mm', 'a4')

        for (let i = 0; i < pages.length; i++) {
            const el = pages[i] as HTMLElement

            const canvas = await html2canvas(el, {
                scale: 2, // 提高清晰度
                useCORS: true
            })
            const imgData = canvas.toDataURL('image/png')

            const imgProps = pdf.getImageProperties(imgData)
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

            if (i !== 0) pdf.addPage()
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
        }

        pdf.save('md2cv-resume.pdf')
    } catch (error) {
        console.error("Error exporting PDF:", error)
    } finally {
        exporting.value = false
    }
}

const { getSlicePage, renderContent } = useSlicePage(previewRef);

watch(() => mdStore.result, () => {
    nextTick(() => {
        getSlicePage();
    });
});

onMounted(() => {
    nextTick(() => {
        getSlicePage();
    });
});
</script>

<style scoped>

.hidden-target {
    visibility: hidden;
}

</style>