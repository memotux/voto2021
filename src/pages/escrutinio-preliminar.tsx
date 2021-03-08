import { graphql } from 'gatsby'
import React from 'react'
import Layout from '../components/layout'
import SEO from '../components/seo'

interface EPreliminarData {
  data: {
    allVoto2021: {
      groups: {
        nodes: {
          segmento: string
          publicacion: string
          diputadosXcociente: number
          diputadosXresiduo: number
          nom_partido: string
          residuo: number
          votos_partido: number
        }[]
        fieldValue: string
      }[]
    }
  }
}

const EscrutinioPreliminar: React.FC<EPreliminarData> = ({ data }) => {
  const {
    allVoto2021: { groups },
  } = data

  const [segmento, setSegmento] = React.useState('NACIONAL')
  const [publicacion, setPublicacion] = React.useState('')

  const publicaciones = groups[0].nodes
    .reduce<string[]>((acc, partido) => {
      if (partido.publicacion) {
        if (acc.includes(partido.publicacion)) return [...acc]
        return [...acc, partido.publicacion]
      }
      return acc
    }, [])
    .sort((a, b) => (b > a ? -1 : 1))

  if (!publicacion) {
    setPublicacion(publicaciones.pop() as string)
  }

  const [dataBySegmento] = groups.filter(group => group.fieldValue === segmento)
  const dataByPublicacion = dataBySegmento.nodes.filter(
    node => node.publicacion === publicacion
  )
  
  const graphLabels = dataByPublicacion.reduce((labels, partido) => {
    return [...labels, partido.nom_partido]
  }, [])
  
  const graphData = dataByPublicacion.reduce((data, partido) => {
    const diputados = partido.diputadosXcociente + diputadosXresiduo
    return [...data, diputados]
  }, [])

  return (
    <Layout>
      <SEO title="Escrutinio Preliminar | " />
      <h1>Escrutinio Preliminar</h1>
      // Selectors
    </Layout>
  )
}

export default EscrutinioPreliminar

export const ePreliminarQ = graphql`
  query VotoDepartamentos {
    allVoto2021(
      sort: { fields: votos_partido, order: DESC }
      filter: { publicacion: { regex: /^epreliminar/ } }
    ) {
      group(field: segmento) {
          nodes {
            segmento
            publicacion
            diputadosXcociente
            diputadosXresiduo
            nom_partido
            residuo
            votos_partido
          }
          fieldValue
        }
    }
  }
`
