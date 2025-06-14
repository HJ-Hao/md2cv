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
        page.className = `page ${templateStore.currentConfig.className || ''}`
        children.forEach((item) => {
            page.appendChild(item)
        })
        return page
    }

    const sliceElement = (element: Element): Element[] => {
        const children = Array.from(element.children)
        let currentPageElement = createPage()
        console.log(
            currentPageElement.getBoundingClientRect().height,
            'currentPageElement'
        )

        const PageSize = 1027 // A4 page height in pixels (approximate) 1123 - 48 * 2 (header and footer)

        let resetPageHeight = PageSize
        const pages = [currentPageElement]
        while (children.length > 0) {
            const el = children.shift() as HTMLElement
            const height = el.getBoundingClientRect().height

            // if the element is taller than the page size, split it
            if (height > PageSize) {
                const subChildren = Array.from(el.children)
                if (subChildren.length > 0) {
                    children.unshift(...subChildren)
                }
                // else if (el.tagName.toLowerCase() === 'p' || el.tagName.toLowerCase() === 'div') {
                //     children.unshift(...splitTextNode(el));
                // }
                else {
                    pages.push(
                        createPage([el.cloneNode(true)] as HTMLElement[])
                    ) // Create a new page for the oversized element
                    resetPageHeight = PageSize
                    currentPageElement = createPage()
                    pages.push(currentPageElement) // Push the new page to the pages array
                }

                continue // Skip to the next element
            }

            console.log(
                el.tagName,
                'height',
                height,
                'resetPageHeight',
                resetPageHeight
            )

            if (height > resetPageHeight) {
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

        // console.log("pages", pages);

        return pages
    }

    const getSlicePage = () => {
        const targetElement = target.value
        console.log('targetElement', targetElement)
        // console.log("targetElement", targetElement);
        // const children = Array.from(targetElement?.children || []);
        // console.log("children", children);
        const newPages = sliceElement(targetElement!)
        // console.log("totalHeight", currentHeight);
        console.log('newPages', newPages)
        pages.value = newPages
        // console.log("pages.value", pages.value?.map((page) => page.outerHTML).join('') || '');
        // render.value!.innerHTML = '';
        // render.value?.append(...newPages);
    }
    return {
        getSlicePage,
        pages,
        pageSize,
        renderContent,
    }
}
