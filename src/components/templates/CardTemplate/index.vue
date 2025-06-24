<template>
    <div class="page flex flex-col">
        <template v-if="page === 1">
            <div class="flex flex-col items-center gap-2.5 mb-2.5">
                <div class="text-4xl font-bold">
                    {{ config.name }}
                </div>
                <div class="flex items-center justify-center">
                    <div
                        class="text-gray-500 not-last:after:content-[&quot;|&quot;] after:m-1.5"
                    >
                        <span>Blog:</span>
                        <a
                            href="{config.blog}"
                            target="_blank"
                            rel="noopener noreferrer"
                            >{{ config.blog }}</a
                        >
                    </div>
                    <div
                        class="text-gray-500 not-last:after:content-[&quot;|&quot;] after:m-1.5"
                    >
                        <span>Phone:</span>
                        {{ config.phone }}
                    </div>
                    <div
                        class="text-gray-500 not-last:after:content-[&quot;|&quot;] after:m-1.5"
                    >
                        <span>Location:</span>
                        {{ config.location }}
                    </div>
                </div>
            </div>
        </template>
        <div class="card-template-content-box" v-html="content"></div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
type CustomConfig = {
    name: string
    blog: string
    phone: string
    location: string
}

const defaultConfig: CustomConfig = {
    name: 'Your Name',
    blog: 'https://yourblog.com',
    phone: '123-456-7890',
    location: 'Your Location',
}

const props = defineProps({
    config: {
        type: Object,
        default: () => ({}),
    },
    content: {
        type: String,
        default: '',
    },
    page: {
        type: Number,
        default: 1,
    },
})

const config = computed(() => {
    return { ...defaultConfig, ...props.config }
})
</script>
