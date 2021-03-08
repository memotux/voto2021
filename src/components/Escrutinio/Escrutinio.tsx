import React from 'react'
import { Nacional, Departamento } from '.'
import {
  diputadosSegunMC,
  diputadosXdepartamenotSegunNES,
} from '../../../data/mc'
import { dataByDepartment, dataNode } from '../../pages'
import { PDD, processDepartmentData } from '../../utils'
import Field from '../Field'
import Layout from '../layout'
import Leyendas from './Leyendas'
import Row from '../Row'
import Selector from '../Selector'
import SEO from '../seo'

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
    .sort((a, b) => (b > a ? -1 : 1))

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

  const graphLabels = dataByPublicacion.reduce<string[]>((labels, partido) => {
    return [...labels, partido.nom_partido]
  }, [])

  const graphData = dataByPublicacion.reduce<number[]>((data, partido) => {
    const diputados = partido.diputadosXcociente + partido.diputadosXresiduo
    return [...data, diputados]
  }, [])

  const dataSegment = processDepartmentData({
    nodes: dataByPublicacion,
    fieldValue: segmento,
  })
  const dnes =
    segmento === 'NACIONAL'
      ? { nodes: diputadosSegunMC, fieldValue: 'NACIONAL' }
      : diputadosXdepartamenotSegunNES
          .filter(department => department.fieldValue === segmento)
          .pop()

  return (
    <Layout>
      <SEO title={`Escrutinio ${tipo} `} />
      <h1 className="text-center">Escrutinio {tipo}</h1>
      <h2 className="text-center">
        Total Votos Válidos: {dataSegment[0].toLocaleString()}
      </h2>
      <Row cols={2}>
        <Field>
          <label htmlFor="segmento" className="sm:mr-4">
            Segmento:
          </label>
          <Selector
            id="segmento"
            className="rounded-md bg-blue-200"
            onChange={e => setSegmento(e.currentTarget.value)}
            options={segmentos}
            defaultValue={segmento}
          />
        </Field>
        <Field>
          <label htmlFor="publicacion" className="sm:mr-4">
            Publicaciones:
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
        </Field>
      </Row>
      <Leyendas />
      {tipo === 'Final' ? (
        <p className="max-w-3xl mx-auto my-4 p-4 border border-blue-900 rounded-md">
          <span className="font-bold">Nota:</span> Al momento de hacer un
          análisis de la información presente, tomar en cuenta lo siguiente: Si
          bien se presentan datos del Escrutinio Final, consideramos que la
          cantidad de Actas Escrutadas en este momento no son suficientes para
          reflejar una tendencia en la votación.
        </p>
      ) : null}
      {segmento === 'NACIONAL' ? (
        <Nacional {...{ segmento, dataNacional, dnes, dnpsd }} />
      ) : (
        <Departamento {...{ segmento, dataByPublicacion, dataSegment, dnes }} />
      )}
    </Layout>
  )
}
