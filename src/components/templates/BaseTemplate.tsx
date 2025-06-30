import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { A4_PAGE_SIZE } from '@/constants'
import { useStyleConfigStore } from '@/store/styleConfig'

// function that calculate page content height based on page number
export const getCurrentPageHeight = (page: number) => {
    // minus 120px for the first page to account for header height
    if (page === 1) {
        return A4_PAGE_SIZE - 120
    }
    return A4_PAGE_SIZE
}

// base component to reuse in other cv templates
export default defineComponent({
    name: 'BaseTemplate',
    props: {
        content: {
            type: String,
            default: '',
        },
        page: {
            type: Number,
            default: 1,
        },
        className: {
            type: String,
            default: '',
        },
    },
    setup(props, { slots }) {
        const { pagePadding, fontSize } = storeToRefs(useStyleConfigStore())
        return () => (
            <div
                class="page flex flex-col"
                style={{
                    '--page-padding': pagePadding.value + 'px',
                    '--page-font-size': fontSize.value + 'px',
                }}
            >
                {props.page === 1 && (slots.header ? slots.header() : '')}
                <div
                    class={`${props.className} template-content`}
                    innerHTML={props.content}
                ></div>
            </div>
        )
    },
})
