const fs = require('fs')
const ch = require('cheerio')

function efinal() {
  const files = fs.readdirSync(`./data/efinal/`, {
    encoding: 'utf-8',
  })
  const theData = []

  files.forEach(file => {
    const html = fs.readFileSync(`./data/efinal/${file}`)
    const theFile = ch.load(html)

    const actualizacion = theFile('.fecha-actualizacion span').text()

    const theCards = theFile('app-detalle-votos .card').toArray()

    theCards.forEach(card => {
      const thisData = []
      const segmento =
        ch
          .load(card.children)('.card-header a[href^="https://escrutinio"]')
          .text()
          .split(' (ACTAS:')
          .shift() || 'NACIONAL'
      const tr = ch.load(card.children)('.card-body tr').toArray()

      tr.forEach(tr => {
        if (ch.load(tr.children)('td.resultados-concepto').text()) {
          const nom_partido = ch
            .load(tr.children)('td.resultados-concepto')
            .text()
          const votos_partido = parseFloat(
            ch
              .load(tr.children)('td.resultados-cantidad')
              .text()
              .replace(',', '')
          )
          if (
            ![
              'NULOS',
              'IMPUGNADOS',
              'ABSTENCIONES',
              'INUTILIZADAS',
              'SOBRANTES',
              'VOTO CRUZADO',
              'FALTANTES',
              'TOTAL N-GANA',
            ].includes(nom_partido)
          ) {
            thisData.push({
              segmento,
              nom_partido,
              votos_partido,
              publicacion: `efinal#${actualizacion}`,
            })
          }
        }
      })
      theData.push(thisData)
    })
  })
  return theData
}

function epreliminar() {
  const files = fs.readdirSync('./data/epreliminar', { encoding: 'utf-8' })

  return files.map(file => {
    const html = fs.readFileSync(`./data/epreliminar/${file}`, {
      encoding: 'utf-8',
    })
    const publicacion = file.split('-').pop().split('.')[0]

    const script = ch.load(html)('body script:nth-of-type(3)').html()
    const fecha = ch.load(html)(`option[value="${publicacion}"]`).text()

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

    return JSON.parse(data).map(partido => ({
      ...partido,
      segmento,
      publicacion: `epreliminar${fecha}`,
    }))
  })
}

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

module.exports = {
  efinal,
  epreliminar,
  diputadosXdepartamento,
}
