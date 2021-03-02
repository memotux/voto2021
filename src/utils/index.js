export const diputadosXdepartamento = {
  "SAN SALVADOR": 24,
  "SANTA ANA": 7,
  "SAN MIGUEL": 6,
  "LA LIBERTAD": 10,
  USULUTAN: 5,
  SONSONATE: 6,
  "LA UNION": 3,
  "LA PAZ": 4,
  CHALATENANGO: 3,
  CUSCATLAN: 3,
  AHUACHAPAN: 4,
  MORAZAN: 3,
  "SAN VICENTE": 3,
  CABAÑAS: 3,
  NACIONAL: 84,
}
export function processDepartmentData({ nodes, fieldValue }) {
  const votosTotal = nodes.reduce((total, partido) => {
    return total + partido.votos_partido
  }, 0)

  const cocienteElectoral = votosTotal / diputadosXdepartamento[fieldValue]

  const totalDiputadosPorCociente = nodes.reduce((total, partido) => {
    return total + partido.diputadosXcociente
  }, 0)

  const totalDiputadosPorResiduo =
    diputadosXdepartamento[fieldValue] - totalDiputadosPorCociente

  const partidosXresiduo = [...nodes]
  partidosXresiduo.sort((a, b) => a.residuo < b.residuo)
  let partidosConDiputadosXresiduo = []
  let i = 0
  while (i < totalDiputadosPorResiduo) {
    partidosConDiputadosXresiduo.push({
      ...partidosXresiduo[i],
      diputadosXresiduo: 1,
    })
    i++
  }

  return [
    votosTotal,
    cocienteElectoral,
    totalDiputadosPorCociente,
    totalDiputadosPorResiduo,
    partidosConDiputadosXresiduo,
  ]
}
