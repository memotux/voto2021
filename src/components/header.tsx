import { Link } from 'gatsby'
import React from 'react'

const Header = ({ siteTitle }: { siteTitle: string }) => (
  <header className="bg-blue-900 mb-7 grid grid-cols-2 justify-items-around place-items-center">
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="m-0">
        <Link to="/" className="no-underline">
          {siteTitle}
        </Link>
      </h1>
    </div>
    <nav className="grid grid-cols-2 place-items-center place-content-around">
      <Link to="/" activeClassName="active-link">
        Final
      </Link>
      <Link to="/preliminar" activeClassName="active-link">
        Preliminar
      </Link>
      {/* <Link to="#">Inconsistencias</Link> */}
    </nav>
  </header>
)

export default Header
