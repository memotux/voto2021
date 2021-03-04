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
    xDepartamento: { group: departmentsGroup },
    nacional: nacionalGroup,
  } = useStaticQuery<QueryAllVotos>(graphql`
    query VotoDepartamentos {
      xDepartamento: allVoto2021(
        sort: { fields: votos_partido, order: DESC }
        filter: {
          segmento: { ne: "NACIONAL" }
        }
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
      nacional: allVoto2021(
        sort: { fields: votos_partido, order: DESC }
        filter: {
          segmento: { eq: "NACIONAL" }
        }
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

  const [publicacion, setPublicacion] = React.useState('')

  const publicaciones = nacionalGroup.nodes
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

  const nacional = nacionalGroup.nodes.filter(
    partido => partido.publicacion === publicacion
  )
  const votoXdepartamentos = departmentsGroup.map(department => {
    return {
      ...department,
      nodes: department.nodes.filter(
        partido => partido.publicacion === publicacion
      ),
    }
  })

  const dataNac = processDepartmentData({
    nodes: nacional,
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
  const diputadosSegunMC = [
    {
      partido: 'N',
      diputados: 56
    },
    {
      partido: 'ARENA',
      diputados: 14
    },
    {
      partido: 'FMLN',
      diputados: 4
    },
    {
      partido: 'GANA',
      diputados: 5
    },
    {
      partido: 'PCN',
      diputados: 2
    },
    {
      partido: 'NUESTRO TIEMPO',
      diputados: 1
    },
    {
      partido: 'PDC',
      diputados: 1
    },
    {
      partido: 'VAMOS',
      diputados: 1
    },
    {
      partido: 'CD',
      diputados: 0
    },
    {
      partido: 'NP',
      diputados: 0
    },
  ]

  return (
    <Layout>
      <SEO title="Voto 2021 | Asamblea Legislativa | Datos Preliminares" />
      <h1 className="text-center">Asamblea Legislativa | Datos Preliminares</h1>
      <h2 className="text-center">
        Total de Votos Validos: {dataNac[0].toLocaleString()}
      </h2>
      <div className="sm:flex sm:justify-center sm:items-center my-4 text-center">
        <label className="sm:mr-4">Publicacion TSE:</label>
        <select
          defaultValue={publicacion}
          onChange={e => {
            setPublicacion(e.currentTarget.value)
          }}
          className="rounded-md bg-indigo-200"
        >
          {publicaciones.map(text => (
            <option key={`publicacion-${text}`} value={text}>
              {text}
            </option>
          ))}
        </select>
      </div>
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
      <h2 className="text-center">
        Diputados Electos segun Medios de Comunicacion
      </h2>
      <Row cols={diputadosSegunMC.length}>
        {
          diputadosSegunMC.map(partido => {
            retuns (
              <Field key={`nom-partido-${partido.partido}`}>
                <p>{partido.partido}</p>
                <dl className="grid grid-cols-2 justify-items-center">
                  <dt>D:</dt>
                  <dd>{partido.diputados}</dd>
                </dl>
              </Field>
            )
          })
        }
      </Row>
      <section className="grid justify-items-center place-items-center w-full divide-blue-900 divide-y-2">
        <h2 className="text-center">Diputados Electos segun Datos Preliminares TSE</h2>
        <Row cols={nacional.length + 1}>
          <Field>
            <h3>NACIONAL</h3>
            <span className="block">
              DE: {(dataNac[2] + dataNac[3]).toLocaleString()}
            </span>
          </Field>
          {nacional.map(partido => {
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
