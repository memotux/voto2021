/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

import Header from './header'
import './layout.css'

const Layout: React.FC = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />

      <main className="mx-auto max-w-7xl p-4">{children}</main>

      <footer className="mt-8 bg-blue-900 text-white text-center p-4">
        <p className="text-xs">
          NINGUNO DE LOS DATOS OFRECIDOS PUEDEN SER CONSIDERADOS COMO OFICIALES.
          Todo los datos utilizados son obtenidos de la página web del{' '}
          <a
            href="https://elecciones2021.tse.gob.sv"
            rel="nofollow noopener"
            target="_blank"
          >
            TSE
          </a>{' '}
          los cuales se encuentran en la carpeta "data/" y "dataArchive/". Este
          es un esfuerzo hecho dentro del ejercicio los derechos civiles del
          autor así como de sus publicadores.
        </p>
        <p className="text-xs">
          Presentamos al público general nuestras consideraciones ante los datos
          publicados tanto por el{' '}
          <a
            href="https://elecciones2021.tse.gob.sv"
            rel="nofollow noopener"
            target="_blank"
          >
            TSE
          </a>{' '}
          como los medios de comunicación nacionales. Al hacer uso de las
          publicaciones de resultados preliminares, especialmente para Asamblea
          Legislativa, hemos encontrado: 1. Que se han utlizado los datos a
          nivel nacional de la publicacion: #1097 - 01/03/2021 08:34:00 PM 2.
          Que al hacer un calculo de Cociente y Residuos sobre el dato nacional,
          la cantidad de diputados electos difiere del total de diputados
          electos por departamento. 3. Los diferentes medios de comunicación han
          publicado, llevando a un error a la población electora, que N tiene 56
          diputados y ARENA 14 diputados. 4. Cuando se hace la sumatoria de
          diputados electos por departamento, esta reflea que N tiene 60
          diputados y ARENA 10 diputados. Todo esto ha hecho caer en un error a
          la poblacion electora y por lo tanto nuestro único interés es
          informarla debidamente.
        </p>
        <p>
          Codigo Fuente:{' '}
          <a
            href="https://github.com/memotux/voto2021"
            rel="nofollow noopener"
            target="_blank"
          >
            GitHub
          </a>
        </p>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer>
    </>
  )
}

export default Layout
