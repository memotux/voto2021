import { diputadosXdepartamento } from "./index";

export type Segmentos = keyof typeof diputadosXdepartamento

export interface EFinalRequest {
  query: {
    publicacion?: string
  }
}

export interface EFinalResponse {
  data: {
    publicacion: string
    votosTotal: number
    segmentos: BySegment
    publicaciones?: string[]
  }
}

export interface ActualizacionData {
  raw: EFinalData[],
  votosTotal: number,
  bySegment: BySegment
  publicacion: string
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
  tse: number
}

export interface BySegmentData {
  raw: EFinalData[]
  votosTotal: number
  cocienteElectoral: number
  data: SegmentPartidoData[]
}

export type BySegment = Record<Segmentos, BySegmentData>

export interface TSEData {
  nodes: Partido[]
  fieldValue: string
}

export interface Partido {
  partido: string
  diputados: number
}