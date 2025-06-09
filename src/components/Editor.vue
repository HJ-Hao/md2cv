<template>
  <div class="h-screen flex flex-col bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-50 overflow-x-auto" style="min-width: 1440px;">
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
        <!-- 模板选择器 -->
        <div>
          <label class="block mb-2 text-sm font-medium">选择模板</label>
          <Dropdown
            v-model="templateStore.currentTemplate"
            :options="templateStore.templateList"
            class="w-full"
          />
        </div>
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
    </div>

    <!-- 隐藏的区域用于渲染分页 -->
    <div
      ref="renderRef"
      class="absolute top-0 left-0 -z-10 opacity-0 pointer-events-none"
      style="width: 794px;"
    >
      <component
        :is="templateStore.currentComponent"
        :config="mdStore.result.data"
        :content="mdStore.result.content"
      />
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from 'vue'
import { useSlicePage } from '@/composables/useSlicePage';
// import SimpleTemplate from '@/components/templates/SimpleTemplate/index.vue'
import { useMarkdownStore } from '@/store/markdown';
import { useTemplateStore } from '@/store/template';
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

const renderRef = ref<HTMLElement | null>(null);
const previewRef = ref<HTMLElement | null>(null);
const editorRef = ref<any>(null);
const exporting = ref(false);


const mdStore = useMarkdownStore();

const templateStore = useTemplateStore();

const { getSlicePage, renderContent } = useSlicePage(renderRef);

const handleChangeDarkMode = () => {
    document.documentElement.classList.toggle('my-app-dark');
}

const exportPDF = async () => {

    exporting.value = true

    // 等待 DOM 更新 + 样式应用完成
    await nextTick()
    const element = previewRef.value
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

// 增加锁防止重复滚动
let isSyncingFromEditor = false;
let isSyncingFromPreview = false;

const handleEditorScroll = () => {
  if (isSyncingFromPreview) {
    return;
  }
  const editor = editorRef.value?.$el as HTMLElement | null;
  const renderEl = renderRef.value;

  if (!editor || !renderEl || !previewRef.value) return;

  isSyncingFromEditor = true;

  const editorScrollRatio =
    editor.scrollTop / (editor.scrollHeight - editor.clientHeight);

  previewRef.value.scrollTop = renderEl.clientHeight * editorScrollRatio;
  
  requestAnimationFrame(() => {
    isSyncingFromEditor = false;
  });
};

const handlePreviewScroll = () => {
  if (isSyncingFromEditor) {
    return;
  }
  const editor = editorRef.value?.$el as HTMLElement | null;
  const renderEl = renderRef.value;
  const previewEl = previewRef.value;

  if (!editor || !renderEl || !previewEl) return;

  isSyncingFromPreview = true;

  // 如果预览区域滚动超过内容高度，保持编辑器滚动到底部
  if (previewEl.scrollTop + previewEl.clientHeight > renderEl.clientHeight) {
    // previewEl.scrollTop = renderEl.clientHeight;
    editor.scrollTop = editor.scrollHeight - editor.clientHeight;
  } else {
      const previewScrollRatio =
        previewEl.scrollTop / (renderEl.clientHeight - previewEl.clientHeight);

    editor.scrollTop = (editor.scrollHeight - editor.clientHeight) * previewScrollRatio; 
  }
  
  requestAnimationFrame(() => {
    isSyncingFromPreview = false;
  });
};


watch(() => [mdStore.result, templateStore.currentTemplate], () => {
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