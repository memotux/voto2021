interface StoreState {
  segmento: string
  publicacion?: string
  publicaciones?: string[]
  segmentos?: string[]
  votosTotal?: number
}

export const useStore = () => useState<StoreState>('store', () => ({
  segmento: 'NACIONAL'
}))