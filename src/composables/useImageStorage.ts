// useImageStorage.ts
import { ref } from 'vue'
import { set, get, del } from 'idb-keyval'

interface ImageItem {
    key: string
    url: string
    file: Blob
}

const uploadedImage = ref<ImageItem | null>(null)

const IMAGE_KEY = 'md-image-single'

export function useImageStorage() {
    const saveImage = async (file: File) => {
        await set(IMAGE_KEY, file)
        const url = URL.createObjectURL(file)
        uploadedImage.value = { key: IMAGE_KEY, file, url }
        return { key: IMAGE_KEY, url }
    }

    const loadImage = async () => {
        const file = await get(IMAGE_KEY)
        if (file instanceof Blob) {
            const url = URL.createObjectURL(file)
            uploadedImage.value = { key: IMAGE_KEY, file, url }
        }
    }

    const deleteImage = async () => {
        await del(IMAGE_KEY)
        uploadedImage.value = null
    }

    return {
        uploadedImage,
        saveImage,
        loadImage,
        deleteImage,
    }
}
