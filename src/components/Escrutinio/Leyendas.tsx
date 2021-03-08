import React from 'react'
import Field from '../Field'
import Row from '../Row'

const Leyendas = () => {
  return (
    <Row cols={6}>
      <Field>
        <p className="text-xs">D = Diputados Electos</p>
      </Field>
      <Field>
        <p className="text-xs">DCR = Diputados por Cociente y Residuos</p>
      </Field>
      <Field>
        <p className="text-xs">DNES = Diputados segun Noticiero El Salvador</p>
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
  )
}

export default Leyendas
