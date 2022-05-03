<template>
  <div class="podcast" v-for="podcast in store.getLongList" :key="podcast.id">
    <div
      v-for="slotno in Array.from({ length: 7 }, (_, i) => 7 - i)"
      :key="slotno"
    >
      <ul>
        <li
          v-for="item in podcast.items.filter((item) => item.slot === slotno)"
          :key="item.id"
          class="flex justify-between items-center border-b"
        >
          <component :is="'p'" class="pb-1" v-html="linkify(item.text)" />
          <div class="flex justify-end">
            <HandIcon class="w-6 cursor-pointer" />
            <ListActionButton
              title="Delete"
              class="cursor-pointer"
              @click="emits('deleteInboxItem', item, podcast.id)"
            >
              <BackspaceIcon
                class="dark:text-white bg-transparent transition-colors w-6"
              />
            </ListActionButton>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Item } from "@/types/item"
import { uselongListItemsStore } from "@/store/longListItems"
import LinkifyIt from "linkify-it"
import ListActionButton from "@/components/atoms/ListActionButton.vue"
import { BackspaceIcon, HandIcon } from "@heroicons/vue/outline"

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
const emits = defineEmits(["deleteInboxItem"])
</script>

<style scoped lang="scss">
.podcast {
  @apply prose prose-a:text-blue-600;
  @apply prose prose-li:my-0;
  @apply prose prose-p:mb-0;
  max-width: 100%;
}
h3,
h4 {
  @apply ss-furniture dark:text-white;
}
</style>
