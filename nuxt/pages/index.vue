<script lang="ts" setup>
import { barY, ruleY, text } from '@observablehq/plot'

useSeoMeta({
  title: 'Escrutinio Final',
  ogTitle: 'Escrutinio Final | Voto 2021 | Asamblea Legislativa',
})
const store = useStore()

const graphOptions = computed(() => {
  if (!store.value.segmentos) return {}
  return {
    x: { label: 'Partidos', tickRotate: 50 },
    y: {
      label: 'Diputados',
      domain: [0, diputadosXdepartamento[store.value.segmento]],
      grid: true,
      type: store.value.segmento === 'NACIONAL' ? 'sqrt' : 'pow',
      interval: 1,
    },
    width: 800,
    marginBottom: 90,
    className: 'votos-graph',
    color: {
      type: 'categorical',
      scheme: 'Set1',
    },
    style: {
      fontSize: '12px',
      cursor: 'pointer',
    },
    marks: [
      ruleY([0]),
      barY(store.value.segmentos?.[store.value.segmento].data, {
        x: 'nom_partido',
        y: (d) => d.diputadosXcociente + d.diputadosXresiduo[1],
        sort: { x: '-y' },
        fill: 'nom_partido',
        rx: 5,
        tip: {
          fill: 'rgb(23 37 84 / var(--tw-bg-opacity))',
        },
      }),
      text(store.value.segmentos[store.value.segmento].data, {
        x: 'nom_partido',
        y: (d) => d.diputadosXcociente + d.diputadosXresiduo[1],
        text: (d) => d.diputadosXcociente + d.diputadosXresiduo[1],
        filter: (d) => d.diputadosXcociente + d.diputadosXresiduo[1] > 0,
        lineAnchor: 'bottom',
        fontSize: 14,
        fontWeight: 'bold',
        dy: -5,
      }),
    ],
  }
})

watch(
  () => store.value.publicacion,
  async () => {
    try {
      store.value.loading = true
      const { data } = await useFetch<EFinalResponse>('/api/efinal', {
        query: { publicacion: store.value.publicacion },
      })
      if (data.value) {
        store.value.votosTotal = data.value.data.votosTotal
        store.value.segmentos = data.value.data.segmentos
      } else {
        throw createError('Fetch Publicacion failed')
      }
    } catch (error) {
      console.error(error)
    } finally {
      store.value.loading = false
    }
  }
)
</script>

<template>
  <UContainer as="main">
    <UModal v-model="store.loading">
      <div class="w-full h-24 flex justify-center items-center text-primary-400">
        <IconLoading class="h-12 w-12" />
      </div>
    </UModal>
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
        :options="graphOptions"
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
