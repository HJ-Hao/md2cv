import { computed, ref } from 'vue'
import matter from "gray-matter";
import markdownit from 'markdown-it'
import { defineStore } from 'pinia';

const md = markdownit({
    html: true,
});

export const useMarkdownStore = defineStore('counter', () => {
    const input = ref(`---\nname: your name\nblog: https://xxx.com\nphone: xx-xxx\nlocation: xx\n---\n# This is content\n使用 scoped 后，父组件的样式将不会渗透到子组件中。不过，子组件的根节点会同时被父组件的作用域样式和子组件的作用域样式影响。这样设计是为了让父组件可以从布局的角度出发，调整其子组件根元素的样式。深度选择`);

    const result = computed(() => {
        const { data, content } = matter(input.value);
        return {
            data,
            content: md.render(content)
        }
    });

    return {
        input,
        result,
    }
});