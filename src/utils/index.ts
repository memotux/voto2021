import { dataByDepartment, dataNodeResiduo } from '../pages'

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

type PDD = [
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
