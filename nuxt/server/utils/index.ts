export const diputadosXdepartamento = {
  'SAN SALVADOR': 24,
  'SANTA ANA': 7,
  'SAN MIGUEL': 6,
  'LA LIBERTAD': 10,
  USULUTAN: 5,
  SONSONATE: 6,
  'LA UNION': 3,
  'LA PAZ': 4,
  CHALATENANGO: 3,
  CUSCATLAN: 3,
  AHUACHAPAN: 4,
  MORAZAN: 3,
  'SAN VICENTE': 3,
  CABAÑAS: 3,
  NACIONAL: 84,
}

export type Segmentos = keyof typeof diputadosXdepartamento

export interface EFinalRequest {
  query: {
    publicacion?: string
  }
}

export interface EFinalData {
  segmento: Segmentos
  nom_partido: string
  votos_partido: number
  publicacion: string
}
export interface SegmentPartidoData extends EFinalData {
  diputadosXcociente: number
  diputadosXresiduo: [number, number]
  residuo: [number, number]
}

export interface BySegmentData {
  raw: EFinalData[]
  votosTotal: number
  cocienteElectoral: number
  data: SegmentPartidoData[]
}

export type BySegment = Record<Segmentos, BySegmentData>