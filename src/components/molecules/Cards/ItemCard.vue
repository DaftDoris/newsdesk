/* eslint-disable vue/no-mutating-props */
<template>
  <div class="handle flex justify-between	items-center" draggable="true" @dragend="dropped">
    <component
      :is="'p'"
      @focusout="update"
      contenteditable="true"
      class="prose prose-a:text-blue-600 grow"
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
import LinkifyIt from "linkify-it"
import { PropType, computed, ref } from "vue"
import { Item } from "@/types/item"
import Button from "@/components/atoms/Button.vue"
import ListActionButton from "@/components/atoms/ListActionButton.vue"

import { BackspaceIcon, BookmarkIcon, HandIcon } from "@heroicons/vue/outline"
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/vue/solid"

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
