<template>
  <header
    class="dark:bg-blue-900 mb-7 grid grid-cols-2 justify-items-around place-items-center"
  >
    <div class="mx-auto p-6">
      <h1 class="m-0 font-normal">
        <NuxtLink aria-current="page" class="no-underline" href="/"
          >Voto 2021 | Asamblea Legislativa</NuxtLink
        >
      </h1>
    </div>
    <nav class="grid sm:grid-cols-3 place-items-center place-content-around">
      <p class="text-white mb-2 sm:mb-0">Escrutinio:</p>
      <ULink
        class="mb-2 sm:mb-0 hover:bg-transparent hover:border-primary-200"
        to="/"
        active-class="text-primary-800 bg-primary-400 rounded-lg px-3 py-2"
        >Final</ULink
      >
      <ULink
        to="/preliminar"
        active-class="text-primary-800 bg-primary-400 rounded-lg px-3 py-2"
        >Preliminar</ULink
      >
    </nav>
  </header>
  <slot />
</template>
