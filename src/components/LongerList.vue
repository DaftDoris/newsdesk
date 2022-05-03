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
import LinkifyIt from "linkify-it"

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

const linkifyit = LinkifyIt()

const linkify = (text: string) => {
  const matches = linkifyit.match(text)
  return (
    matches?.reduce(
      (acc: string, match) =>
        acc.replace(
          match.raw,
          `<a href="${match.url}">${
            match.raw.length > 50 ? match.raw.slice(0, 50) + "..." : match.raw
          }</a>`,
        ),
      text,
    ) || text
  ).replace(/\n/g, "<br/>")
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
