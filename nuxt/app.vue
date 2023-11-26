<script setup lang="ts">
useHead({
  titleTemplate: titleChunk => {
    return titleChunk
      ? `${titleChunk} | Voto 2021 | Asamblea Legislativa`
      : 'Voto 2021 | Asamblea Legislativa'
  },
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
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
