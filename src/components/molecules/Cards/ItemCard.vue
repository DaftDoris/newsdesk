/* eslint-disable vue/no-mutating-props */
<template>
  <div
    :data-id="item.id"
    class="handle flex justify-between items-center"
    :draggable="dropzone"
    @dragend="dropped"
    @mousemove="selectedText"
  >
    <component
      id="droptext"
      :is="'p'"
      :data-id="item.id"
      @focusout="update"
      @keydown.tab.prevent="false"
      contenteditable="true"
      class="prose prose-a:text-blue-600 break-all"
      v-html="htmlstring"
      ref="element"
      draggable="false"
      @mouseleave="selectedText"
    ></component>
    <div class="flex justify-end">
      <HandIcon @click="dropzone = true" />
      <ListActionButton title="Delete" @click="emits('delete', item)">
        <BackspaceIcon
          class="dark:text-white bg-transparent transition-colors"
        />
      </ListActionButton>
      <ListActionButton title="Share to podcast">
        <Popover as="div" class="relative pt-1 text-sm">
          <div>
            <PopoverButton>
              <BookmarkIcon />
            </PopoverButton>
          </div>

          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <PopoverPanel
              class="drop-shadow-lg origin-top-right absolute right-6 top-1 sm:w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none p-2 border border-black"
            >
              <div
                v-for="podcast in podcastStore.getPodcasts"
                :key="podcast.id"
              >
                <div
                  class="flex justify-between items-center pb-2 font-normal podcast-list text-gray-700"
                >
                  <sapn :for="podcast.id">{{ podcast.name }}</sapn>
                  <input
                    v-if="
                      !podcastNameToShare.some((item) => item === podcast.id)
                    "
                    type="checkbox"
                    :id="podcast.id"
                    class="cursor-pointer checked:bg-black w-5 h-5 accent-black border-black"
                    v-model="podcastNameToShare"
                    :value="podcast.id"
                    @change="getPodcastToShare(item)"
                  />
                  <span v-else>
                    <CheckIcon class="text-green-700" />
                  </span>
                </div>
              </div>
            </PopoverPanel>
          </transition>
        </Popover>
      </ListActionButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, computed, ref } from "vue"
import { Item } from "@/types/item"
import ListActionButton from "@/components/atoms/ListActionButton.vue"
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue"
import { BackspaceIcon, HandIcon, CheckIcon, BookmarkIcon } from "@heroicons/vue/outline"
import { usePodcastStore } from "@/store/podcasts"
import { useRoute } from "vue-router"

const podcastStore = usePodcastStore()
const route = useRoute()

const dropzone = ref(true)
const update = (text: any) => {
  const itemText = text.target?.innerHTML || ""
  const filterItemText = itemText
    .replace(/(">.*?)<\/a>/g, "")
    .replace(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)/g, "")
  // eslint-disable-next-line vue/no-mutating-props
  props.item.text = getItemText(filterItemText)
  emits("update", props.item)
}
const element = ref<HTMLElement | null>(null)

const dropped = (e: DragEvent) => {
  if (dropzone.value) {
    emits("dragged", e.clientX, e.clientY, props.item)
  }
}

const getItemText = (itemText: string) => {
  let replacedText

  //URLs starting with http://, https://, https://.www or ftp://
  const replacePattern =
    /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim
  replacedText = itemText.replace(replacePattern, function (link, m1) {
    return `<a class="cursor-pointer" style="color:rgb(37 99 235 / 1)" onclick="window.open('${link}').focus()" target="_blank" href="${link}">${link.length > 50 ? link.slice(0, 50) + "..." : link}</a>`
  })

  return replacedText.replace(/\n/g, "<br/>")
}

const htmlstring = computed(() => {
  const itemText = props.item.text
    .replace(/(">.*?)<\/a>/g, "")
    .replace(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)/g, "")
  return getItemText(itemText)
})

const selectedText = () => {
  const selection = window.getSelection()
  dropzone.value = selection && selection?.isCollapsed ? true : false
}

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    default: null,
  },
})
const podcastNameToShare = ref([])

const getPodcastToShare = (item: Item) => {
  emits("share", item, podcastNameToShare.value)
}

const emits = defineEmits(["delete", "update", "save", "dragged", "share"])
</script>

<style scoped lang="scss">
.handle {
  svg {
    @apply dark:text-white w-6 cursor-pointer;
  }
  border: 1px solid #ececec;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 10%);
}
.prose {
  max-width: 100%;
}
.prose:focus {
  outline: 0;
}
.podcast-list {
  @apply ss-furniture;
}
</style>
