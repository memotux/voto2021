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
          publicacion
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

  const votosPartidoNacional = React.useRef<{ [key: string]: number }>({})
  const [vpn, setVpn] = React.useState<{ [key: string]: number }>({})

  React.useEffect(() => {
    setVpn(votosPartidoNacional.current)
  }, [votosPartidoNacional])

  return (
    <Layout>
      <SEO title="Voto 2021 | Asamblea Legislativa | Datos Preliminares" />
      <h1 className="text-center">Asamblea Legislativa | Datos Preliminares</h1>
      <h2 className="text-center">
        Total de Votos Validos: {dataNac[0].toLocaleString()}
      </h2>
      <h3 className="text-center">
        Actualizacion: {nacional.nodes[0].publicacion}
      </h3>
      <Row cols={4}>
        <Field>
          <p className="text-xs">D = Diputados</p>
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
            {/* <span className="block">CE: {dataNac[1].toLocaleString()}</span> */}
          </Field>
          {nacional.nodes.map(partido => {
            // const currentPartido: dataNode | dataNodeResiduo =
            //   dataNac[4]
            //     .filter(p => p.nom_partido === partido.nom_partido)
            //     .pop() || partido

            return (
              <Field key={`nom-partido-${partido.nom_partido}`}>
                <p>{partido.nom_partido}</p>
                <dl className="grid grid-cols-2 justify-items-center place-items-center">
                  <dt>D:</dt>
                  <dd>{vpn[partido.nom_partido]}</dd>
                  {/* <dt>DC:</dt>
                  <dd>
                    {partido.diputadosXcociente +
                      ((currentPartido as dataNodeResiduo).diputadosXresiduo ||
                        0)}
                  </dd> */}
                  <dt>VV:</dt>
                  <dd>{partido.votos_partido.toLocaleString()}</dd>
                </dl>
                {/* <span className="block">
                  {vpn && `D: ${vpn[partido.nom_partido]}`}
                </span>
                <span className="block">
                  VV: {partido.votos_partido.toLocaleString()}
                </span> */}
                {/* <span className="block">
                  {partido.diputadosXcociente +
                    ((currentPartido as dataNodeResiduo).diputadosXresiduo ||
                      0)}
                </span> */}
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
                <dl className="grid grid-cols-2 justify-items-center place-items-center">
                  <dt>DE:</dt>
                  <dd>{(data[2] + data[3]).toLocaleString()}</dd>
                  <dt>VV:</dt>
                  <dd>{data[0].toLocaleString()}</dd>
                  <dt>CE:</dt>
                  <dd>{data[1].toLocaleString()}</dd>
                </dl>
                {/* <span className="block">
                  DE: {(data[2] + data[3]).toLocaleString()}
                </span>
                <span className="block">VV: {data[0].toLocaleString()}</span>
                <span className="block">CE: {data[1].toLocaleString()}</span> */}
              </Field>
              {departamento.nodes.map(partido => {
                const currentPartido: dataNode | dataNodeResiduo =
                  data[4]
                    .filter(p => p.nom_partido === partido.nom_partido)
                    .pop() || partido

                if (
                  Object.keys(votosPartidoNacional.current).includes(
                    partido.nom_partido
                  )
                ) {
                  votosPartidoNacional.current[partido.nom_partido] +=
                    partido.diputadosXcociente +
                    ((currentPartido as dataNodeResiduo).diputadosXresiduo || 0)
                } else {
                  votosPartidoNacional.current[partido.nom_partido] =
                    partido.diputadosXcociente +
                    ((currentPartido as dataNodeResiduo).diputadosXresiduo || 0)
                }

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
