<template>
  <main class="overflow-y-auto h-full">
    <div class="select-podcast h-full mb-5">
      <h2 class="mt-5">Select Podcast</h2>
      <div class="container mx-auto px-4 xl:px-0">
        <div
          class="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-4 text-white my-5"
        >
          <template
            :key="podcast.image"
            v-for="podcast in podcastStore.getPodcasts"
          >
            <div class="mx-auto" v-if="podcast.image">
              <a :href="`#${podcast.id}`">
                <img :src="podcast.image" />
              </a>
            </div>
          </template>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { usePodcastStore } from "@/store/podcasts"
const podcastStore = usePodcastStore()
</script>

<style scoped lang="scss">
h2 {
  @apply ss-furniture text-center text-4xl;
}
.select-podcast {
  height: calc(100vh - 72px);
}
</style>
