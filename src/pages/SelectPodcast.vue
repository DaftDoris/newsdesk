<template>
  <main class="overflow-y-auto h-full">
    <div
      class="select-podcast mb-14 pb-14 sm:mx-32 sm:mt-10 md:mx-44 xl:mx-96 sm:mb-5"
    >
      <h2 class="sm:my-12">Select Podcast</h2>
      <div class="mx-auto px-4 xl:px-0">
        <div
          class="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-5 text-white mx-5 sm:mx-0 my-5"
        >
          <template
            :key="podcast.image"
            v-for="podcast in podcastStore.getPodcasts"
          >
            <div class="mx-auto" v-if="podcast.image">
              <a id="select-podcast" :href="`#${podcast.id}`">
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
  @apply ss-furniture dark:text-white text-center text-4xl;
}
.select-podcast {
  height: calc(100vh - 161px);
}
</style>
