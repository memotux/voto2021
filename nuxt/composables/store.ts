import type { BySegment } from '@/server/utils'

interface StoreState {
  segmento: string
  publicacion?: string
  publicaciones?: string[]
  segmentos?: BySegment
  departamentos?: string[]
  votosTotal?: number
}

export const useStore = () => useState<StoreState>('store', () => ({
  segmento: 'NACIONAL'
}))