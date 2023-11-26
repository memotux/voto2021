<script lang="ts" setup>
useSeoMeta({
  title: 'Escrutinio Final',
  ogTitle: 'Escrutinio Final | Voto 2021 | Asamblea Legislativa',
})
const { data, pending, error } = await useFetch('/api/efinal', {
  query: { init: true },
})
</script>

<template>
  <UContainer as="main">
    <h1>Escrutinio Final</h1>
    <h2>
      Total de votos:
      {{ new Intl.NumberFormat('es-SV').format(data.data.votosTotal) }}
    </h2>
  </UContainer>
</template>

<style scoped></style>
