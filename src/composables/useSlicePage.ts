import { computed, onMounted, ref, watch, nextTick, type Ref } from 'vue'
import { useTemplateStore } from '@/store/template'
import { useStyleConfigStore } from '@/store/styleConfig'
import { useMarkdownStore } from '@/store/markdown'
import { storeToRefs } from 'pinia'

export const useSlicePage = (target: Ref<HTMLElement | null>) => {
    const { currentConfig, currentTemplate } = storeToRefs(useTemplateStore())
    const { pagePadding } = storeToRefs(useStyleConfigStore())

    const { result } = storeToRefs(useMarkdownStore())
    const pages = ref<Element[]>()

    const renderList = computed(() => {
        return pages.value?.map((el) => el.innerHTML)
    })

    const pageSize = computed(() => pages.value?.length || 1)

    const getCurrentPageHeight = (page: number) => {
        return (
            currentConfig.value.getCurrentPageHeight(page) -
            pagePadding.value * 2
        )
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
            `.${currentConfig.value.className}`
        )
        const newPages = sliceElement(targetElement!)
        pages.value = newPages
    }

    // Watch for changes in the result, currentTemplate, and pagePadding
    // to re-slice the page when any of these change
    watch(
        () => [result.value, currentTemplate.value, pagePadding.value],
        () => {
            console.log(
                'Re-slicing page due to changes in result, template, or padding'
            )
            nextTick(() => {
                getSlicePage()
            })
        }
    )

    // Initial call to slice the page when the component is mounted
    onMounted(() => {
        nextTick(() => {
            getSlicePage()
        })
    })

    return {
        getSlicePage,
        pages,
        pageSize,
        renderList,
    }
}
