import fs from 'node:fs'
import { Window } from 'happy-dom'
import { diputadosXdepartamento } from "@/utils/index";
import type { Segmentos, BySegment, BySegmentData, EFinalData, EFinalRequest, SegmentPartidoData } from "@/utils/types";

const DATA_URL = '../data/efinal/'

const files = fs.readdirSync(DATA_URL, {
  encoding: 'utf-8',
})

const eFinalData = files.map((name) => {
  const text = fs.readFileSync(`${DATA_URL}${name}`, { encoding: 'utf-8' })
  const window = new Window()
  const document = window.document
  document.write(text)

  const data: EFinalData[] = []

  const actualizacion = document.body.querySelector('.fecha-actualizacion span')?.textContent

  if (!actualizacion) return null

  const cards = document.body.querySelectorAll('app-detalle-votos .card')

  if (!cards.length) return null

  for (const card of cards) {
    const segmento = card.querySelector('.card-header a[href^="https://escrutinio"]')
      ?.textContent
      .split(' (ACTAS:')
      .shift() as Segmentos || 'NACIONAL'

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

  const getSegments = data.reduce<Record<Segmentos, BySegmentData['raw']>>((acc, cur) => {
    if (cur.segmento in acc) {
      acc[cur.segmento as Segmentos].push(cur)
    } else {
      acc[cur.segmento as Segmentos] = [cur]
    }
    return acc
  }, {} as Record<Segmentos, BySegmentData['raw']>)

  const bySegment = Object.entries(getSegments).reduce<BySegment>((acc, segment) => {
    const [segmento, data] = segment as [Segmentos, EFinalData[]]
    const votosTotal = data.reduce((total, partido) => {
      return total + partido.votos_partido
    }, 0)
    const cocienteElectoral = votosTotal / diputadosXdepartamento[segmento]

    const segmentPartidosData: SegmentPartidoData[] = data.map((partido) => {
      const diputadosXcociente = partido.votos_partido / cocienteElectoral
      const residuo = [partido.votos_partido % cocienteElectoral, 0] as [number, number]

      return {
        ...partido,
        diputadosXcociente,
        residuo,
        diputadosXresiduo: [0, 0]
      }
    })

    acc[segmento] = {
      raw: data,
      votosTotal,
      cocienteElectoral,
      data: segmentPartidosData
    }

    return acc
  }, {} as BySegment)

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
    const latest = eFinalData.slice(-1)[0]
    return {
      data: {
        publicacion: latest?.publicacion,
        votosTotal: latest?.votosTotal,
        segmentos: latest?.bySegment,
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