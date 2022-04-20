/* eslint-disable vue/no-mutating-props */
<template>
  <p
    @blur="update"
    contenteditable="true"
    class="prose prose-a:text-blue-600"
    v-html="htmlstring"
    ref="element"
  ></p>

  <div class="flex justify-end">
    <ListActionButton title="Delete" @click="emits('delete', item)">
      🗑
    </ListActionButton>
    <ListActionButton @click="emits('toggle', item)" title="Share">
      {{ item.shared ? "❌" : "⬆️" }}
    </ListActionButton>
  </div>
</template>

<script lang="ts" setup>
import LinkifyIt from "linkify-it"
import { PropType, computed, ref } from "vue"
import { Item } from "@/types/item"
import Button from "@/components/atoms/Button.vue"
import ListActionButton from "@/components/atoms/ListActionButton.vue"

const linkify = LinkifyIt()

const update = (text: string) => {
  props.item.text = element.value.innerText
  emits("update", props.item)
}
const element = ref<HTMLElement | null>(null)

const htmlstring = computed(() => {
  const matches = linkify.match(props.item.text)
  return (
    matches?.reduce(
      (acc: string, match: unknown) =>
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

<style scoped></style>
