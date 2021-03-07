/**
 * Datos publicados por los Medios de Comunicación de
 * Diputados Electos a Nivel Nacional.
 * Fuente: El Faro, Diario de hoy, Noticiero El Salvador
 */
export const diputadosSegunMC: Array<{ partido: string; diputados: number }> = [
  {
    partido: 'N',
    diputados: 56,
  },
  {
    partido: 'ARENA',
    diputados: 14,
  },
  {
    partido: 'FMLN',
    diputados: 4,
  },
  {
    partido: 'GANA',
    diputados: 5,
  },
  {
    partido: 'PCN',
    diputados: 2,
  },
  {
    partido: 'NUESTRO TIEMPO',
    diputados: 1,
  },
  {
    partido: 'PDC',
    diputados: 1,
  },
  {
    partido: 'VAMOS',
    diputados: 1,
  },
  {
    partido: 'CD',
    diputados: 0,
  },
  {
    partido: 'NP',
    diputados: 0,
  },
]

/**
 * Datos publicados por Noticero El Salvador
 * de Diputados Electos a Nivel Departamental.
 */
export const diputadosXdepartamenotSegunNES: Array<{
  nodes: Array<{ partido: string; diputados: number }>
  fieldValue: string
}> = [
  {
    nodes: [
      {
        partido: 'N',
        diputados: 2,
      },
      {
        partido: 'PCN',
        diputados: 1,
      },
      {
        partido: 'COALICIÓN ARENA',
        diputados: 1,
      },
    ],
    fieldValue: 'AHUACHAPAN',
  },
  {
    nodes: [
      {
        partido: 'COALICIÓN N-GANA',
        diputados: 2,
      },
      {
        partido: 'ARENA',
        diputados: 1,
      },
    ],
    fieldValue: 'CABAÑAS',
  },
  {
    nodes: [
      {
        partido: 'COALICIÓN N-GANA',
        diputados: 1,
      },

      {
        partido: 'COALICIÓN PCN',
        diputados: 1,
      },

      {
        partido: 'N',
        diputados: 1,
      },
    ],
    fieldValue: 'CHALATENANGO',
  },
  {
    nodes: [
      {
        partido: 'COALICIÓN N-GANA',
        diputados: 0,
      },
      {
        partido: 'N',
        diputados: 2,
      },
      {
        partido: 'ARENA',
        diputados: 1,
      },
    ],
    fieldValue: 'CUSCATLAN',
  },
  {
    nodes: [
      {
        partido: 'N',
        diputados: 7,
      },
      {
        partido: 'ARENA',
        diputados: 2,
      },
      {
        partido: 'GANA',
        diputados: 1,
      },
    ],
    fieldValue: 'LA LIBERTAD',
  },
  {
    nodes: [
      {
        partido: 'N',
        diputados: 3,
      },
      {
        partido: 'ARENA',
        diputados: 0,
      },
      {
        partido: 'GANA',
        diputados: 1,
      },
    ],
    fieldValue: 'LA PAZ',
  },
  {
    nodes: [
      {
        partido: 'COALICIÓN N-GANA',
        diputados: 2,
      },
      {
        partido: 'N',
        diputados: 0,
      },
      {
        partido: 'ARENA',
        diputados: 1,
      },
    ],
    fieldValue: 'LA UNION',
  },
  {
    nodes: [
      {
        partido: 'N',
        diputados: 2,
      },
      {
        partido: 'FMLN',
        diputados: 1,
      },
    ],
    fieldValue: 'MORAZAN',
  },
  {
    nodes: [
      {
        partido: 'N',
        diputados: 3,
      },
      {
        partido: 'PDC',
        diputados: 1,
      },
      {
        partido: 'FMLN',
        diputados: 1,
      },
      {
        partido: 'GANA',
        diputados: 1,
      },
    ],
    fieldValue: 'SAN MIGUEL',
  },
  {
    nodes: [
      {
        partido: 'N',
        diputados: 17,
      },
      {
        partido: 'COALICIÓN ARENA',
        diputados: 3,
      },
      {
        partido: 'FMLN',
        diputados: 1,
      },
      {
        partido: 'GANA',
        diputados: 1,
      },
      {
        partido: 'NUESTRO TIEMPO',
        diputados: 1,
      },
      {
        partido: 'VAMOS',
        diputados: 1,
      },
    ],
    fieldValue: 'SAN SALVADOR',
  },
  {
    nodes: [
      {
        partido: 'COALICIÓN N-GANA',
        diputados: 2,
      },
      {
        partido: 'N',
        diputados: 0,
      },
      {
        partido: 'COALICIÓN ARENA-PCN',
        diputados: 1,
      },
    ],
    fieldValue: 'SAN VICENTE',
  },
  {
    nodes: [
      {
        partido: 'N',
        diputados: 5,
      },
      {
        partido: 'ARENA',
        diputados: 1,
      },
      {
        partido: 'GANA',
        diputados: 1,
      },
    ],
    fieldValue: 'SANTA ANA',
  },
  {
    nodes: [
      {
        partido: 'N',
        diputados: 4,
      },
      {
        partido: 'ARENA',
        diputados: 1,
      },
      {
        partido: 'GANA',
        diputados: 1,
      },
    ],
    fieldValue: 'SONSONATE',
  },
  {
    nodes: [
      {
        partido: 'N',
        diputados: 3,
      },
      {
        partido: 'FMLN',
        diputados: 0,
      },
      {
        partido: 'ARENA',
        diputados: 1,
      },
      {
        partido: 'GANA',
        diputados: 1,
      },
    ],
    fieldValue: 'USULUTAN',
  },
]
