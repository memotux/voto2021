<script setup lang="ts">
useHead({
  titleTemplate: titleChunk => {
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

const { data } = await useFetch('/api/efinal', {
  key: 'efinal#nacional#latest',
})

store.value.publicaciones = data.value.data.publicaciones.map((p: string) =>
  p.split('#').pop(),
)
store.value.publicacion = store.value.publicaciones?.slice(-1).pop()
store.value.segmentos = Object.keys(data.value.data.segmentos)
store.value.votosTotal = data.value.data.votosTotal
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
