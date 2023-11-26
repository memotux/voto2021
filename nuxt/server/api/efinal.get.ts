import fs from 'node:fs'
import { Window } from 'happy-dom'
import { diputadosXdepartamento } from '../utils'

interface EFinalRequest {
  query: {
    fields?: string
    init?: boolean
  }
}

interface EFinalData {
  segmento: string
  nom_partido: string
  votos_partido: number
  publicacion: string
}

const files = fs.readdirSync(`../data/efinal/`, {
  encoding: 'utf-8',
})

const eFinalData = files.slice(-1).map((name) => {
  const text = fs.readFileSync(`../data/efinal/${name}`, { encoding: 'utf-8' })
  const window = new Window()
  const document = window.document
  document.write(text)

  const data = []

  const actualizacion = document.body.querySelector('.fecha-actualizacion span')?.textContent

  if (!actualizacion) return null

  const cards = document.body.querySelectorAll('app-detalle-votos .card')

  if (!cards.length) return null

  for (const card of cards) {
    const segmento = card.querySelector('.card-header a[href^="https://escrutinio"]')
      ?.textContent
      .split(' (ACTAS:')
      .shift() || 'NACIONAL'

    if (!segmento) return null

    const rows = card.querySelectorAll('.card-body tr')

    if (!rows.length) return null

    for (const row of rows) {
      const nom_partido = row.querySelector('td.resultados-concepto')?.textContent

      if (!nom_partido) continue

      if (
        [
          'NULOS',
          'IMPUGNADOS',
          'ABSTENCIONES',
          'INUTILIZADAS',
          'SOBRANTES',
          'VOTO CRUZADO',
          'FALTANTES',
          // 'TOTAL N-GANA',
          // 'TOTAL ARENA-PCN',
        ].includes(nom_partido)
      ) continue

      const votos_partido = parseFloat(
        row.querySelector('td.resultados-cantidad')
          ?.textContent
          .replace(/,/g, '') || '0'
      )

      data.push({
        segmento,
        nom_partido,
        votos_partido,
        publicacion: `efinal#${actualizacion}`
      })
    }
  }

  const votosTotal = data.reduce((total, partido) => {
    if (partido.segmento === 'NACIONAL') {
      return total + partido.votos_partido
    }
    return total
  }, 0)

  const bySegment = data.reduce<Record<string, EFinalData[]>>((acc, cur) => {
    if (cur.segmento in acc) {
      acc[cur.segmento].push(cur)
    } else {
      acc[cur.segmento] = [cur]
    }
    return acc
  }, {})

  return {
    raw: data,
    votosTotal,
    bySegment,
    publicacion: `efinal#${actualizacion}`
  }
})


export default defineEventHandler<EFinalRequest>((event) => {
  const query = getQuery(event)

  if (query.init) {
    const slice = eFinalData.slice(-1)[0]
    return {
      data: {
        publicacion: slice?.publicacion,
        votosTotal: slice?.votosTotal,
        segmentos: Object.keys(slice?.bySegment || {})
      }
    }
  }

  return {
    data: eFinalData
  }
})