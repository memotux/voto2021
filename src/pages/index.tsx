import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'
import Row from '../components/Row'
import Field from '../components/Field'
import { processDepartmentData } from '../utils'

export interface dataNode {
  segmento: string
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
  xDepartamento: {
    group: dataByDepartment[]
  }
  nacional: { nodes: dataNode[] }
}

const IndexPage = () => {
  const {
    xDepartamento: { group: votoXdepartamentos },
    nacional,
  } = useStaticQuery<QueryAllVotos>(graphql`
    query VotoDepartamentos {
      xDepartamento: allVoto2021(
        sort: { fields: votos_partido, order: DESC }
        filter: { segmento: { ne: "NACIONAL" } }
      ) {
        group(field: segmento) {
          nodes {
            segmento
            diputadosXcociente
            nom_partido
            residuo
            votos_partido
          }
          fieldValue
        }
      }
      nacional: allVoto2021(
        sort: { fields: votos_partido, order: DESC }
        filter: { segmento: { eq: "NACIONAL" } }
      ) {
        nodes {
          segmento
          diputadosXcociente
          nom_partido
          residuo
          votos_partido
        }
      }
    }
  `)
  const dataNac = processDepartmentData({
    nodes: nacional.nodes,
    fieldValue: 'NACIONAL',
  })

  return (
    <Layout>
      <SEO title="Voto 2021 | Asamblea Legislativa | Datos Preliminares" />
      <h1 className="text-center">Asamblea Legislativa | Datos Preliminares</h1>
      <section className="grid justify-items-center place-items-center w-full divide-blue-900 divide-y-2">
        <h2>Total de Votos Validos: {dataNac[0].toLocaleString()}</h2>
        <Row cols={3}>
          <Field>
            <p className="text-xs">DE = Diputados a Elegir</p>
          </Field>
          <Field>
            <p className="text-xs">VV = Votos Validos</p>
          </Field>
          <Field>
            <p className="text-xs">CE = Cociente Electoral</p>
          </Field>
        </Row>
        <Row cols={nacional.nodes.length + 1}>
          <Field>
            <h3>NACIONAL</h3>
            <span className="block">
              DE: {(dataNac[2] + dataNac[3]).toLocaleString()}
            </span>
            <span className="block">CE: {dataNac[1].toLocaleString()}</span>
          </Field>
          {nacional.nodes.map(partido => {
            const currentPartido: dataNode | dataNodeResiduo =
              dataNac[4]
                .filter(p => p.nom_partido === partido.nom_partido)
                .pop() || partido

            return (
              <Field key={`nom-partido-${partido.nom_partido}`}>
                <p>{partido.nom_partido}</p>
                <span className="block">
                  {partido.diputadosXcociente +
                    ((currentPartido as dataNodeResiduo).diputadosXresiduo ||
                      0)}
                </span>
              </Field>
            )
          })}
        </Row>
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
                  DE: {(data[2] + data[3]).toLocaleString()}
                </span>
                <span className="block">VV: {data[0].toLocaleString()}</span>
                <span className="block">CE: {data[1].toLocaleString()}</span>
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
