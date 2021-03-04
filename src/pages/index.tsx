import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'
import Row from '../components/Row'
import Field from '../components/Field'
import { processDepartmentData } from '../utils'

export interface dataNode {
  segmento: string
  publicacion?: string
  diputadosXcociente: number
  diputadosXresiduo: number
  nom_partido: string
  residuo: number
  votos_partido: number
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
            diputadosXresiduo
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
          publicacion
          diputadosXcociente
          diputadosXresiduo
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

  const vpn = votoXdepartamentos.reduce<{ [key: string]: number }>(
    (acc, department) => {
      department.nodes.forEach(partido => {
        let key = partido.nom_partido
        if (!acc[key]) {
          acc[key] = 0
        }
        acc[key] =
          acc[key] + partido.diputadosXcociente + partido.diputadosXresiduo
      })
      return acc
    },
    {}
  )

  return (
    <Layout>
      <SEO title="Voto 2021 | Asamblea Legislativa | Datos Preliminares" />
      <h1 className="text-center">Asamblea Legislativa | Datos Preliminares</h1>
      <h2 className="text-center">
        Total de Votos Validos: {dataNac[0].toLocaleString()}
      </h2>
      <h3 className="text-center">
        Publicacion TSE: {nacional.nodes[0].publicacion}
      </h3>
      <Row cols={5}>
        <Field>
          <p className="text-xs">D = Diputados Electos</p>
        </Field>
        <Field>
          <p className="text-xs">DCR = Diputados por Cociente y Residuos</p>
        </Field>
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
      <section className="grid justify-items-center place-items-center w-full divide-blue-900 divide-y-2">
        <Row cols={nacional.nodes.length + 1}>
          <Field>
            <h3>NACIONAL</h3>
            <span className="block">
              DE: {(dataNac[2] + dataNac[3]).toLocaleString()}
            </span>
          </Field>
          {nacional.nodes.map(partido => {
            return (
              <Field key={`nom-partido-${partido.nom_partido}`}>
                <p>{partido.nom_partido}</p>
                <dl className="grid grid-cols-2 justify-items-center">
                  <dt>D:</dt>
                  <dd>{vpn[partido.nom_partido]}</dd>
                  <dt>DCR:</dt>
                  <dd>
                    {partido.diputadosXcociente + partido.diputadosXresiduo}
                  </dd>
                  {/* <dt>R:</dt>
                  <dd>{partido.residuo.toLocaleString()}</dd> */}
                  <dt>VV:</dt>
                  <dd>{partido.votos_partido.toLocaleString()}</dd>
                </dl>
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
                <dl className="grid grid-cols-2">
                  <dt>DE:</dt>
                  <dd>{(data[2] + data[3]).toLocaleString()}</dd>
                  <dt>VV:</dt>
                  <dd>{data[0].toLocaleString()}</dd>
                  <dt>CE:</dt>
                  <dd>{data[1].toLocaleString()}</dd>
                </dl>
              </Field>
              {departamento.nodes.map(partido => {
                return (
                  <Field key={`nom-partido-${partido.nom_partido}`}>
                    <p>{partido.nom_partido}</p>
                    <dl className="grid grid-cols-2">
                      <dt>D:</dt>
                      <dd>
                        {partido.diputadosXcociente + partido.diputadosXresiduo}
                      </dd>
                      {/* <dt>R:</dt>
                      <dd>{partido.residuo.toLocaleString()}</dd>
                      <dt>VV:</dt>
                      <dd>{partido.votos_partido.toLocaleString()}</dd> */}
                    </dl>
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
