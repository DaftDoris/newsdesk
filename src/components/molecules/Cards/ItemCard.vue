/* eslint-disable vue/no-mutating-props */
<template>
  <contenteditable
    tag="p"
    v-model="item.text"
    :noNL="false"
    :noHTML="true"
    @update:modelValue="update"
  />

  <div class="flex justify-end">
    <ListActionButton title="Delete" @click="emits('delete', item)">
      🗑
    </ListActionButton>
    <ListActionButton
      @click="emits('toggle', item)"
      title="Share"
    >
      {{ item.shared ? "❌" : "⬆️" }}
    </ListActionButton>
  </div>
</template>

<script lang="ts" setup>
import contenteditable from "vue-contenteditable"
import { PropType } from "vue"
import { Item } from "@/types/item"
import Button from "@/components/atoms/Button.vue"
import ListActionButton from "@/components/atoms/ListActionButton.vue"

const update = (text: string) => {
  props.item.text = text
  emits("update", props.item)
}

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    default: null,
  },
})

const emits = defineEmits(["delete", "update", "save", "toggle"])
</script>

<style scoped></style>
