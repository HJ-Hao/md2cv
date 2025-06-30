import { defineComponent, computed, type PropType } from 'vue'
import BaseTemplate from '../BaseTemplate'
import ResumeAvatar from '@/components/ResumeAvatar.vue'
import { A4_PAGE_SIZE } from '@/constants'
import './index.css'

const defaultConfig = {
    name: 'Your Name',
    blog: 'https://yourblog.com',
    phone: '123-456-7890',
    location: 'Your Location',
}

export const name = 'SimpleTemplate'

const className = 'simple-template-content-box'

export const getCurrentPageHeight = (page: number) => {
    if (page === 1) {
        return A4_PAGE_SIZE - 120
    }
    return A4_PAGE_SIZE
}

export default defineComponent({
    name: 'SimpleTemplate',
    components: {
        BaseTemplate,
        ResumeAvatar,
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
                    <div class="flex flex-col flex-1 gap-5">
                        <div class="text-4xl font-bold">
                            {config.value.name}
                        </div>
                        <div class="flex items-center">
                            <div class="text-gray-500 not-last:after:content-['|'] after:m-1.5">
                                <span>Blog:</span>
                                <a
                                    href="javascript:void(0)"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {config.value.blog}
                                </a>
                            </div>
                            <div class="text-gray-500 not-last:after:content-['|'] after:m-1.5">
                                <span>Phone:</span>
                                {config.value.phone}
                            </div>
                            <div class="text-gray-500 not-last:after:content-['|'] after:m-1.5">
                                <span>Location:</span>
                                {config.value.location}
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
