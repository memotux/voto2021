<template>
  <header
    class="bg-blue-900 text-white mb-7 grid grid-cols-2 justify-items-around place-items-center"
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
        class="mb-2 sm:mb-0 hover:text-white border border-transparent hover:border-solid hover:border-primary-400 hover:bg-transparent rounded-lg px-3 py-2 transition"
        to="/"
        active-class="text-primary-800 bg-primary-400"
        >Final</ULink
      >
      <ULink
        to="/preliminar"
        class="hover:text-white border border-transparent hover:border-solid hover:bg-transparent hover:border-primary-400 rounded-lg px-3 py-2 transition"
        active-class="text-primary-800 bg-primary-400"
        >Preliminar</ULink
      >
    </nav>
  </header>
  <slot />
</template>
