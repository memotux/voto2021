import { graphql } from 'gatsby'
import React from 'react'
import Escrutinio from '../components/Escrutinio'
import Layout from '../components/layout'
import SEO from '../components/seo'

export interface dataNode {
  segmento: string
  publicacion?: string
  diputadosXcociente: number
  diputadosXresiduo: [number, number]
  nom_partido: string
  residuo: [number, number]
  votos_partido: number
}

export interface dataByDepartment {
  nodes: dataNode[]
  fieldValue: string
}

export interface EscrutinioData {
  data: {
    allVoto2021: {
      group: dataByDepartment[]
    }
  }
}

const EscrutinioFinal: React.FC<EscrutinioData> = ({ data }) => {
  const {
    allVoto2021: { group },
  } = data
  return (
    <>
      <Layout>
        <SEO title={`Escrutinio Final `} />
        <Escrutinio group={group} tipo="Final" />
      </Layout>
    </>
  )
}

export default EscrutinioFinal

export const eFinalQ = graphql`
  query eFinalQ {
    allVoto2021(
      sort: { fields: votos_partido, order: DESC }
      filter: { publicacion: { regex: "/^efinal/" } }
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
