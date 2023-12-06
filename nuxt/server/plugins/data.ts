import { Window } from 'happy-dom'
import { diputadosXdepartamento } from "@/utils/index";
import type { Segmentos, BySegment, BySegmentData, EFinalData, SegmentPartidoData, ActualizacionData, TSEData } from "@/utils/types";

export default defineNitroPlugin(async () => {
  try {
    const dataKeys = await useStorage<string>('data:efinal').getKeys()
    const efinal = dataKeys.filter(k => k.startsWith('efinal'))
    // const epreliminar = dataKeys.filter(k => k.startsWith('epreliminar'))
    const mcText = await useStorage<{ diputadosTSE: TSEData[] }>('data:efinal').getItem('mc.json')

    if (!mcText) {
      throw createError('No MC Data')
    }

    const { diputadosTSE } = mcText

    const dataValues = await Promise.all(efinal.map(async (k) => {
      const text = await useStorage<string>('data:efinal').getItem(k)
      if (!text) {
        throw createError(`Publicacion ${k} Data not exist.`)
      }
      const data = generateFinalData(text, diputadosTSE)
      if (!data) {
        throw createError(`Error generating data: ${k}`)
      }
      return data
    }))

    useStorage().setItem<ActualizacionData[]>('values:efinal', dataValues)
  } catch (error) {
    console.error(error);
  }

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

const generateFinalData = (text: string, tse: TSEData[]): ActualizacionData | null => {
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
      ?.split(' (ACTAS:')
      .shift() as Segmentos

    if (!segmento) continue

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
          ?.replace(/,/g, '') || '0'
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
    if (partido.nom_partido === 'TOTAL N-GANA' || partido.nom_partido === 'TOTAL ARENA-PCN') {
      return total
    }
    return total + partido.votos_partido
  }, 0)

  const getSegments = data.reduce<Record<Segmentos, BySegmentData['raw']>>((acc, cur) => {
    if (cur.segmento in acc) {
      acc[cur.segmento as Segmentos].push(cur)
    } else {
      acc[cur.segmento as Segmentos] = [cur]
    }
    return acc
  }, {} as Record<Segmentos, EFinalData[]>)

  const bySegment: BySegment = {
    'NACIONAL': {
      raw: [],
      votosTotal,
      cocienteElectoral: votosTotal / diputadosXdepartamento['NACIONAL'],
      data: []
    },
    'SAN SALVADOR': {
      raw: [],
      votosTotal,
      cocienteElectoral: 0,
      data: []
    },
    'SANTA ANA': {
      raw: [],
      votosTotal,
      cocienteElectoral: 0,
      data: []
    },
    'SAN MIGUEL': {
      raw: [],
      votosTotal,
      cocienteElectoral: 0,
      data: []
    },
    'LA LIBERTAD': {
      raw: [],
      votosTotal,
      cocienteElectoral: 0,
      data: []
    },
    USULUTAN: {
      raw: [],
      votosTotal,
      cocienteElectoral: 0,
      data: []
    },
    SONSONATE: {
      raw: [],
      votosTotal,
      cocienteElectoral: 0,
      data: []
    },
    'LA UNION': {
      raw: [],
      votosTotal,
      cocienteElectoral: 0,
      data: []
    },
    'LA PAZ': {
      raw: [],
      votosTotal,
      cocienteElectoral: 0,
      data: []
    },
    CHALATENANGO: {
      raw: [],
      votosTotal,
      cocienteElectoral: 0,
      data: []
    },
    CUSCATLAN: {
      raw: [],
      votosTotal,
      cocienteElectoral: 0,
      data: []
    },
    AHUACHAPAN: {
      raw: [],
      votosTotal,
      cocienteElectoral: 0,
      data: []
    },
    MORAZAN: {
      raw: [],
      votosTotal,
      cocienteElectoral: 0,
      data: []
    },
    'SAN VICENTE': {
      raw: [],
      votosTotal,
      cocienteElectoral: 0,
      data: []
    },
    CABAÑAS: {
      raw: [],
      votosTotal,
      cocienteElectoral: 0,
      data: []
    },
  }

  for (const segment of Object.entries(getSegments)) {
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
        tse: tse.find(d => d.fieldValue === segmento)?.nodes.find(p => p.partido === partido.nom_partido)?.diputados || 0,
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

    for (const partido of segmentPartidosData) {
      if (diputadosFaltaAsignar[0] === 0) break

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
    }

    segmentPartidosData.sort((a, b) => b.residuo[1] - a.residuo[1])

    for (const partido of segmentPartidosData) {
      if (!diputadosFaltaAsignar[1]) break

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
    }

    segmentPartidosData.sort((a, b) => b.votos_partido - a.votos_partido)

    /**
     * NACIONAL Segment
     */
    for (const partido of segmentPartidosData) {
      if (partido.nom_partido === 'N-GANA' || partido.nom_partido === 'ARENA-PCN') {
        continue
      }
      const nom = partido.nom_partido.startsWith('TOTAL') ? partido.nom_partido.split(' ').pop() || partido.nom_partido : partido.nom_partido

      const idx = bySegment['NACIONAL'].data.findIndex(p => p.nom_partido === nom)

      if (idx === -1) {
        bySegment['NACIONAL'].data.push({
          ...partido,
          segmento: 'NACIONAL',
          nom_partido: nom
        })
        continue
      }

      const cur = bySegment['NACIONAL'].data[idx]
      bySegment['NACIONAL'].data[idx] = {
        ...cur,
        votos_partido: cur.votos_partido + partido.votos_partido,
        diputadosXcociente: cur.diputadosXcociente + partido.diputadosXcociente,
        diputadosXresiduo: [
          cur.diputadosXresiduo[0] + partido.diputadosXresiduo[0],
          cur.diputadosXresiduo[1] + partido.diputadosXresiduo[1]
        ],
        residuo: [
          cur.residuo[0] + partido.diputadosXresiduo[0],
          cur.residuo[1] + partido.diputadosXresiduo[1]
        ],
      }
    }

    /**
     * Data por segmento
     */
    bySegment[segmento] = {
      raw: data,
      votosTotal,
      cocienteElectoral,
      data: segmentPartidosData
    }
  }

  for (const partido of bySegment['NACIONAL'].data) {
    partido.tse = tse.find(d => d.fieldValue === 'NACIONAL')?.nodes.find(p => p.partido === partido.nom_partido)?.diputados || 0
  }

  bySegment['NACIONAL'].data.sort((a, b) => (b.diputadosXcociente + b.diputadosXresiduo[1]) - (a.diputadosXcociente + a.diputadosXresiduo[1]))

  /**
   * Data por actualizacion (archivo)
   */
  return {
    raw: data,
    votosTotal,
    bySegment,
    publicacion: `efinal#${actualizacion}`
  }
}