import React from 'react'
import moment from 'moment'
import { Nacional, Departamento } from '.'
import {
  diputadosSegunMC,
  diputadosXdepartamenotSegunNES,
} from '../../../data/mc'
import { dataByDepartment, dataNode } from '../../pages'
import { PDD, processDepartmentData } from '../../utils'
import Layout from '../layout'
import Leyendas from './Leyendas'
import Selector from '../Selector'
import SEO from '../seo'
import Graph from './Graph'

export interface EscrutinioProps {
  segmento: string
  dataByPublicacion?: dataNode[]
  dataNacional?: { nodes: dataNode[]; fieldValue: string }[]
  dataSegment?: PDD
  dnpsd?: {
    [key: string]: number
  } | null
  dnes:
    | {
        nodes: {
          partido: string
          diputados: number
        }[]
        fieldValue: string
      }
    | undefined
}

export const Escrutinio: React.FC<{
  group: dataByDepartment[]
  tipo: 'Final' | 'Preliminar'
}> = ({ group, tipo }) => {
  const publicaciones = group[0].nodes
    .reduce<string[]>((acc, partido) => {
      if (partido.publicacion) {
        if (acc.includes(partido.publicacion)) return [...acc]
        return [...acc, partido.publicacion]
      }
      return acc
    }, [])
    .sort((a, b) => {
      if (tipo === 'Final') {
        const dateA = moment(a.replace('efinal#', ''), 'DD/MM/YYYY LT').unix()
        const dateB = moment(b.replace('efinal#', ''), 'DD/MM/YYYY LT').unix()

        return dateA - dateB
      }
      return b > a ? -1 : 1
    })

  const segmentos = group
    .map(segmento => segmento.fieldValue)
    .sort((a, b) => (b > a ? -1 : 1))

  const [segmento, setSegmento] = React.useState('NACIONAL')
  const [publicacion, setPublicacion] = React.useState(
    publicaciones[publicaciones.length - 1] as string
  )

  const [dataBySegmento] = group.filter(group => group.fieldValue === segmento)
  const dataByPublicacion = dataBySegmento.nodes.filter(
    node => node.publicacion === publicacion
  )

  const dataNacional = group.reduce<dataByDepartment[]>((data, group) => {
    return [
      ...data,
      {
        ...group,
        nodes: group.nodes.filter(node => node.publicacion === publicacion),
      },
    ]
  }, [])

  /**
   * Diputados a nivel Nacional por Partido
   * segun suma de Diputados por Departamento
   *
   * {[nom_partido]: number}
   */
  const dnpsd =
    segmento === 'NACIONAL'
      ? group.reduce<{
          [key: string]: number
        }>((acc, department) => {
          department.nodes.forEach(partido => {
            if (
              partido.publicacion === publicacion &&
              partido.segmento !== 'NACIONAL'
            ) {
              let key = partido.nom_partido
              if (!acc[key]) {
                acc[key] = 0
              }
              acc[key] =
                acc[key] +
                partido.diputadosXcociente +
                partido.diputadosXresiduo
            }
          })
          return acc
        }, {})
      : null

  const dnes =
    segmento === 'NACIONAL'
      ? { nodes: diputadosSegunMC, fieldValue: 'NACIONAL' }
      : diputadosXdepartamenotSegunNES
          .filter(department => department.fieldValue === segmento)
          .pop()

  const graphData = dataByPublicacion.reduce<{ [key: string]: number[] }>(
    (data, partido) => {
      if (!dnes) return data
      if (!data[partido.nom_partido]) {
        data[partido.nom_partido] = []
      }
      data[partido.nom_partido].push(
        partido.diputadosXcociente + partido.diputadosXresiduo,
        (dnes.nodes.filter(p => p.partido === partido.nom_partido).pop()
          ?.diputados as number) || 0
      )
      return data
    },
    {}
  )

  const graphDataNac = dataByPublicacion.reduce<{ [key: string]: number[] }>(
    (data, partido) => {
      if (!dnpsd || !dnes) return data
      if (!data[partido.nom_partido]) {
        data[partido.nom_partido] = []
      }

      data[partido.nom_partido].push(
        dnpsd[partido.nom_partido],
        partido.diputadosXcociente + partido.diputadosXresiduo,
        (dnes.nodes.filter(p => p.partido === partido.nom_partido).pop()
          ?.diputados as number) || 0
      )
      return data
    },
    {}
  )

  const dataSegment = processDepartmentData({
    nodes: dataByPublicacion,
    fieldValue: segmento,
  })

  return (
    <Layout>
      <SEO title={`Escrutinio ${tipo} `} />
      <h1 className="text-center">Escrutinio {tipo}</h1>
      <h2 className="text-center">
        Total Votos Válidos: {dataSegment[0].toLocaleString()}
      </h2>
      <div
        className={`sm:grid sm:justify-items-center sm:place-items-center w-full p-4 sm:overflow-x-auto sm:space-x-4`}
        style={{ gridTemplateColumns: `repeat(2, minmax(150px, 1fr))` }}
      >
        <div className="text-center mb-2 sm:mb-0">
          <label htmlFor="segmento" className="block lg:inline sm:mr-4">
            Selecciona Departamento:
          </label>
          <Selector
            id="segmento"
            className="rounded-md bg-blue-200"
            onChange={e => setSegmento(e.currentTarget.value)}
            options={segmentos}
            defaultValue={segmento}
          />
        </div>
        <div className="text-center">
          <label htmlFor="publicacion" className="block lg:inline sm:mr-4">
            Selecciona Publicación:
          </label>
          <Selector
            id="publicacion"
            className="rounded-md bg-blue-200"
            onChange={e => setPublicacion(e.currentTarget.value)}
            defaultValue={publicacion}
            options={publicaciones.map(publicacion => {
              const textToReplace =
                tipo === 'Preliminar' ? 'epreliminar' : 'efinal#'
              return {
                value: publicacion,
                text: publicacion.replace(textToReplace, ''),
              }
            })}
          />
        </div>
      </div>
      {tipo === 'Final' ? (
        <p className="max-w-3xl mx-auto my-4 p-4 border border-blue-900 rounded-md">
          <span className="font-bold">Nota:</span> El{' '}
          <a
            href="https://escrutinio2021.tse.gob.sv"
            target="_blank"
            rel="noopener noreferrer"
          >
            TSE
          </a>{' '}
          hasta este momento ha publicado solo el 55% de la Actas Escrutadas por
          las mesas del Escrutinio Final, por lo que consideramos que los datos
          presentados no son suficientes para establecer una tendencia en la
          votación.
        </p>
      ) : null}
      <Leyendas />
      {segmento === 'NACIONAL' ? (
        <>
          <Graph
            graphData={{
              labels: Object.keys(graphDataNac),
              datasets: [
                {
                  label: 'D',
                  data: Object.values(graphDataNac).map(partido => partido[0]),
                  backgroundColor: 'rgba(30, 58, 138, 0.3)',
                  borderColor: 'rgba(30, 58, 138, 1)',
                  borderWith: 1,
                },
                {
                  label: 'DCR',
                  data: Object.values(graphDataNac).map(partido => partido[1]),
                  backgroundColor: 'rgba(251, 191, 36, 0.3)',
                  borderColor: 'rgba(251, 191, 36, 1)',
                  borderWith: 1,
                },
                {
                  label: 'DNES',
                  data: Object.values(graphDataNac).map(partido => partido[2]),
                  backgroundColor: 'rgba(220, 38, 38, 0.3)',
                  borderColor: 'rgba(220, 38, 38, 1)',
                  borderWith: 1,
                },
              ],
            }}
          />
          <Nacional {...{ segmento, dataNacional, dnes, dnpsd }} />
        </>
      ) : (
        <>
          <Departamento
            {...{ segmento, dataByPublicacion, dataSegment, dnes }}
          />
          <Graph
            graphData={{
              labels: Object.keys(graphData),
              datasets: [
                {
                  label: 'D',
                  data: Object.values(graphData).map(partido => partido[0]),
                  backgroundColor: 'rgba(30, 58, 138, 0.3)',
                  borderColor: 'rgba(30, 58, 138, 1)',
                  borderWith: 1,
                },
                {
                  label: 'DNES',
                  data: Object.values(graphData).map(partido => partido[1]),
                  backgroundColor: 'rgba(220, 38, 38, 0.3)',
                  borderColor: 'rgba(220, 38, 38, 1)',
                  borderWith: 1,
                },
              ],
            }}
          />
        </>
      )}
    </Layout>
  )
}
