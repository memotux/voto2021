import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Row from "../components/Row"
import Field from "../components/Field"
import { processDepartmentData } from "../utils"

const IndexPage = () => {
  const {
    allVoto2021: { group: votoXdepartamentos },
  } = useStaticQuery(graphql`
    query MyQuery {
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
      <section
        style={{
          display: "grid",
          justifyItems: "center",
          alignContent: "center",
          width: "100%",
        }}
      >
        <h1>Asamblea Legislativa | Datos Preliminares</h1>
        {/* <h2>Total de Votos: {votosTotal.toLocaleString()}</h2>
        <h2>Cociente Electoral: {cocienteElectoral.toLocaleString()}</h2> */}
        {votoXdepartamentos.map(departamento => {
          const data = processDepartmentData(departamento)

          return (
            <Row
              key={`votacion-${departamento.fieldValue}`}
              cols={departamento.nodes.length + 1}
            >
              <h3>{departamento.fieldValue}</h3>
              {departamento.nodes.map(partido => {
                const currentPartido =
                  data[4]
                    .filter(p => p.nom_partido === partido.nom_partido)
                    .pop() || partido
                return (
                  <Field key={`nom-partido-${partido.nom_partido}`}>
                    <h4>{partido.nom_partido}</h4>
                    <span style={{ display: "block" }}>
                      {partido.diputadosXcociente +
                        (currentPartido.diputadosXresiduo || 0)}
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
