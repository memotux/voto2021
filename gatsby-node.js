const fs = require('fs')
const ch = require('cheerio')

const diputadosXdepartamento = {
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

exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions

  const dataFiles = fs.readdirSync('./data/', { encoding: 'utf-8' })
  const publicacion = dataFiles[0].split('-')[3].split('.')[0]

  dataFiles.forEach(dataFile => {
    const file = fs.readFileSync(`./data/${dataFile}`, { encoding: 'utf-8' })

    const script = ch.load(file)('body script:nth-of-type(3)').html()
    const fecha = ch.load(file)(`option[value="${publicacion}"]`).text()

    if (!script) return

    const data = script
      .split(/\n/g)
      .filter(v => v.search('dataGraph =') >= 0)
      .pop()
      .trimStart()
      .replace(';', '')
      .split('=')[1]
      .trim()

    const segmento = script
      .split(/\n/g)
      .filter(v => v.search('otroTipo =') >= 0)
      .pop()
      ? script
          .split(/\n/g)
          .filter(v => v.search('otroTipo =') >= 0)
          .pop()
          .trimStart()
          .split('=')[1]
          .trim()
          .replace(/'/g, '')
      : 'NACIONAL'

    const parseData = JSON.parse(data)

    const votosTotal = parseData.reduce((total, partido) => {
      return total + partido.votos_partido
    }, 0)

    const cocienteElectoral = votosTotal / diputadosXdepartamento[segmento]

    parseData.forEach(partido => {
      const diputadosXcociente = Math.floor(
        partido.votos_partido / cocienteElectoral
      )
      const residuo = parseFloat(
        (
          (partido.votos_partido - diputadosXcociente * cocienteElectoral) /
          cocienteElectoral
        ).toLocaleString()
      )
      const nodeContent = JSON.stringify({
        ...partido,
        diputadosXcociente,
        residuo,
        segmento,
        publicacion: fecha,
      })

      const nodeMeta = {
        id: createNodeId(`voto2021-al-${segmento}-${partido.nom_partido}`),
        parent: null,
        children: [],
        internal: {
          type: `Voto2021`,
          content: nodeContent,
          contentDigest: createContentDigest(partido),
        },
      }

      const node = Object.assign(
        {},
        {
          ...partido,
          diputadosXcociente,
          residuo,
          segmento,
          publicacion: fecha,
        },
        nodeMeta
      )
      createNode(node)
    })
  })
}
