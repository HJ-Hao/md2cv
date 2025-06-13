import markdownit from 'markdown-it'
import Container from 'markdown-it-container'

const md = markdownit({
    html: true,
})

// 注册两个自定义容器
md.use(Container, 'row', {
    render(tokens: any[], idx: number) {
        console.log(tokens[idx])
        return tokens[idx].nesting === 1 ? `<div class="row">\n` : `</div>\n`
    },
})

md.use(Container, 'col', {
    render(tokens: any, idx: number) {
        console.log(tokens[idx])
        return tokens[idx].nesting === 1 ? `<div class="col">\n` : `</div>\n` // 注意这里结束整个 two-column
    },
})

export default md
