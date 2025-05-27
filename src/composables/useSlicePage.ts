import { computed, type Ref, ref } from "vue";

export const useSlicePage = (target: Ref<HTMLElement | null>) => {
    const pages = ref<Element[]>();

    const renderContent = computed(() => pages.value?.map((page) => page.outerHTML).join('') || '');

    const createPage = (children: HTMLElement[] = []) => {
        const page = document.createElement("div");
        page.className = "page content-box";
        children.forEach((item) => {
            page.appendChild(item);
        });
        return page;
    };

    const splitTextForPagination = (text: string) => {
        // 可以按句号、换行符或其他规则拆分
        return text
            .split(/(?<=[。；；.!?？])/g) // 拆分中英文标点
            .map(s => s.trim())
            .filter(Boolean)
            .map(s => s + '\n')
    };

    const sliceElement = (element: Element): Element[] => {
        const children = Array.from(element.children);
        let currentPageElement = createPage();
        console.log(currentPageElement, 'currentPageElement')

        let resetPageHeight = 800;
        let currentHeight = 0;
        // let currentItems: HTMLElement[] = [];
        const pages = [currentPageElement];
        while (children.length > 0) {
            const el = children.shift() as HTMLElement;
            const height = el.getBoundingClientRect().height;
            // console.log(resetPageHeight, height, currentHeight, height > resetPageHeight);
            if (height > resetPageHeight && height >= 400) {
                const subChildren = Array.from(el.children);
                if (subChildren.length !== 0) {
                    children.unshift(...subChildren);
                } else {
                    currentPageElement = createPage([el.cloneNode(true)]); // Create a new page
                    resetPageHeight = 800 - height; // Reset the height for the next page
                    pages.push(currentPageElement);
                }
            }
            else {
                currentPageElement.appendChild(el.cloneNode(true) as HTMLElement);
                resetPageHeight -= height;

                if (resetPageHeight <= 20) {
                    resetPageHeight = 800; // Reset the height for the next page
                    currentPageElement = createPage(); // Create a new page
                    // If there are no more children, push the last page
                    pages.push(currentPageElement);
                }
            }
        }

        console.log("pages", pages);

        return pages;
    };

    const getSlicePage = () => {
        const targetElement = target.value;
        // console.log("targetElement", targetElement);
        // const children = Array.from(targetElement?.children || []);
        // console.log("children", children);
        const newPages = sliceElement(targetElement!);
        // console.log("totalHeight", currentHeight);
        console.log("newPages", newPages);
        pages.value = newPages;
        // console.log("pages.value", pages.value?.map((page) => page.outerHTML).join('') || '');
        // render.value!.innerHTML = '';
        // render.value?.append(...newPages);
    };
    return {
        getSlicePage,
        pages,
        renderContent
    }
};
