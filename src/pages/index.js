import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

// const numberFormat = number => {
//   return parseFloat(new Intl.NumberFormat().format(number))
// }

const IndexPage = () => {
  const {
    allVoto2021: { nodes: partidosAl },
  } = useStaticQuery(graphql`
    query MyQuery {
      allVoto2021(sort: { fields: votos_partido, order: DESC }) {
        nodes {
          nom_partido
          votos_partido
          diputadosXcociente
          residuo
        }
      }
    }
  `)

  const votosTotal = partidosAl.reduce((total, partido) => {
    return total + partido.votos_partido
  }, 0)
  const cocienteElectoral = votosTotal / 84
  const totalDiputadosPorCociente = partidosAl.reduce((total, partido) => {
    return total + partido.diputadosXcociente
  }, 0)
  const totalDiputadosPorResiduo = 84 - totalDiputadosPorCociente
  const partidosXresiduo = partidosAl.sort((a, b) => a.residuo < b.residuo)
  let partidosConDiputadosXresiduo = []
  let i = 0
  while (i <= totalDiputadosPorResiduo) {
    partidosConDiputadosXresiduo.push({
      ...partidosXresiduo[i],
      diputadosXresiduo: 1,
    })
    i++
  }

  return (
    <Layout>
      <SEO title="Votacion 2021 | Asamblea Legislativa" />
      <section
        style={{
          display: "grid",
          justifyItems: "center",
          alignContent: "center",
          width: "100%",
        }}
      >
        <h2>Total de Votos: {votosTotal.toLocaleString()}</h2>
        <h2>Cociente Electoral: {cocienteElectoral.toLocaleString()}</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "1rem",
            justifyItems: "center",
            alignContent: "center",
            width: "100%",
            padding: "2rem",
          }}
        >
          <p style={{ fontWeight: "bold" }}>#</p>
          <p style={{ fontWeight: "bold" }}>Partido</p>
          <p style={{ fontWeight: "bold" }}>Votos</p>
          <p style={{ fontWeight: "bold" }}>Diputados (C)</p>
          <p style={{ fontWeight: "bold" }}>Residuo</p>
          <p style={{ fontWeight: "bold" }}>Diputados (R)</p>
          <p style={{ fontWeight: "bold" }}>Total</p>
        </div>
        {partidosAl.map((partido, i) => {
          // const diputadosXresiduo = Math.floor(
          //   partido.residuo / cocienteElectoral
          // )
          const currentPartido =
            partidosConDiputadosXresiduo
              .filter(p => p.nom_partido === partido.nom_partido)
              .pop() || partido
          return (
            <div
              key={currentPartido.nom_partido}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                justifyItems: "center",
                width: "100%",
                alignContent: "center",
                padding: "2rem",
                borderBottom: "1px solid gray",
              }}
            >
              <p>{i + 1}</p>
              <p style={{ margin: "1rem" }}>{currentPartido.nom_partido}</p>
              <p style={{ margin: "1rem" }}>
                {currentPartido.votos_partido.toLocaleString()}
              </p>
              <p style={{ margin: "1rem" }}>
                {currentPartido.diputadosXcociente}
              </p>
              <p style={{ margin: "1rem" }}>
                {currentPartido.residuo.toLocaleString()}
              </p>
              <p style={{ margin: "1rem" }}>
                {currentPartido.diputadosXresiduo}
              </p>
              <p style={{ margin: "1rem" }}>
                {currentPartido.diputadosXcociente +
                  currentPartido.diputadosXresiduo}
              </p>
            </div>
          )
        })}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "1rem",
            justifyItems: "center",
            alignContent: "center",
            width: "100%",
            padding: "2rem",
          }}
        >
          <p></p>
          <p></p>
          <p></p>
          <p>{totalDiputadosPorCociente}</p>
          <p></p>
          <p>{totalDiputadosPorResiduo}</p>
          <p>{totalDiputadosPorCociente + totalDiputadosPorResiduo}</p>
        </div>
      </section>
    </Layout>
  )
}

export default IndexPage
