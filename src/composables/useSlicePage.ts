import { computed, type Ref, ref } from 'vue'
import { useTemplateStore } from '@/store/template'

export const useSlicePage = (target: Ref<HTMLElement | null>) => {
    const templateStore = useTemplateStore()
    const pages = ref<Element[]>()

    const renderContent = computed(
        () => pages.value?.map((page) => page.outerHTML).join('') || ''
    )

    const pageSize = computed(() => pages.value?.length || 1)

    const createPage = (children: HTMLElement[] = []) => {
        const page = document.createElement('div')
        page.className = `page print-area ${templateStore.currentConfig.className || ''}`
        children.forEach((item) => {
            page.appendChild(item)
        })
        return page
    }

    // const getElementFullHeight = (el: HTMLElement): number => {
    //     const rect = el.getBoundingClientRect()
    //     const style = window.getComputedStyle(el)

    //     const marginTop = parseFloat(style.marginTop || '0')
    //     const marginBottom = parseFloat(style.marginBottom || '0')

    //     return rect.height + marginTop + marginBottom
    // }

    const sliceElement = (element: Element): Element[] => {
        const children = Array.from(element.children)
        let currentPageElement = createPage()

        const PageSize = 1027 // A4 page height in pixels (approximate) 1123 - 48 * 2 (header and footer)

        let resetPageHeight = PageSize
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
                    resetPageHeight = PageSize - height
                    pages.push(currentPageElement) // Push the new page to the pages array
                }
            } else if (height > resetPageHeight && height <= 300) {
                currentPageElement = createPage([
                    el.cloneNode(true),
                ] as HTMLElement[]) // Create a new page
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
        const targetElement = target.value
        const newPages = sliceElement(targetElement!)
        pages.value = newPages
    }

    return {
        getSlicePage,
        pages,
        pageSize,
        renderContent,
    }
}
