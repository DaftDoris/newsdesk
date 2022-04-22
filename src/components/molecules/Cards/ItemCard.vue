/* eslint-disable vue/no-mutating-props */
<template>
  <component
    :is="'p'"
    @focusout="update"
    contenteditable="true"
    class="prose prose-a:text-blue-600"
    v-html="htmlstring"
    ref="element"
  ></component>

  <div class="flex justify-end">
    <ListActionButton title="Delete" @click="emits('delete', item)">
                        <BackspaceIcon
              class="dark:text-white bg-transparent transition-colors "
            />
    </ListActionButton>
    <ListActionButton @click="emits('toggle', item)" title="Share">
      {{ item.shared ? "🙅‍♂️" : "💁" }}
    </ListActionButton>
  </div>
</template>

<script lang="ts" setup>
import LinkifyIt from "linkify-it"
import { PropType, computed, ref } from "vue"
import { Item } from "@/types/item"
import Button from "@/components/atoms/Button.vue"
import ListActionButton from "@/components/atoms/ListActionButton.vue"

import { BackspaceIcon } from "@heroicons/vue/outline"

const linkify = LinkifyIt()

const update = (text: string) => {
  props.item.text = element.value?.innerText || ""
  emits("update", props.item)
}
const element = ref<HTMLElement | null>(null)

const htmlstring = computed(() => {
  const matches = linkify.match(props.item.text)
  return (
    matches?.reduce(
      (acc: string, match) =>
        acc.replace(match.raw, `<a onclick="window.open('${match.url}', '_blank').focus()" href="${match.url}">${match.raw}</a>`),
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

const emits = defineEmits(["delete", "update", "save", "toggle"])
</script>

<style scoped lang="scss">
button svg {
  @apply w-6;
}
</style>
