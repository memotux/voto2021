<script lang="ts" setup>
useSeoMeta({
  title: 'Escrutinio Final',
  ogTitle: 'Escrutinio Final | Voto 2021 | Asamblea Legislativa',
})
const store = useStore()
</script>

<template>
  <UContainer as="main">
    <h1>Escrutinio Final</h1>
    <h2>
      Total de votos:
      {{ new Intl.NumberFormat('es-SV').format(store.votosTotal || 0) }}
    </h2>
    <div
      class="sm:grid sm:justify-items-center sm:place-items-center w-full p-4 sm:overflow-x-auto sm:space-x-4"
      style="grid-template-columns: repeat(2, minmax(150px, 1fr))"
    >
      <USelect
        v-model="store.segmento"
        size="md"
        placeholder="Departamento..."
        :options="store.segmentos"
      />
      <USelect
        v-model="store.publicacion"
        size="md"
        placeholder="Publicaciones..."
        :options="store.publicaciones"
      />
    </div>
  </UContainer>
</template>

<style scoped></style>
