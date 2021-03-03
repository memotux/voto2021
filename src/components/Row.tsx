import React from 'react'

interface IRow {
  cols: number
}

const Row: React.FC<IRow> = ({ cols, children }) => {
  return (
    <div
      className={`grid grid-cols-${cols} justify-items-center place-items-center w-full p-4 space-x-4`}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {children}
    </div>
  )
}

export default Row