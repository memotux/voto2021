import fs from 'node:fs'
import { Window } from 'happy-dom'

interface EFinalRequest {
  query: {
    publicacion?: string
  }
}

interface EFinalData {
  segmento: string
  nom_partido: string
  votos_partido: number
  publicacion: string
}

const DATA_URL = '../data/efinal/'

const files = fs.readdirSync(DATA_URL, {
  encoding: 'utf-8',
})

const eFinalData = files.map((name) => {
  const text = fs.readFileSync(`${DATA_URL}${name}`, { encoding: 'utf-8' })
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

  if (!query.publicacion) {
    const nacional = eFinalData.slice(-1)[0]
    return {
      data: {
        publicacion: nacional?.publicacion,
        votosTotal: nacional?.votosTotal,
        segmentos: nacional?.bySegment,
        publicaciones: eFinalData.map((d) => d?.publicacion)
      }
    }
  }

  const publicacion = eFinalData.find(d => d?.publicacion.endsWith(query.publicacion || ''))

  if (!publicacion) {
    throw createError({
      statusMessage: 'Bad Request. Error while finding publicacion',
      statusCode: 400
    })
  }

  return {
    data: {
      publicacion: publicacion?.publicacion,
      votosTotal: publicacion?.votosTotal,
      segmentos: publicacion?.bySegment,
    }
  }
})