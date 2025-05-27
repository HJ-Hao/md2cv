<template>
  <div class="space-y-4">
    <!-- <Button label="导出 PDF" icon="pi pi-file-pdf" @click="exportPDF" /> -->

    <!-- <div class="flex flex-col items-center space-y-4">
      <div
        v-for="(html, index) in paginatedHtml"
        :key="index"
        class="bg-white page-preview"
      >
        <component :is="template" :html="html" />
      </div>
    </div> -->
    <div class="flex flex-col items-center space-y-4">
      <div
        v-for="(page, index) in paginatedHtml"
        :key="index"
        class="bg-white text-black shadow border p-6 page-preview"
      >
        <div v-html="page" class="prose max-w-none"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'

const props = defineProps({
  contentHtml: { type: String, required: true },
  template: { type: [Object, Function, String], required: true },
})

const paginatedHtml = ref([])

const paginate = async () => {
  await nextTick()

  const temp = document.createElement('div')
  temp.innerHTML = props.contentHtml
  temp.className = 'prose max-w-none p-6'
  temp.style.width = '794px'
  temp.style.visibility = 'hidden'
  temp.style.position = 'absolute'
  document.body.appendChild(temp)

  const pages = []
  const contentHeight = 1123 // A4 px

  let top = 0
  while (top < temp.scrollHeight) {
    const clone = temp.cloneNode(true)
    clone.scrollTop = top
    clone.style.transform = `translateY(-${top}px)`
    clone.style.height = `${contentHeight}px`
    clone.style.overflow = 'hidden'
    pages.push(clone.innerHTML)
    top += contentHeight
  }

  paginatedHtml.value = pages
  document.body.removeChild(temp)
}

watch(() => props.contentHtml, paginate, { immediate: true })

// const exportPDF = async () => {
//   const pdf = new jsPDF('p', 'mm', 'a4')
//   for (let i = 0; i < paginatedHtml.value.length; i++) {
//     const pageEl = document.createElement('div')
//     pageEl.innerHTML = paginatedHtml.value[i]
//     pageEl.className = 'prose max-w-none p-6'
//     document.body.appendChild(pageEl)

//     const canvas = await html2canvas(pageEl, {
//       scale: 2,
//       useCORS: true,
//     })

//     const img = canvas.toDataURL()
//     const props = pdf.getImageProperties(img)
//     const width = pdf.internal.pageSize.getWidth()
//     const height = (props.height * width) / props.width

//     if (i > 0) pdf.addPage()
//     pdf.addImage(img, 'PNG', 0, 0, width, height)
//     document.body.removeChild(pageEl)
//   }
//   pdf.save('resume.pdf')
// }
</script>

<style scoped>
.page-preview {
  width: 794px;
  height: 1123px;
  overflow: hidden;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
