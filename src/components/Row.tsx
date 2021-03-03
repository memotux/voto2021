import React from 'react'

interface IRow {
  cols: number
}

const Row: React.FC<IRow> = ({ cols, children }) => {
  return (
    <div
      className={`grid justify-items-center place-items-center w-full p-4 overflow-x-auto space-x-4`}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(150px, 1fr))` }}
    >
      {children}
    </div>
  )
}

export default Row
