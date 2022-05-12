/* eslint-disable vue/no-mutating-props */
<template>
  <div
    :data-id="item.id"
    class="handle flex justify-between items-center"
    draggable="true"
    @dragend="dropped"
  >
    <component
      :is="'p'"
      :data-id="item.id"
      @focusout="update"
      contenteditable="true"
      class="prose prose-a:text-blue-600 break-all"
      v-html="htmlstring"
      ref="element"
    ></component>
    <div class="flex justify-end">
      <HandIcon />
      <ListActionButton title="Delete" @click="emits('delete', item)">
        <BackspaceIcon
          class="dark:text-white bg-transparent transition-colors"
        />
      </ListActionButton>
      <ListActionButton title="Share to podcast">
        <Popover as="div" class="relative pt-1">
          <div>
            <PopoverButton>
              <BookmarkIconSolid v-if="item.shared" />
              <BookmarkIcon v-else />
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
              class="origin-top-right absolute right-6 top-1 sm:w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none p-2"
            >
              <div v-for="podcast in store.getPodcasts" :key="podcast.id">
                <div
                  class="flex justify-between items-center"
                  :class="{ 'py-1': podcast.id != route.params.podcastId }"
                  v-if="podcast.id != route.params.podcastId"
                >
                  <span>{{ podcast.name }}</span>
                  <input
                    type="checkbox"
                    id="podcast-name"
                    class="cursor-pointer checked:bg-black w-4 h-4"
                    v-model="podcastNameToShare"
                    :value="podcast.id"
                    @change="getPodcastToShare(item)"
                    @click="getCurrentPodcast()"
                  />
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
import LinkifyIt from "linkify-it"
import { PropType, computed, ref } from "vue"
import { Item } from "@/types/item"
import ListActionButton from "@/components/atoms/ListActionButton.vue"
// import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue"

import { BackspaceIcon, BookmarkIcon, HandIcon } from "@heroicons/vue/outline"
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/vue/solid"
import { usePodcastStore } from "@/store/podcasts"
import { useRoute } from "vue-router"

const store = usePodcastStore()
const route = useRoute()

const linkify = LinkifyIt()

const update = (text: any) => {
  // eslint-disable-next-line vue/no-mutating-props
  props.item.text = text.target?.innerHTML || ""
  emits("update", props.item)
}
const element = ref<HTMLElement | null>(null)
const dropped = (e: DragEvent) => {
  emits("dragged", e.clientX, e.clientY, props.item)
}

const htmlstring = computed(() => {
  const matches = linkify.match(props.item.text)
  return (
    matches?.reduce(
      (acc: string, match) =>
        acc.replace(
          match.raw,
          `<a onclick="window.open('${match.url}', '_blank').focus()" href="${match.url}">${match.raw}</a>`,
        ),
      props.item.text,
    ) || props.item.text
  ).replace(/\n/g, "<br/>")
})

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    default: null,
  },
})

const podcastNameToShare = ref(
  props.item?.sharePodcast ? props.item?.sharePodcast : [],
)

const deletePodcastItem = ref([])

const getPodcastToShare = (item: Item) => {
  if (podcastNameToShare.value.length > deletePodcastItem.value.length) {
    const getAddPodcastId = podcastNameToShare.value.filter(function (obj) {
      return deletePodcastItem.value.indexOf(obj) == -1
    })
    emits("share", item, podcastNameToShare.value, "", getAddPodcastId[0])
  } else {
    const getDeletePodcastId = deletePodcastItem.value.filter(function (obj) {
      return podcastNameToShare.value.indexOf(obj) == -1
    })
    emits("share", item, podcastNameToShare.value, getDeletePodcastId[0], "")
  }
}

const getCurrentPodcast = () => {
  deletePodcastItem.value = podcastNameToShare.value
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
</style>
