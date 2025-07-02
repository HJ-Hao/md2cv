import { defineComponent, computed, type PropType } from 'vue'
import BaseTemplate from '../BaseTemplate'
import { A4_PAGE_SIZE } from '@/constants'
import ResumeAvatar from '@/components/ResumeAvatar.vue'
import '@/style/templates/skylineTemplate.css'

const defaultConfig = {
    name: 'Your Name',
    phone: '123-456-7890',
    email: 'Your Email',
}

export const name = 'skylineTemplate'

const className = 'skyline-template-content-box'

export const getCurrentPageHeight = (page: number) => {
    if (page === 1) {
        return A4_PAGE_SIZE - 130
    }
    return A4_PAGE_SIZE
}

export default defineComponent({
    name: 'CardTemplate',
    components: {
        BaseTemplate,
    },
    props: {
        config: {
            type: Object as PropType<{ [key: string]: any }>,
            default: () => ({ ...defaultConfig }),
        },
        content: {
            type: String,
            default: '',
        },
        page: {
            type: Number,
            default: 1,
        },
    },
    setup(props) {
        const config = computed(() => {
            return { ...defaultConfig, ...props.config }
        })
        const slots = {
            header: () => (
                <div class="flex relative gap-2.5 mb-2.5 items-center">
                    <div class="flex flex-col flex-1 gap-2">
                        <div class="text-3xl font-bold">
                            {config.value.name}
                        </div>
                        <div class="flex items-center text-sm">
                            <div class="text-gray-500 not-last:after:content-['|'] after:m-1.5">
                                <span>电话:</span>
                                {config.value.phone}
                            </div>
                            <div class="text-gray-500 not-last:after:content-['|'] after:m-1.5">
                                <span>电子邮箱:</span>
                                {config.value.email}
                            </div>
                        </div>
                    </div>
                    <ResumeAvatar />
                </div>
            ),
        }
        return () => (
            <BaseTemplate
                v-slots={slots}
                page={props.page}
                content={props.content}
                className={className}
            />
        )
    },
})
