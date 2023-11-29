import React from 'react'
import { EscrutinioProps } from './Escrutinio'
import { Segmento } from './Segmento'

export const Departamento: React.FC<EscrutinioProps> = ({
  segmento,
  dataByPublicacion,
  dataSegment,
  dnes,
  dtse,
}) => {
  return (
    <section className="grid justify-items-center place-items-center w-full divide-blue-900 divide-y-2">
      <h2>Diputados Electos por {segmento}</h2>
      <Segmento {...{ dataByPublicacion, segmento, dataSegment, dnes, dtse }} />
    </section>
  )
}
