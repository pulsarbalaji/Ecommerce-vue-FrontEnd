<script setup>
import DefaultLayoutWithVerticalNav from './components/DefaultLayoutWithVerticalNav.vue'
</script>

<template>
  <DefaultLayoutWithVerticalNav>
    <slot />
  </DefaultLayoutWithVerticalNav>
</template>

<style lang="scss">
// Sneat default layout styles
@use "@layouts/styles/default-layout";
</style>
