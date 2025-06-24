import { computed, type Ref, ref } from 'vue'
import { useTemplateStore } from '@/store/template'
import { A4_PAGE_SIZE } from '@/constants'

export const useSlicePage = (target: Ref<HTMLElement | null>) => {
    const templateStore = useTemplateStore()
    const pages = ref<Element[]>()

    const renderList = computed(() => {
        return pages.value?.map((el) => el.innerHTML)
    })

    const pageSize = computed(() => pages.value?.length || 1)

    const PADDING = 48

    const getCurrentPageHeight = (page: number) => {
        if (templateStore.currentConfig.getCurrentPageHeight) {
            return (
                templateStore.currentConfig.getCurrentPageHeight(page) -
                PADDING * 2
            )
        }
        return A4_PAGE_SIZE - PADDING * 2
    }

    const createPage = (children: HTMLElement[] = []) => {
        const page = document.createElement('div')
        children.forEach((item) => {
            page.appendChild(item)
        })
        return page
    }

    const sliceElement = (element: Element): Element[] => {
        const children = Array.from(element.children)
        let currentPage = 1
        let currentPageElement = createPage()

        let PageSize = getCurrentPageHeight(currentPage) // A4 page height in pixels (approximate) 1123 - 48 * 2 (header and footer)

        let resetPageHeight = PageSize // A4 page height in pixels (approximate) 1123 - 48 * 2 (header and footer)
        const pages = [currentPageElement]
        while (children.length > 0) {
            const el = children.shift() as HTMLElement
            // Need Improve: height no margin
            const height = el.getBoundingClientRect().height

            // if the element is taller than the page size, split it
            if (height > PageSize) {
                const subChildren = Array.from(el.children)
                if (subChildren.length > 0) {
                    children.unshift(...subChildren)
                } else {
                    pages.push(
                        createPage([el.cloneNode(true)] as HTMLElement[])
                    ) // Create a new page for the oversized element
                    currentPage += 1
                    PageSize = getCurrentPageHeight(currentPage)
                    resetPageHeight = PageSize
                    currentPageElement = createPage()
                    pages.push(currentPageElement) // Push the new page to the pages array
                }

                continue // Skip to the next element
            }

            if (height > resetPageHeight && height > 300) {
                const subChildren = Array.from(el.children)
                if (subChildren.length > 0) {
                    children.unshift(...subChildren)
                } else {
                    currentPageElement = createPage([
                        el.cloneNode(true),
                    ] as HTMLElement[]) // Create a new page
                    currentPage += 1
                    PageSize = getCurrentPageHeight(currentPage)
                    resetPageHeight = PageSize - height
                    pages.push(currentPageElement) // Push the new page to the pages array
                }
            } else if (height > resetPageHeight && height <= 300) {
                currentPageElement = createPage([
                    el.cloneNode(true),
                ] as HTMLElement[]) // Create a new page
                currentPage += 1
                PageSize = getCurrentPageHeight(currentPage)
                resetPageHeight = PageSize - height
                pages.push(currentPageElement) // Push the new page to the pages array
            } else {
                currentPageElement.appendChild(
                    el.cloneNode(true) as HTMLElement
                )
                resetPageHeight -= height
            }
        }

        return pages
    }

    const getSlicePage = () => {
        // select content element
        const targetElement = target.value?.querySelector(
            `.${templateStore.currentConfig.className}`
        )
        const newPages = sliceElement(targetElement!)
        pages.value = newPages
    }

    return {
        getSlicePage,
        pages,
        pageSize,
        renderList,
    }
}
