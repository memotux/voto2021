interface StoreState {
  segmento: string
  publicacion?: string
  publicaciones?: string[]
  segmentos?: Array<Record<string, {
    segmento: string
    nom_partido: string
    votos_partido: number
    publicacion: string
  }>>
  departamentos?: string[]
  votosTotal?: number
}

export const useStore = () => useState<StoreState>('store', () => ({
  segmento: 'NACIONAL'
}))