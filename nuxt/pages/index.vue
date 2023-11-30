<script lang="ts" setup>
import { barY, ruleY, dot, lineY } from '@observablehq/plot'

useSeoMeta({
  title: 'Escrutinio Final',
  ogTitle: 'Escrutinio Final | Voto 2021 | Asamblea Legislativa',
})
const store = useStore()

const options = computed(() => {
  return {
    x: { label: 'Partidos' },
    y: {
      label: 'Diputados',
      domain: [0, diputadosXdepartamento[store.value.segmento]],
      grid: true,
      type: 'sqrt',
    },
    style: {
      background: 'transparent',
    },
    width: 800,
    marginBottom: 35,
    color: {
      type: 'categorical',
      scheme: 'Set1',
    },
    marks: [
      ruleY([0]),
      barY(store.value.segmentos![store.value.segmento].data, {
        x: 'nom_partido',
        y: (d) => d.diputadosXcociente + d.diputadosXresiduo[1],
        sort: { x: '-y' },
        fill: 'nom_partido',
        rx: 5,
      }),
    ],
  }
})

watch(
  () => store.value.publicacion,
  async () => {
    const { data } = await useFetch('/api/efinal', {
      query: { publicacion: store.value.publicacion },
    })
    store.value.votosTotal = data.value.data.votosTotal
    store.value.segmentos = data.value.data.segmentos
  }
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
        <USelect
          v-model="store.segmento"
          size="md"
          :options="departamentos"
        />
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
    <UContainer
      as="section"
      class="text-left my-8 space-y-4"
    >
      <h2 class="text-center mb-4">Diputados Electos a nivel {{ store.segmento }}</h2>
      <Plot
        class="flex justify-center my-8 min-w-[640px] min-h-[400px]"
        :options="options"
      />
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
