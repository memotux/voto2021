<script setup lang="ts">
import type { EFinalResponse } from './utils/types'

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk
      ? `${titleChunk} | Voto 2021 | Asamblea Legislativa`
      : 'Voto 2021 | Asamblea Legislativa'
  },
  htmlAttrs: { lang: 'es-SV' },
})
useSeoMeta({
  description:
    'Voto 2021, Asamblea Legislativa,  Resultados Preliminares y Finales. Se exponen inconsistencias con las publicaciones de Medios de Comunicación.',
  ogDescription:
    'Voto 2021, Asamblea Legislativa,  Resultados Preliminares y Finales. Se exponen inconsistencias con las publicaciones de Medios de Comunicación.',
  ogType: 'website',
  twitterCard: 'summary',
  twitterCreator: '@memotux',
  twitterDescription:
    'Voto 2021, Asamblea Legislativa,  Resultados Preliminares y Finales. Se exponen inconsistencias con las publicaciones de Medios de Comunicación.',
})

const store = useStore()

const { data, pending } = await useFetch<EFinalResponse>('/api/efinal', {
  key: 'efinal#nacional#latest',
})

store.value = {
  segmento: 'NACIONAL',
  publicaciones: data.value!.data.publicaciones!.map(
    (p: string) => p.split('#').pop() as string
  ),
  publicacion: store.value.publicaciones?.slice(-1).pop(),
  votosTotal: data.value!.data.votosTotal,
  segmentos: data.value!.data.segmentos,
  loading: pending.value,
}
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
