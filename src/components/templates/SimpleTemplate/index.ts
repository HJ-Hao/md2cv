import { A4_PAGE_SIZE } from '@/constants'

export const name = 'SimpleTemplate'

export const className = 'simple-template-content-box'

export const getCurrentPageHeight = (page: number) => {
    if (page === 1) {
        return A4_PAGE_SIZE - 120
    }
    return A4_PAGE_SIZE
}
