import type { EFinalRequest, ActualizacionData } from "@/utils/types";

export default defineEventHandler<EFinalRequest>(async (event) => {
  const query = getQuery(event)

  const eFinalData = await useStorage().getItem('values:efinal') as ActualizacionData[]

  if (!query.publicacion) {
    const latest = eFinalData.slice(-1)[0]
    return {
      data: {
        publicacion: latest?.publicacion,
        votosTotal: latest?.votosTotal,
        segmentos: latest?.bySegment,
        publicaciones: eFinalData.map((d) => d?.publicacion)
      }
    }
  }

  const publicacion = eFinalData.find(d => d?.publicacion.endsWith(query.publicacion || 'no-defined'))

  if (!publicacion) {
    throw createError({
      statusMessage: 'Bad Request. Error while finding publicacion',
      statusCode: 400
    })
  }

  return {
    data: {
      publicacion: publicacion?.publicacion,
      votosTotal: publicacion?.votosTotal,
      segmentos: publicacion?.bySegment,
    }
  }
})