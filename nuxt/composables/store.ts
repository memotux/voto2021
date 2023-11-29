import type { BySegment, Segmentos } from '@/utils/types'

interface StoreState {
  segmento: Segmentos
  publicacion?: string
  publicaciones?: string[]
  segmentos?: BySegment
  votosTotal?: number
}

export const useStore = () => useState<StoreState>('store', () => ({
  segmento: 'NACIONAL'
}))