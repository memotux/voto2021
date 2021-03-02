import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'
import Row from '../components/Row'
import Field from '../components/Field'
import { processDepartmentData } from '../utils'

export interface dataNode {
  departamento: string
  diputadosXcociente: number
  nom_partido: string
  residuo: number
  votos_partido: number
}

export interface dataNodeResiduo extends dataNode {
  diputadosXresiduo: number
}

export interface dataByDepartment {
  nodes: dataNode[]
  fieldValue: string
}

interface QueryAllVotos {
  allVoto2021: {
    group: dataByDepartment[]
  }
}

const IndexPage = () => {
  const {
    allVoto2021: { group: votoXdepartamentos },
  } = useStaticQuery<QueryAllVotos>(graphql`
    query VotoDepartamentos {
      allVoto2021(sort: { fields: votos_partido, order: DESC }) {
        group(field: departamento) {
          nodes {
            departamento
            diputadosXcociente
            nom_partido
            residuo
            votos_partido
          }
          fieldValue
        }
      }
    }
  `)

  return (
    <Layout>
      <SEO title="Votacion 2021 | Asamblea Legislativa | Datos Preliminares" />
      <h1 className="text-center">Asamblea Legislativa | Datos Preliminares</h1>
      <section className="grid justify-items-center place-items-center w-full divide-blue-900 divide-y-2">
        {/* <h2>Total de Votos: {votosTotal.toLocaleString()}</h2>
        <h2>Cociente Electoral: {cocienteElectoral.toLocaleString()}</h2> */}
        {votoXdepartamentos.map(departamento => {
          const data = processDepartmentData(departamento)

          return (
            <Row
              key={`votacion-${departamento.fieldValue}`}
              cols={departamento.nodes.length + 1}
            >
              <Field>
                <h3>{departamento.fieldValue}</h3>
                <span className="block">
                  {(data[2] + data[3]).toLocaleString()}
                </span>
                <span className="block">{data[0].toLocaleString()}</span>
                <span className="block">{data[1].toLocaleString()}</span>
              </Field>
              {departamento.nodes.map(partido => {
                const currentPartido: dataNode | dataNodeResiduo =
                  data[4]
                    .filter(p => p.nom_partido === partido.nom_partido)
                    .pop() || partido

                return (
                  <Field key={`nom-partido-${partido.nom_partido}`}>
                    <p>{partido.nom_partido}</p>
                    <span className="block">
                      {partido.diputadosXcociente +
                        ((currentPartido as dataNodeResiduo)
                          .diputadosXresiduo || 0)}
                    </span>
                  </Field>
                )
              })}
            </Row>
          )
        })}
      </section>
    </Layout>
  )
}

export default IndexPage
