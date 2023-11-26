interface StoreState {
  segmento: string
  publicacion?: string
  publicaciones?: string[]
  segmentos?: string[]
}

export const useStore = () => useState<StoreState>('store', () => ({
  segmento: 'NACIONAL'
}))