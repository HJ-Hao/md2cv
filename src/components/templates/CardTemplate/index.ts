import { A4_PAGE_SIZE } from '@/constants'

export const name = 'CardTemplate'

export const className = 'card-template-content-box'

export const getCurrentPageHeight = (page: number) => {
    if (page === 1) {
        return A4_PAGE_SIZE - 80
    }
    return A4_PAGE_SIZE
}
