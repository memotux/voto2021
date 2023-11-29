<script lang="ts" setup>
useSeoMeta({
  title: 'Escrutinio Final',
  ogTitle: 'Escrutinio Final | Voto 2021 | Asamblea Legislativa',
})
const store = useStore()

watch(
  () => store.value.publicacion,
  async () => {
    const { data } = await useFetch('/api/efinal', {
      query: { publicacion: store.value.publicacion },
    })
    store.value.votosTotal = data.value.data.votosTotal
    store.value.segmentos = data.value.data.segmentos
  },
)
</script>

<template>
  <UContainer as="main">
    <h1>Escrutinio Final</h1>
    <h2>
      Total de votos:
      {{ roundNumber.format(store.votosTotal || 0) }}
    </h2>
    <div
      class="sm:grid sm:justify-items-center sm:place-items-center w-full p-4 sm:overflow-x-auto sm:space-x-4"
      style="grid-template-columns: repeat(2, minmax(150px, 1fr))"
    >
      <div>
        <p class="pb-2">Selecciona Departamento:</p>
        <USelect v-model="store.segmento" size="md" :options="departamentos" />
      </div>
      <div>
        <p class="pb-2">Selecciona Publicacion:</p>
        <USelect
          v-model="store.publicacion"
          size="md"
          :options="store.publicaciones"
        />
      </div>
    </div>
    <UContainer as="section" class="text-left my-8 space-y-4">
      <h2 class="text-center mb-4">
        Diputados Electos a nivel {{ store.segmento }}
      </h2>
      <template v-if="store.segmento === 'NACIONAL'">
        <Segmento
          v-for="(data, segmento) in store.segmentos"
          :key="segmento"
          :segmento="segmento"
          :data="data"
        />
      </template>
      <Segmento
        v-else
        :segmento="store.segmento"
        :data="store.segmentos![store.segmento]"
        wrap
      />
    </UContainer>
  </UContainer>
</template>
