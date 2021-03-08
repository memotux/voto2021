import { graphql } from 'gatsby'
import React from 'react'
import { EscrutinioData } from '.'
import Escrutinio from '../components/Escrutinio'

const EscrutinioPreliminar: React.FC<EscrutinioData> = ({ data }) => {
  const {
    allVoto2021: { group },
  } = data
  return <Escrutinio group={group} tipo="Preliminar" />
}

export default EscrutinioPreliminar

export const ePreliminarQ = graphql`
  query ePreliminarQ {
    allVoto2021(
      sort: { fields: votos_partido, order: DESC }
      filter: { publicacion: { regex: "/^epreliminar/" } }
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
