<script lang="ts" setup>
import { diputadosXdepartamento } from '@/utils'
import type { BySegmentData, Segmentos } from '@/utils/types'

defineProps<{ segmento: Segmentos; data: BySegmentData; wrap?: boolean }>()
</script>

<template>
  <UContainer
    class="flex overflow-x-auto gap-4"
    :class="{ 'flex-wrap justify-center': wrap }"
  >
    <UCard
      class="w-3/12 flex-shrink-0"
      :ui="{
        background: 'bg-primary-200 dark:bg-primary-900',
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
      class="w-3/12 flex-shrink-0"
      :ui="{
        background: 'bg-primary-50 dark:bg-primary-950',
        divide: 'divide-blue-700 dark:divide-blue-300',
      }"
    >
      <template #header>
        <h4 class="text-center">{{ partido.nom_partido }}</h4>
      </template>
      <DefinitionList
        :items="[
          ['Votos:', roundNumber.format(partido.votos_partido)],
          [
            'Residuo:',
            roundNumber.format(partido.residuo[0] || partido.residuo[1]),
          ],
          [
            'por Cociente/Residuo:',
            `${roundNumber.format(
              partido.diputadosXcociente,
            )}/${roundNumber.format(partido.diputadosXresiduo[1])}`,
          ],
          [
            'por Partido:',
            roundNumber.format(
              partido.diputadosXcociente + partido.diputadosXresiduo[0],
            ),
          ],
        ]"
      />
    </UCard>
  </UContainer>
</template>
