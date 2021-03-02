const fs = require("fs")
const ch = require("cheerio")

exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions

  const file = fs.readFileSync("./voto2021-al.html", { encoding: "utf-8" })

  const script = ch.load(file)("body script:nth-of-type(3)").html()

  if (!script) return

  const data = script
    .split(/\n/g)[3]
    .trimStart()
    .replace(";", "")
    .split("=")[1]
    .trim()

  const ALxPartido = JSON.parse(data)

  const votosTotal = ALxPartido.reduce((total, partido) => {
    return total + partido.votos_partido
  }, 0)

  const cocienteElectoral = votosTotal / 84

  ALxPartido.forEach(partido => {
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
    })

    const nodeMeta = {
      id: createNodeId(`voto2021-al-${partido.nom_partido}`),
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
      },
      nodeMeta
    )
    createNode(node)
  })
}
