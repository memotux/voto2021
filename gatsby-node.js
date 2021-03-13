const { epreliminar, efinal, diputadosXdepartamento } = require('./processData')

exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions

  const processNode = dataFile => {
    const votosTotal = dataFile.reduce((total, partido) => {
      if (
        [
          'SAN VICENTE',
          'CABAÑAS',
          'CHALATENANGO',
          'CUSCATLAN',
          'LA UNION',
        ].includes(partido.segmento) &&
        ['N', 'GANA', 'N-GANA', 'ARENA-PCN'].includes(partido.nom_partido)
      ) {
        return total
      } else {
        return total + partido.votos_partido
      }
    }, 0)

    const cocienteElectoral =
      votosTotal / diputadosXdepartamento[dataFile[0].segmento]

    const data01 = dataFile.map(partido => {
      if (
        [
          'SAN VICENTE',
          'CABAÑAS',
          'CHALATENANGO',
          'CUSCATLAN',
          'LA UNION',
        ].includes(partido.segmento) &&
        ['N', 'GANA', 'N-GANA', 'ARENA-PCN'].includes(partido.nom_partido)
      ) {
        const diputadosXcociente = Math.floor(
          partido.votos_partido / cocienteElectoral
        )
        const residuo = [partido.votos_partido % cocienteElectoral, 0]
        // partido.votos_partido - diputadosXcociente * cocienteElectoral

        return Object.assign({ diputadosXcociente, residuo }, partido)
      } else if (
        ['TOTAL N-GANA', 'TOTAL ARENA-PCN'].includes(partido.nom_partido)
      ) {
        const diputadosXcociente = Math.floor(
          partido.votos_partido / cocienteElectoral
        )
        const residuo = [0, partido.votos_partido % cocienteElectoral]
        // partido.votos_partido - diputadosXcociente * cocienteElectoral

        return Object.assign({ diputadosXcociente, residuo }, partido)
      } else {
        const diputadosXcociente = Math.floor(
          partido.votos_partido / cocienteElectoral
        )
        const residuo = [
          partido.votos_partido % cocienteElectoral,
          partido.votos_partido % cocienteElectoral,
        ]
        // partido.votos_partido - diputadosXcociente * cocienteElectoral

        return Object.assign({ diputadosXcociente, residuo }, partido)
      }
    })

    const totalDiputadosCociente = data01.reduce(
      (total, partido) => {
        if (partido.diputadosXcociente === 0) return total
        if (
          [
            'SAN VICENTE',
            'CABAÑAS',
            'CHALATENANGO',
            'CUSCATLAN',
            'LA UNION',
          ].includes(partido.segmento) &&
          ['N', 'GANA', 'N-GANA', 'ARENA-PCN'].includes(partido.nom_partido)
        ) {
          return [total[0] + partido.diputadosXcociente, total[1]]
        } else if (
          ['TOTAL N-GANA', 'TOTAL ARENA-PCN'].includes(partido.nom_partido)
        ) {
          return [total[0], total[1] + partido.diputadosXcociente]
        } else {
          return [
            total[0] + partido.diputadosXcociente,
            total[1] + partido.diputadosXcociente,
          ]
        }
      },
      [0, 0]
    )
    const diputadosFaltaAsignar = [
      diputadosXdepartamento[dataFile[0].segmento] - totalDiputadosCociente[0],
      diputadosXdepartamento[dataFile[0].segmento] - totalDiputadosCociente[1],
    ]

    const partidosXresiduo = [...data01]
    partidosXresiduo.sort((a, b) => b.residuo[0] - a.residuo[0])
    const data02 = {}
    let count = 0
    while (diputadosFaltaAsignar[0] && count < diputadosFaltaAsignar[0]) {
      if (!data02[partidosXresiduo[count].nom_partido]) {
        data02[partidosXresiduo[count].nom_partido] = [0, 0]
      }
      if (
        ['TOTAL N-GANA', 'TOTAL ARENA-PCN'].includes(
          partidosXresiduo[count].nom_partido
        )
      ) {
        data02[partidosXresiduo[count].nom_partido][0] = 0
      } else {
        data02[partidosXresiduo[count].nom_partido][0] =
          data02[partidosXresiduo[count].nom_partido][0] + 1
      }
      count++
    }

    partidosXresiduo.sort((a, b) => b.residuo[1] - a.residuo[1])
    count = 0

    while (diputadosFaltaAsignar[1] && count < diputadosFaltaAsignar[1]) {
      if (!data02[partidosXresiduo[count].nom_partido]) {
        data02[partidosXresiduo[count].nom_partido] = [0, 0]
      }
      if (
        [
          'SAN VICENTE',
          'CABAÑAS',
          'CHALATENANGO',
          'CUSCATLAN',
          'LA UNION',
        ].includes(partidosXresiduo[count].segmento) &&
        ['N', 'GANA', 'N-GANA', 'ARENA-PCN'].includes(
          partidosXresiduo[count].nom_partido
        )
      ) {
        data02[partidosXresiduo[count].nom_partido][1] = 0
      } else {
        data02[partidosXresiduo[count].nom_partido][1] =
          data02[partidosXresiduo[count].nom_partido][1] + 1
      }
      count++
    }

    data01.forEach(partido => {
      const currentPartido = Object.assign(
        { diputadosXresiduo: data02[partido.nom_partido] || [0, 0] },
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

  epreliminar().forEach(processNode)
  efinal().forEach(processNode)
}
