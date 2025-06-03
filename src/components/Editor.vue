<template>
  <div class="h-screen flex flex-col bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-50">
    <!-- 顶部栏 -->
    <Toolbar class="shadow-md px-4 bg-surface-100 dark:bg-surface-800">
      <template #start>
        <span class="text-xl font-bold tracking-wide">✨ md2cv</span>
      </template>
      <template #end>
        <div class="flex items-center gap-2">
          <Button
            icon="pi pi-sun"
            severity="secondary"
            rounded
            text
            @click="handleChangeDarkMode"
          />
        </div>
      </template>
    </Toolbar>

    <!-- 主体区域 -->
    <div class="flex flex-1 overflow-hidden">
      <!-- 左侧工具栏 -->
      <aside class="w-60 p-4 bg-surface-100 dark:bg-surface-800 border-r border-surface-300 dark:border-surface-700 flex flex-col gap-4">
        <h3 class="text-lg font-medium">工具栏</h3>
        <Button
          label="导出 PDF"
          icon="pi pi-file-pdf"
          severity="danger"
          :loading="exporting"
          class="w-full"
          @click="exportPDF"
        />
        <!-- 更多功能 -->
      </aside>

      <!-- 中间 Markdown 输入 -->
      <main class="flex-1">
        <div class="h-full bg-surface-50 dark:bg-surface-800 rounded-xl shadow-inner p-4">
          <Textarea
            ref="editorRef"
            v-model="mdStore.input"
            class="w-full h-full text-sm"
            placeholder="请输入 Markdown..."
            @scroll="syncScroll"
          />
        </div>
      </main>

      <!-- 右侧预览区域 -->
      <div
          class="bg-white dark:bg-surface-800 p-6 rounded-lg shadow-md overflow-auto"
          ref="exportRef"
        >
          <div v-html="renderContent" />
        </div>
    </div>

    <!-- 隐藏的预览区域（用于导出） -->
    <div
      ref="previewRef"
      class="absolute top-0 left-0 -z-10 opacity-0 pointer-events-none"
      style="width: 794px;"
    >
      <SimpleTemplate
        :config="mdStore.result.data"
        :content="mdStore.result.content"
      />
    </div>
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
const editorRef = ref<any>(null);
const exporting = ref(false);


const syncScroll = () => {
  const editor = editorRef.value?.$el as HTMLElement | null;

  const preview = previewRef.value;

  if (!editor || !preview || !exportRef.value) return;

  const editorScrollRatio =
    editor.scrollTop / (editor.scrollHeight - editor.clientHeight);

  exportRef.value.scrollTop = preview.clientHeight * editorScrollRatio;
};


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