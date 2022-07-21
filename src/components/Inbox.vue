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
            class="
              flex
              justify-between
              items-center
              border-b border-slate-400
              pb-1
            "
            @dragend="dropped($event, text, podcastId)"
            draggable="true"
          >
            <component
              class="w-100 break-all w-full"
              :is="'p'"
              :data-item="item"
              v-html="linkify(text)"
            />
            <div>
              <HandIcon class="w-5 h-5" />
              <ListActionButton title="Delete" id="delete-inbox" @click="emits('delete', text, podcastId)">
                <BackspaceIcon
                  class="dark:text-white bg-transparent transition-colors"
                />
              </ListActionButton>
            </div>
          </div>
        </span>
      </template>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { watch } from "vue"
import { useShareStore } from "@/store/itemShare"
import { HandIcon, BackspaceIcon } from "@heroicons/vue/outline"
import ListActionButton from "@/components/atoms/ListActionButton.vue"
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

const dropped = (e: DragEvent, item: string, podcastId: any) => {
  emits("draggedInbox", e.clientX, e.clientY, item, podcastId)
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
const emits = defineEmits(["draggedInbox", "delete"])
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
