<template>
    <div
        class="h-screen flex flex-col bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-50 overflow-x-auto"
        style="min-width: 1440px"
    >
        <!-- 顶部栏 -->
        <Toolbar class="shadow-md px-4 bg-surface-100 dark:bg-surface-800">
            <template #start>
                <span class="text-xl font-bold tracking-wide"> md2cv</span>
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
                    <Button
                        icon="pi pi-github"
                        severity="secondary"
                        rounded
                        text
                        @click="handleLinkToGitHub"
                    />
                </div>
            </template>
        </Toolbar>

        <div class="flex flex-1 overflow-hidden">
            <SideBar :onExportPdf="handleExportPDF" />
            <Editor ref="editorRef" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SideBar from '@/components/Sidebar.vue'
import Editor from '@/components/Editor.vue'
const editorRef = ref<any>(null)
const exporting = ref(false)

const handleExportPDF = async () => {
    try {
        exporting.value = true
        await editorRef.value?.exportPDF()
    } catch (error) {
        console.error('Error during export:', error)
    } finally {
        exporting.value = false
    }
}

const handleChangeDarkMode = () => {
    document.documentElement.classList.toggle('my-app-dark')
}

const handleLinkToGitHub = () => {
    window.open('https://github.com/HJ-Hao/md2cv', '_blank')
}
</script>

<style scoped>
.hidden-target {
    visibility: hidden;
}
</style>
