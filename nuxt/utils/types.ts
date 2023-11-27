import { diputadosXdepartamento } from "./index";

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