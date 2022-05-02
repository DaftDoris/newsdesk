<template>
  <div class="podcast" v-for="podcast in store.getLongList" :key="podcast.id">
    <h3>{{ podcast.name }}</h3>
    <div
      v-for="slotno in Array.from({ length: 7 }, (_, i) => 7 - i)"
      :key="slotno"
    >
      <h4>{{ slotno }}: {{ podcast.slotTitles[slotno] }}</h4>

      <ul>
        <li
          v-for="item in podcast.items.filter((item) => item.slot === slotno)"
          :key="item.id"
          draggable="true"
          @dragend="dropped($event, item, podcast.id)"
        >
          <component class="border-b" :item-slot="item.slot" :item-id="item.id" :is="'p'" v-html="linkify(item.text)" />
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
        acc.replace(match.raw, `<a href="${match.url}">${match.raw}</a>`),
      text,
    ) || text
  ).replace(/\n/g, "<br/>")
}

const dropped = (e: DragEvent, item: any, name: string) => {
  emits("draggedLongList", e.clientX, e.clientY, item, name)
  emits("update", item)
}

const emits = defineEmits(["draggedLongList", "update"])

</script>

<style scoped lang="scss">
.podcast {
  @apply prose prose-a:text-blue-600;
}
h3,
h4 {
  @apply ss-furniture dark:text-white;
}
</style>
