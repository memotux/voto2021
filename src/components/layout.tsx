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
        <div className="md:max-w-3xl mx-auto">
          <p className="text-xs">
            NINGUNO DE LOS DATOS OFRECIDOS PUEDEN SER CONSIDERADOS COMO
            OFICIALES. Todo los datos utilizados son obtenidos de la página web
            del TSE Escrutinios{' '}
            <a
              href="https://elecciones2021.tse.gob.sv"
              rel="nofollow noopener"
              target="_blank"
            >
              Preliminar
            </a>{' '}
            y{' '}
            <a
              href="https://escrutinio2021.tse.gob.sv"
              rel="nofollow noopener"
              target="_blank"
            >
              Final
            </a>{' '}
            los cuales se encuentran en la carpeta "data/" y "dataArchive/".
            Este es un esfuerzo hecho dentro del ejercicio los derechos civiles
            del autor así como de sus publicadores.
          </p>
          <p className="text-xs">
            Presentamos al público general nuestras consideraciones ante los
            datos publicados tanto por el TSE Escrutinios{' '}
            <a
              href="https://elecciones2021.tse.gob.sv"
              rel="nofollow noopener"
              target="_blank"
            >
              Preliminar
            </a>{' '}
            y{' '}
            <a
              href="https://escrutinio2021.tse.gob.sv"
              rel="nofollow noopener"
              target="_blank"
            >
              Final
            </a>{' '}
            como los medios de comunicación nacionales. Nuestro único interés es
            informar a la población debidamente.
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
        </div>
      </footer>
    </>
  )
}

export default Layout
