<template>
  <div class="podcast" v-for="podcast in store.getLongList" :key="podcast.id">
    <div
      v-for="slotno in Array.from({ length: 7 }, (_, i) => 7 - i)"
      :key="slotno"
    >
      <ul>
        <li
          class="list-none"
          v-for="item in podcast.items.filter((item) => item.slot === slotno)"
          :key="item.id"
        >
          <component
            class="border-b border-slate-400 pb-1 w-100 break-all"
            :is="'p'"
            v-html="linkify(item.text)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Item } from "@/types/item"
import { uselongListItemsStore } from "@/store/longListItems"

const props = defineProps({
  podcastId: {
    type: String,
    default: "smartseven",
  },
  docname: {
    type: String,
    default: "todaysdate",
  },
})

const store = uselongListItemsStore()
store.connect(props.docname)

const linkify = (text: string) => {
  const itemText = text.replace(/<\/a>/g, "").replace(/<a.*?>/g, "")

  const replacePattern =
    /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim
  const replacedText = itemText.replace(replacePattern, function (link, m1) {
    return `<a class="cursor-pointer" style="color:rgb(37 99 235 / 1)" onclick="window.open('${link}').focus()" target="_blank">${link.length > 50 ? link.slice(0, 50) + "..." : link}</a>`
  })

  return replacedText.replace(/\n/g, "<br/>")
}
</script>

<style scoped lang="scss">
.podcast {
  @apply prose prose-a:text-blue-600;
  @apply prose prose-ul:pl-0;
}
h3,
h4 {
  @apply ss-furniture dark:text-white;
}
</style>
