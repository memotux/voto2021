import { Link } from 'gatsby'
import React from 'react'

const Header = ({ siteTitle }: { siteTitle: string }) => (
  <header className="bg-indigo-900 mb-7">
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="m-0">
        <Link to="/" className="text-white no-underline">
          {siteTitle}
        </Link>
      </h1>
    </div>
  </header>
)

export default Header
