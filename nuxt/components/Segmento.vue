<script lang="ts" setup>
import { diputadosXdepartamento } from '@/utils'
import type { BySegmentData, Segmentos } from '@/utils/types'

defineProps<{ segmento: Segmentos; data: BySegmentData }>()
</script>

<template>
  <UContainer class="flex overflow-x-auto gap-4">
    <UCard
      class="w-[23%] flex-shrink-0"
      :ui="{
        background: 'bg-primary-100 dark:bg-primary-950',
        divide: 'divide-blue-800 dark:divide-blue-200',
      }"
    >
      <template #header>
        <h3 class="text-center">{{ segmento }}</h3>
      </template>
      <DefinitionList
        :items="[
          ['Curules:', diputadosXdepartamento[segmento].toString()],
          ['Votos:', roundNumber.format(data.votosTotal || 0)],
          ['Cociente:', roundNumber.format(data.cocienteElectoral || 0)],
        ]"
      />
    </UCard>
    <UCard
      v-for="partido in data.data"
      :key="`${partido.publicacion}#${partido.nom_partido}`"
      class="w-2/12 flex-shrink-0"
      :ui="{
        background: 'bg-primary-50 dark:bg-primary-900',
        divide: 'divide-blue-700 dark:divide-blue-300',
      }"
    >
      <template #header>
        <h4 class="text-center">{{ partido.nom_partido }}</h4>
      </template>
      <DefinitionList
        :items="[
          ['por Cociente:', roundNumber.format(partido.diputadosXcociente)],
          ['Residuo:', roundNumber.format(partido.residuo[0])],
        ]"
      />
    </UCard>
  </UContainer>
</template>
