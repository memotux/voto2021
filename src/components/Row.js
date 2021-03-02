import React from "react"

const Row = ({ cols, children }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        justifyItems: "center",
        width: "100%",
        alignContent: "center",
        padding: "1rem",
        borderBottom: "1px solid grey",
        gap: "1rem",
      }}
    >
      {children}
    </div>
  )
}

export default Row
