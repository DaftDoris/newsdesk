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
      @keydown.tab.prevent="false"
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
      <ListActionButton @click="emits('toggle', item)" title="Share">
        <BookmarkIconSolid v-if="item.shared" />
        <BookmarkIcon v-else />
      </ListActionButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, computed, ref } from "vue"
import { Item } from "@/types/item"
import ListActionButton from "@/components/atoms/ListActionButton.vue"

import { BackspaceIcon, BookmarkIcon, HandIcon } from "@heroicons/vue/outline"
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/vue/solid"

const update = (text: any) => {
  const itemText = text.target?.innerHTML || ""
  const filterItemText = itemText.replace(/<\/a>/g, "").replace(/<a.*?>/g, "")
  // eslint-disable-next-line vue/no-mutating-props
  props.item.text = getItemText(filterItemText)
  emits("update", props.item)
}
const element = ref<HTMLElement | null>(null)

const dropped = (e: DragEvent) => {
  emits("dragged", e.clientX, e.clientY, props.item)
}

const getItemText = (itemText: string) => {
  let replacedText

  //URLs starting with http://, https://, https://.www or ftp://
  const replacePattern =
    /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim
  replacedText = itemText.replace(
    replacePattern,
    `<a class="cursor-pointer" onclick="window.open('$1').focus()" target="_blank">$1</a>`,
  )

  return replacedText.replace(/\n/g, "<br/>")
}

const htmlstring = computed(() => {
  const itemText = props.item.text.replace(/<\/a>/g, "").replace(/<a.*?>/g, "")
  return getItemText(itemText)
})

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    default: null,
  },
})

const emits = defineEmits(["delete", "update", "save", "toggle", "dragged"])
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
