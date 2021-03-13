import React from 'react'
import Field from '../Field'
import Row from '../Row'
import { EscrutinioProps } from './Escrutinio'

export const Segmento: React.FC<EscrutinioProps> = ({
  dataByPublicacion,
  segmento,
  dataSegment,
  dnes,
}) => {
  if (!dataByPublicacion || !dataSegment) return null
  return (
    <Row cols={dataByPublicacion.length + 1}>
      <Field>
        <h3>{segmento}</h3>
        <dl className="grid grid-cols-2">
          <dt>DE:</dt>
          <dd>{(dataSegment[2] + dataSegment[3]).toLocaleString()}</dd>
          <dt>VV:</dt>
          <dd>{dataSegment[0].toLocaleString()}</dd>
          <dt>CE:</dt>
          <dd>{dataSegment[1].toLocaleString()}</dd>
        </dl>
      </Field>
      {dataByPublicacion.map(partido => {
        const dpnes =
          dnes?.nodes.find(p => p.partido === partido.nom_partido) || null

        return (
          <Field key={`nom-partido-${partido.nom_partido}`}>
            <p>{partido.nom_partido}</p>
            <dl className="grid grid-cols-2">
              <dt>D:</dt>
              <dd>
                {['TOTAL N-GANA', 'TOTAL ARENA-PCN'].includes(
                  partido.nom_partido
                )
                  ? 0
                  : partido.diputadosXcociente + partido.diputadosXresiduo[0]}
              </dd>
              <dt>D1:</dt>
              <dd>
                {['N-GANA', 'ARENA-PCN'].includes(partido.nom_partido)
                  ? 0
                  : partido.diputadosXcociente + partido.diputadosXresiduo[1]}
              </dd>
              <dt>DNES:</dt>
              <dd>{dpnes ? dpnes.diputados : 0}</dd>
              {/* <dt>R:</dt>
              <dd>{partido.residuo.toLocaleString()}</dd>
              <dt>VV:</dt>
              <dd>{partido.votos_partido.toLocaleString()}</dd> */}
            </dl>
          </Field>
        )
      })}
    </Row>
  )
}
