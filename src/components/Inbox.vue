<template>
  <ul>
    <li class="list-none" v-for="item in store.getInbox" :key="item">
      <component
        class="border-b border-slate-400 pb-1 w-100 break-all"
        :is="'p'"
        v-html="linkify(item)"
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { watch } from "vue"
import { useShareStore } from "@/store/itemShare"

const props = defineProps({
  podcastId: {
    type: String,
    default: "smart7",
  },
  docname: {
    type: String,
    default: "todaysdate",
  },
})

const store = useShareStore()
const connect = () => {
  store.connect(props.podcastId)
}
watch(() => props.podcastId, connect, {
  immediate: true,
})

const linkify = (text: string) => {
  const itemText = text
    .replace(/(">.*?)<\/a>/g, "")
    .replace(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)/g, "")

  const replacePattern =
    /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim
  const replacedText = itemText.replace(replacePattern, function (link, m1) {
    return `<a class="cursor-pointer" style="color:rgb(37 99 235 / 1)" onclick="window.open('${link}').focus()" target="_blank" href="${link}">${link.length > 50 ? link.slice(0, 50) + "..." : link}</a>`
  })

  return replacedText.replace(/\n/g, "<br/>")
}
</script>

<style scoped lang="scss">
.podcast {
  @apply prose prose-a:text-blue-600;
  @apply prose prose-ul:pl-0;
  max-width: 100%;
}
h3,
h4 {
  @apply dark:text-white;
}
</style>
