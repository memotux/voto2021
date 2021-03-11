import React from 'react'
import { diputadosXdepartamenotSegunNES } from '../../../data/mc'
import { dataNode } from '../../pages'
import { processDepartmentData } from '../../utils'
import Field from '../Field'
import Row from '../Row'
import { EscrutinioProps } from './Escrutinio'
import { Segmento } from './Segmento'

export const Nacional: React.FC<EscrutinioProps> = ({
  dataNacional,
  dnes,
  dnpsd,
}) => {
  if (!dataNacional || !dnpsd) return null
  const segmentNacion = dataNacional.find(
    segment => segment.fieldValue === 'NACIONAL'
  )
  const dataSegment = processDepartmentData(
    segmentNacion as {
      nodes: dataNode[]
      fieldValue: string
    }
  )

  if (!segmentNacion) return null

  return (
    <section className="grid justify-items-center place-items-center w-full divide-blue-900 divide-y-2">
      <h2>Diputados Electos a nivel NACIONAL</h2>
      <Row cols={segmentNacion.nodes.length + 1}>
        <Field>
          <h3>NACIONAL</h3>
          <dl className="grid grid-cols-2">
            <dt>DE:</dt>
            <dd>{(dataSegment[2] + dataSegment[3]).toLocaleString()}</dd>
            <dt>VV:</dt>
            <dd>{dataSegment[0].toLocaleString()}</dd>
            {/* <dt>CE:</dt>
            <dd>{dataSegment[1].toLocaleString()}</dd> */}
          </dl>
        </Field>
        {segmentNacion.nodes.map(partido => {
          const dpnes =
            dnes?.nodes.find(p => p.partido === partido.nom_partido) || null

          return (
            <Field key={`nom-partido-${partido.nom_partido}`}>
              <p>{partido.nom_partido}</p>
              <dl className="grid grid-cols-2">
                <dt>D:</dt>
                <dd>
                  {['N-GANA', 'ARENA-PCN'].includes(partido.nom_partido)
                    ? dnpsd[`TOTAL ${partido.nom_partido}`]
                    : dnpsd[partido.nom_partido]}
                </dd>
                <dt>DCR:</dt>
                <dd>
                  {partido.diputadosXcociente + partido.diputadosXresiduo}
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
      {(dataNacional as { nodes: dataNode[]; fieldValue: string }[]).map(
        departamento => {
          if (departamento.fieldValue === 'NACIONAL') return null
          const dnes = diputadosXdepartamenotSegunNES.find(
            department => department.fieldValue === departamento.fieldValue
          )
          const dataSegment = processDepartmentData(departamento)
          return (
            <Segmento
              key={`dataNacinoal-${departamento.fieldValue}`}
              {...{
                dataByPublicacion: departamento.nodes,
                segmento: departamento.fieldValue,
                dataSegment,
                dnes,
              }}
            />
          )
        }
      )}
    </section>
  )
}
