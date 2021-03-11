import { dataByDepartment } from '../pages'

export const diputadosXdepartamento: { [key: string]: number } = {
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

export type PDD = [
  votosTotal: number,
  cocienteElectoral: number,
  totalDiputadosPorCociente: number,
  totalDiputadosPorResiduo: number
]

export function processDepartmentData({
  nodes,
  fieldValue,
}: dataByDepartment): PDD {
  const votosTotal = nodes.reduce((total, partido) => {
    if (
      [
        'SAN VICENTE',
        'CABAÑAS',
        'CHALATENANGO',
        'CUSCATLAN',
        'LA UNION',
      ].includes(partido.segmento) &&
      ['N', 'GANA', 'N-GANA', 'ARENA-PCN'].includes(partido.nom_partido) &&
      partido.publicacion?.includes('efinal')
    ) {
      return total
    }
    return total + partido.votos_partido
  }, 0)

  const cocienteElectoral = votosTotal / diputadosXdepartamento[fieldValue]

  const totalDiputadosPorCociente = nodes.reduce((total, partido) => {
    return total + partido.diputadosXcociente
  }, 0)

  const totalDiputadosPorResiduo =
    diputadosXdepartamento[fieldValue] - totalDiputadosPorCociente

  return [
    votosTotal,
    cocienteElectoral,
    totalDiputadosPorCociente,
    totalDiputadosPorResiduo,
  ]
}
