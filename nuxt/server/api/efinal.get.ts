import type { EFinalRequest, ActualizacionData } from "@/utils/types";


export default defineEventHandler<EFinalRequest>(async (event) => {
  const query = getQuery(event)

  // const eFinalData = await useStorage('data:efinal').getItem('values') as ActualizacionData[]
  const eFinalData = await useStorage().getItem('values') as ActualizacionData[]

  console.log(JSON.stringify({ eFinalData }));


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
    return { data: null }
  }

  return {
    data: {
      publicacion: publicacion?.publicacion,
      votosTotal: publicacion?.votosTotal,
      segmentos: publicacion?.bySegment,
    }
  }
})