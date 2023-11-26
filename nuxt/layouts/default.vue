<template>
    <header class="dark:bg-blue-900 mb-7 grid grid-cols-2 justify-items-around place-items-center">
      <div class="mx-auto p-6">
        <h1 class="m-0">
          <NuxtLink aria-current="page" class="no-underline" href="/">Voto 2021 | Asamblea Legislativa</NuxtLink></h1>
        </div>
        <nav class="grid sm:grid-cols-3 place-items-center place-content-around">
          <p class="text-white mb-2 sm:mb-0">Escrutinio:</p>
          <NuxtLink aria-current="page" class="mb-2 sm:mb-0 active-link" href="/">Final</NuxtLink>
          <NuxtLink href="/preliminar">Preliminar</NuxtLink>
        </nav>
      </header>
    <UContainer as="main">
      <slot />
    </UContainer>
</template>
