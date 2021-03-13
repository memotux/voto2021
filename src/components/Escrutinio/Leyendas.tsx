import React from 'react'
import Field from '../Field'
import Row from '../Row'

const Leyendas = () => {
  return (
    <Row cols={7}>
      <Field>
        <p className="text-xs">
          D = Diputados Electos según Escrutinio Preliminar
        </p>
      </Field>
      <Field>
        <p className="text-xs">D1 = Diputados Electos según Escrutinio Final</p>
      </Field>
      <Field>
        <p className="text-xs">
          DCR = Diputados por Cociente y Residuos Nacional
        </p>
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
