<script lang="ts" setup>
defineProps<{
  items: Array<[string, string]>
}>()
</script>

<template>
  <dl class="divide-y-2 divide-primary-50/25">
    <div v-for="item in items" class="flex justify-between items-center p-1">
      <dt class="w-1/2">{{ item[0] }}</dt>
      <dd class="w-1/2 text-right">
        {{ item[1] }}
      </dd>
    </div>
  </dl>
</template>
