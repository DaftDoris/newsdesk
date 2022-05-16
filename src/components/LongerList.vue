<template>
  <ul>
    <li class="list-none" v-for="item in store.getInbox.reverse()" :key="item">
      <component
        class="border-b border-slate-400 pb-1 w-100 break-all"
        :is="'p'"
        v-html="linkify(item)"
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { Item } from "@/types/item"
import { uselongListItemsStore } from "@/store/longListItems"
import LinkifyIt from "linkify-it"
import { useShareStore } from "@/store/itemshare"

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

const store = useShareStore()
store.connect(props.podcastId)

const linkifyit = LinkifyIt()

const linkify = (text: string) => {
  const matches = linkifyit.match(text)
  return (
    matches?.reduce(
      (acc: string, match) =>
        acc.replace(match.raw, `<a href="${match.url}">${match.raw}</a>`),
      text,
    ) || text
  ).replace(/\n/g, "<br/>")
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
  @apply ss-furniture dark:text-white;
}
</style>
