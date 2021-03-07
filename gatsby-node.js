const fs = require('fs')
const ch = require('cheerio')
const processData = require('./processData')

const { diputadosXdepartamento } = processData

exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions

  const dataPreliminar = processData.epreliminar()
  const dataFinal = processData.efinal()

  const processNode = dataFile => {
    const votosTotal = dataFile.reduce((total, partido) => {
      return total + partido.votos_partido
    }, 0)

    const data01 = dataFile.map(partido => {
      const cocienteElectoral =
        votosTotal / diputadosXdepartamento[partido.segmento]
      const diputadosXcociente = Math.floor(
        partido.votos_partido / cocienteElectoral
      )
      const residuo = partido.votos_partido % cocienteElectoral
      // partido.votos_partido - diputadosXcociente * cocienteElectoral

      return Object.assign({ diputadosXcociente, residuo }, partido)
    })

    const totalDiputadosCociente = data01.reduce(
      (total, partido) => total + partido.diputadosXcociente,
      0
    )
    const diputadosFaltaAsignar =
      diputadosXdepartamento[dataFile[0].segmento] - totalDiputadosCociente

    const partidosXresiduo = [...data01]
    partidosXresiduo.sort((a, b) => b.residuo - a.residuo)
    const data02 = []
    let count = 0
    while (diputadosFaltaAsignar && count < diputadosFaltaAsignar) {
      data02.push(
        Object.assign({ diputadosXresiduo: 1 }, partidosXresiduo[count])
      )
      count++
    }

    data01.forEach(partido => {
      const currentPartido = Object.assign(
        { diputadosXresiduo: 0 },
        data02.filter(p => p.nom_partido === partido.nom_partido).pop(),
        partido
      )

      const nodeContent = JSON.stringify(currentPartido)

      const nodeMeta = {
        id: createNodeId(
          `voto2021-al-${currentPartido.publicacion}${currentPartido.segmento}-${currentPartido.nom_partido}`
        ),
        parent: null,
        children: [],
        internal: {
          type: `Voto2021`,
          content: nodeContent,
          contentDigest: createContentDigest(currentPartido),
        },
      }

      const node = Object.assign({}, currentPartido, nodeMeta)
      createNode(node)
    })
  }

  dataPreliminar.forEach(processNode)
  dataFinal.forEach(processNode)
}
