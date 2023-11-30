import fs from 'node:fs'
import { Window } from 'happy-dom'
import { diputadosXdepartamento } from "@/utils/index";
import type { Segmentos, BySegment, BySegmentData, EFinalData, EFinalRequest, SegmentPartidoData } from "@/utils/types";

const DATA_URL = '/Volumes/tuxevo/voto2021/nuxt/server/data/efinal/'

const files = fs.readdirSync(DATA_URL, {
  encoding: 'utf-8',
})

function excludeVotosFromTotal(segmento: Segmentos, partido: string) {
  return [
    'SAN VICENTE',
    'CABAÑAS',
    'CHALATENANGO',
    'CUSCATLAN',
    'LA UNION',
  ].includes(segmento) &&
    ['N', 'GANA', 'N-GANA', 'ARENA-PCN'].includes(partido)
}

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
  }, {} as Record<Segmentos, EFinalData[]>)

  const bySegment = Object.entries(getSegments).reduce<BySegment>((acc, segment) => {
    const [segmento, data] = segment as [Segmentos, EFinalData[]]
    /**
     * Total de votos por segmento
     */
    const votosTotal = data.reduce((total, partido) => {
      if (
        excludeVotosFromTotal(segmento, partido.nom_partido)
      ) {
        return total
      }
      return total + partido.votos_partido
    }, 0)
    /**
     * Cociente Electoral del segmento
     */
    const cocienteElectoral = votosTotal / diputadosXdepartamento[segmento]

    /**
     * Data por partido en el segmento
     */
    const segmentPartidosData: SegmentPartidoData[] = data.map((partido) => {
      /**
       * Diputados por cociente por partido en el segmento
       */
      let diputadosXcociente = Math.floor(partido.votos_partido / cocienteElectoral)

      if (excludeVotosFromTotal(partido.segmento, partido.nom_partido)) {
        diputadosXcociente = 0
      }

      /**
       * Residuo por partido en el segmento
       */
      let residuo = [partido.votos_partido % cocienteElectoral, partido.votos_partido % cocienteElectoral] as [number, number]
      if (excludeVotosFromTotal(partido.segmento, partido.nom_partido)) {
        residuo = [partido.votos_partido % cocienteElectoral, 0]
      }
      if (['TOTAL N-GANA', 'TOTAL ARENA-PCN'].includes(partido.nom_partido)) {
        residuo = [0, partido.votos_partido % cocienteElectoral]
      }

      /**
       * Data por partido en el segmento
       */
      return {
        ...partido,
        diputadosXcociente,
        residuo,
        diputadosXresiduo: [0, 0]
      }
    })

    const totalDiputadosPorCociente = segmentPartidosData.reduce((total, partido) => {
      if (partido.diputadosXcociente === 0) return total
      if (excludeVotosFromTotal(partido.segmento, partido.nom_partido)) {
        return [total[0] + partido.diputadosXcociente, total[1]]
      }
      if (['TOTAL N-GANA', 'TOTAL ARENA-PCN'].includes(partido.nom_partido)) {
        return [total[0], total[1] + partido.diputadosXcociente]
      }
      return [
        total[0] + partido.diputadosXcociente,
        total[1] + partido.diputadosXcociente,
      ]
    }, [0, 0])

    const diputadosFaltaAsignar = [
      diputadosXdepartamento[segmento] - Math.floor(totalDiputadosPorCociente[0]),
      diputadosXdepartamento[segmento] - Math.floor(totalDiputadosPorCociente[1]),
    ]

    segmentPartidosData.sort((a, b) => b.residuo[0] - a.residuo[0])

    segmentPartidosData.forEach((partido) => {
      if (diputadosFaltaAsignar[0]) {
        if (
          ['TOTAL N-GANA', 'TOTAL ARENA-PCN'].includes(
            partido.nom_partido
          )
        ) {
          partido.diputadosXresiduo[0] = 0
        } else {
          partido.diputadosXresiduo[0] =
            Math.ceil(partido.residuo[0] / cocienteElectoral)
        }

        diputadosFaltaAsignar[0] -= partido.diputadosXresiduo[0]
      }
    })

    segmentPartidosData.sort((a, b) => b.residuo[1] - a.residuo[1])

    segmentPartidosData.forEach((partido) => {
      if (diputadosFaltaAsignar[1]) {
        if (
          excludeVotosFromTotal(partido.segmento, partido.nom_partido)
        ) {
          partido.diputadosXresiduo[1] = 0
        } else {
          partido.diputadosXresiduo[1] =
            Math.ceil(partido.residuo[1] / cocienteElectoral)
        }

        diputadosFaltaAsignar[1] -= partido.diputadosXresiduo[1]
      }
    })

    segmentPartidosData.sort((a, b) => b.votos_partido - a.votos_partido)

    /**
     * Data por segmento
     */
    acc[segmento] = {
      raw: data,
      votosTotal,
      cocienteElectoral,
      data: segmentPartidosData
    }

    return acc
  }, {} as BySegment)

  /**
   * Data por actualizacion (archivo)
   */
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