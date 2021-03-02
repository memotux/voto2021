const fs = require("fs")
const ch = require("cheerio")

const diputadosXdepartamento = {
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

exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions

  const dataFiles = fs.readdirSync("./data/", { encoding: "utf-8" })

  dataFiles.forEach(dataFile => {
    const file = fs.readFileSync(`./data/${dataFile}`, { encoding: "utf-8" })

    const script = ch.load(file)("body script:nth-of-type(3)").html()

    if (!script) return

    const data = script
      .split(/\n/g)[5]
      .trimStart()
      .replace(";", "")
      .split("=")[1]
      .trim()

    const departamento = script
      .split(/\n/g)[2]
      .trimStart()
      .split("=")[1]
      .trim()
      .replace(/'/g, "")

    const parseData = JSON.parse(data)

    const votosTotal = parseData.reduce((total, partido) => {
      return total + partido.votos_partido
    }, 0)

    const cocienteElectoral =
      votosTotal / diputadosXdepartamento[departamento || "NACIONAL"]

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
        departamento,
      })

      const nodeMeta = {
        id: createNodeId(`voto2021-al-${departamento}-${partido.nom_partido}`),
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
          departamento,
        },
        nodeMeta
      )
      createNode(node)
    })
  })
}
