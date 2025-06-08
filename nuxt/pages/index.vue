<script lang="ts" setup>
import { VPlot } from '@memotux/vue-plot'
import type { BarYOptions, Data, PlotOptions, TextOptions } from '@observablehq/plot'

useSeoMeta({
  title: 'Escrutinio Final',
  ogTitle: 'Escrutinio Final | Voto 2021 | Asamblea Legislativa',
})
const store = useStore()

const barOptions = computed(() => {
  return <BarYOptions & { data: Data }>{
    data: store.value.segmentos?.[store.value.segmento].data,
    x: 'nom_partido',
    y: (d: SegmentPartidoData) => d.diputadosXcociente + d.diputadosXresiduo[1],
    sort: { x: '-y' },
    fill: 'nom_partido',
    rx: 5,
    tip: {
      fill: 'rgb(23 37 84 / var(--tw-bg-opacity))',
    },
  }
})

// const textOptions = computed(() => {
//   return <TextOptions & { data: Data }>{
//     data: store.value.segmentos?.[store.value.segmento].data,
//     x: 'nom_partido',
//     y: (d: SegmentPartidoData) => d.diputadosXcociente + d.diputadosXresiduo[1],
//     text: (d: SegmentPartidoData) => d.diputadosXcociente + d.diputadosXresiduo[1],
//     filter: (d: SegmentPartidoData) => d.diputadosXcociente + d.diputadosXresiduo[1] > 0,
//     lineAnchor: 'bottom',
//     fontSize: 14,
//     fontWeight: 'bold',
//     dy: -5,
//   }
// })

const graphOptions = computed<PlotOptions>(() => {
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
  }
})

watch(
  () => store.value.publicacion,
  async () => {
    try {
      store.value.loading = true
      const { data } = await $fetch<EFinalResponse>('/api/efinal', {
        query: { publicacion: store.value.publicacion },
      })
      if (data) {
        store.value.votosTotal = data.votosTotal
        store.value.segmentos = data.segmentos
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
    <div
      v-show="store.loading"
      class="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-primary-400/25 z-50 pointer-events-none"
    >
      <div
        class="w-16 h-16 mx-auto text-primary-400 flex justify-center items-center bg-primary-900/75 shadow-lg rounded-lg p-4"
      >
        <IconLoading />
      </div>
    </div>
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
      <VPlot
        class="flex justify-center my-8 min-w-[640px] min-h-[400px]"
        v-bind="graphOptions"
      >
        <PlotRuleY :data="[0]" />
        <PlotBarY v-bind="barOptions" />
        <PlotText
          :data="store.segmentos?.[store.segmento].data"
          x="nom_partido"
          :y="(d: SegmentPartidoData) => d.diputadosXcociente + d.diputadosXresiduo[1]"
          :text="(d: SegmentPartidoData) => d.diputadosXcociente + d.diputadosXresiduo[1]"
          :filter="
            (d: SegmentPartidoData) => d.diputadosXcociente + d.diputadosXresiduo[1] > 0
          "
          lineAnchor="bottom"
          :fontSize="14"
          fontWeight="bold"
          :dy="-5"
        />
      </VPlot>
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
