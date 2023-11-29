import React from 'react'
import Field from '../Field'
import Row from '../Row'

const Leyendas = () => {
  return (
    <Row cols={9}>
      <Field>
        <p className="text-xs">TSE = Diputados Electos según TSE</p>
      </Field>
      <Field>
        <p className="text-xs">
          DC = Diputados según asignación por coaliciones
        </p>
      </Field>
      <Field>
        <p className="text-xs">DP = Diputados según asignación por partido</p>
      </Field>
      <Field>
        <p className="text-xs">
          DCR = Diputados según cociente y residuos nacional
        </p>
      </Field>
      <Field>
        <p className="text-xs">DNES = Diputados segun Noticiero El Salvador</p>
      </Field>
      <Field>
        <p className="text-xs">R = Residuo</p>
      </Field>
      <Field>
        <p className="text-xs">VV = Votos Validos</p>
      </Field>
      <Field>
        <p className="text-xs">DE = Diputados a Elegir</p>
      </Field>
      <Field>
        <p className="text-xs">CE = Cociente Electoral</p>
      </Field>
    </Row>
  )
}

export default Leyendas
