<template>
  <div class="relative w-full h-screen overflow-y-hidden">
    <AppBar />
    <main class="mx-auto w-full h-max mb-1">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts" setup>
import AppBar from '@/components/organisms/AppBar.vue'

</script>

<style scoped lang="scss">

</style>
