<template>
  <ul>
    <li
      class="list-none"
      v-for="(item, podcastId) in store.getInbox"
      :key="podcastId"
    >
      <template v-if="item">
        <span v-for="(text, index) in item" :key="index">
          <div
            class="flex justify-between items-center border-b border-slate-400 py-2 cursor-ponter"
            @dragend="dropped($event, index, podcastId)"
            draggable="true"
            :inbox-id="index"
            :inbox-podcastId="podcastId"
          >
            <component
              :inbox-id="index"
              :inbox-podcastId="podcastId"
              class="w-100 break-all"
              :is="'p'"
              v-html="linkify(text)"
            />
            <div>
              <HandIcon class="w-5 h-5"/>
            </div>
          </div>
        </span>
      </template>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { watch } from "vue"
import LinkifyIt from "linkify-it"
import { useShareStore } from "@/store/itemShare"
import { HandIcon } from "@heroicons/vue/outline"

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

const dropped = (e: DragEvent, item: any, name: any) => {
  emits("draggedInbox", e.clientX, e.clientY, item, name)
  // emits("update", item)
}

const emits = defineEmits(["draggedInbox"])
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
