import { type Ref, nextTick } from 'vue'

export const EditorInsertType = {
    HEADING: 1,
    LIST: 2,
    BOLD: 3,
    ITALIC: 4,
    LAYOUT: 5,
} as const

type EditorInsertTypeValue =
    (typeof EditorInsertType)[keyof typeof EditorInsertType]

type TemplateFnReturnType = {
    text: string
    newPos: number
}
type TemplateFn = (selectedText: string, pos: number) => TemplateFnReturnType

const EditorInsertTemplate: Record<EditorInsertTypeValue, TemplateFn> = {
    [EditorInsertType.HEADING]: (selectedText: string, pos: number) => {
        return {
            text: `# ${selectedText}`,
            newPos: pos + 2 + selectedText.length,
        }
    },
    [EditorInsertType.LIST]: (selectedText: string, pos: number) => {
        return {
            text: `- ${selectedText}`,
            newPos: pos + 2 + selectedText.length,
        }
    },
    [EditorInsertType.BOLD]: (selectedText: string, pos: number) => {
        return {
            text: `**${selectedText}**`,
            newPos: pos + 2 + selectedText.length,
        }
    },
    [EditorInsertType.ITALIC]: (selectedText: string, pos: number) => {
        return {
            text: `*${selectedText}*`,
            newPos: pos + 1 + selectedText.length,
        }
    },
    [EditorInsertType.LAYOUT]: (selectedText: string, pos: number) => {
        const text = `::::::row
:::col
${selectedText || 'left side content'}
:::

:::col
right side content
:::
::::::`
        return {
            text,
            newPos: pos + 18,
        }
    },
}

export const useEditorInsert = (editor: Ref<any>, content: Ref<string>) => {
    const insert = (insertType: EditorInsertTypeValue) => {
        const el = editor.value?.$el
        const start = el.selectionStart
        const end = el.selectionEnd
        const selectedText = content.value.substring(start, end)
        const before = content.value.substring(0, start)
        const after = content.value.substring(end)

        const { newPos, text } = EditorInsertTemplate[insertType](
            selectedText,
            start
        )

        content.value = before + text + after

        nextTick(() => {
            el.setSelectionRange(newPos, newPos)
            el.focus()
        })
    }

    return {
        insert,
    }
}
