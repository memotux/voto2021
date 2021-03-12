import React from 'react'
import moment from 'moment'
import { Nacional, Departamento } from '.'
import {
  diputadosSegunMC,
  diputadosXdepartamenotSegunNES,
} from '../../../data/mc'
import { dataByDepartment, dataNode } from '../../pages'
import { PDD, processDepartmentData } from '../../utils'
import Leyendas from './Leyendas'
import Selector from '../Selector'
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
  const publicaciones = React.useMemo(() => {
    return group[0].nodes
      .reduce<string[]>((acc, partido) => {
        if (partido.publicacion) {
          if (acc.includes(partido.publicacion)) return acc
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
  }, [group, tipo])

  const segmentos = React.useMemo(() => {
    return group
      .map(segmento => segmento.fieldValue)
      .sort((a, b) => (b > a ? -1 : 1))
  }, [group])

  const [segmento, setSegmento] = React.useState('NACIONAL')
  const [publicacion, setPublicacion] = React.useState(
    publicaciones[publicaciones.length - 1] as string
  )

  const dataBySegmento = React.useMemo(() => {
    return group.find(group => group.fieldValue === segmento)
  }, [group, segmento])
  const dataByPublicacion = React.useMemo(() => {
    return dataBySegmento?.nodes.filter(
      node => node.publicacion === publicacion
    )
  }, [dataBySegmento, publicacion])

  const dataNacional = React.useMemo(() => {
    return group.reduce<dataByDepartment[]>((data, group) => {
      return [
        ...data,
        {
          ...group,
          nodes: group.nodes.filter(node => node.publicacion === publicacion),
        },
      ]
    }, [])
  }, [group, publicacion])

  /**
   * Diputados a nivel Nacional por Partido
   * segun suma de Diputados por Departamento
   *
   * {[nom_partido]: number}
   */
  const dnpsd = React.useMemo(() => {
    return group.reduce<{
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
            acc[key] + partido.diputadosXcociente + partido.diputadosXresiduo
        }
      })
      return acc
    }, {})
  }, [group, publicacion])

  const dnes =
    segmento === 'NACIONAL'
      ? { nodes: diputadosSegunMC, fieldValue: 'NACIONAL' }
      : diputadosXdepartamenotSegunNES.find(
          department => department.fieldValue === segmento
        )

  const graphData = React.useMemo(() => {
    return (
      dataByPublicacion?.reduce<{ [key: string]: number[] }>(
        (data, partido) => {
          if (!dnes) return data
          if (!data[partido.nom_partido]) {
            data[partido.nom_partido] = []
          }
          data[partido.nom_partido].push(
            partido.diputadosXcociente + partido.diputadosXresiduo,
            (dnes.nodes.find(p => p.partido === partido.nom_partido)
              ?.diputados as number) || 0
          )
          return data
        },
        {}
      ) || {}
    )
  }, [dataByPublicacion])

  const graphDataNac = React.useMemo(() => {
    return (
      dataByPublicacion?.reduce<{ [key: string]: number[] }>(
        (data, partido) => {
          if (!dnpsd || !dnes) return data
          if (!data[partido.nom_partido]) {
            data[partido.nom_partido] = []
          }

          data[partido.nom_partido].push(
            ['N-GANA', 'ARENA-PCN'].includes(partido.nom_partido)
              ? dnpsd[`TOTAL ${partido.nom_partido}`]
              : dnpsd[partido.nom_partido],
            partido.diputadosXcociente + partido.diputadosXresiduo,
            (dnes.nodes.find(p => p.partido === partido.nom_partido)
              ?.diputados as number) || 0
          )
          return data
        },
        {}
      ) || {}
    )
  }, [dataByPublicacion])

  const dataSegment = React.useMemo(() => {
    return processDepartmentData({
      nodes: dataByPublicacion as dataNode[],
      fieldValue: segmento,
    })
  }, [dataByPublicacion, segmento])

  return (
    <>
      <h1 className="text-center">Escrutinio {tipo}</h1>
      <h2 className="text-center">
        Total Votos Válidos: {dataSegment[0].toLocaleString()}
      </h2>
      {React.useMemo(
        () => (
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
                defaultValue="NACIONAL"
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
                defaultValue={publicaciones[publicaciones.length - 1] as string}
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
        ),
        [group, segmentos, publicaciones]
      )}
      {
        <div className="md:w-3/5 p-2 mx-auto border border-blue-900 rounded-md my-2">
          <p>
            <span className="font-bold">Nota: </span>
            Hasta este momento, con el 89% de actas escrutadas publicadas, en
            los departamentos con coalición (Cabañas, Chalatenango, Cuscatlán,
            La Unión, San Salvador, San Vicente) los votos validos hechos a la
            Coalición o a los partidos de la Coalición, se suman en "Total
            ´Nombre Coalición´" o "Coalición ´Nombre Coalición´". Es a este
            Total al que se le asignan diputados.{' '}
          </p>
        </div>
      }
      {React.useMemo(
        () => (
          <Leyendas />
        ),
        [group]
      )}
      {segmento === 'NACIONAL' ? (
        <>
          <Graph
            graphData={{
              labels: Object.keys(graphDataNac),
              datasets: [
                {
                  label: 'D',
                  data: Object.values(graphDataNac).map(partido => partido[0]),
                  backgroundColor: 'rgba(30, 58, 138, 0.7)',
                  borderColor: 'rgba(30, 58, 138, 1)',
                  borderWith: 1,
                },
                {
                  label: 'DCR',
                  data: Object.values(graphDataNac).map(partido => partido[1]),
                  backgroundColor: 'rgba(251, 191, 36, 0.7)',
                  borderColor: 'rgba(251, 191, 36, 1)',
                  borderWith: 1,
                },
                {
                  label: 'DNES',
                  data: Object.values(graphDataNac).map(partido => partido[2]),
                  backgroundColor: 'rgba(220, 38, 38, 0.7)',
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
                  backgroundColor: 'rgba(30, 58, 138, 0.7)',
                  borderColor: 'rgba(30, 58, 138, 1)',
                  borderWith: 1,
                },
                {
                  label: 'DNES',
                  data: Object.values(graphData).map(partido => partido[1]),
                  backgroundColor: 'rgba(220, 38, 38, 0.7)',
                  borderColor: 'rgba(220, 38, 38, 1)',
                  borderWith: 1,
                },
              ],
            }}
          />
        </>
      )}
    </>
  )
}
