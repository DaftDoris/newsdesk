/* eslint-disable vue/no-mutating-props */
<template>
  <contenteditable
    tag="p"
    v-model="item.text"
    :noNL="true"
    :noHTML="true"
    @returned="update"
  />

  <div class="flex justify-end mt-4">
    <Button class="btn-error mr-2" @click="emits('delete', item)">
      Delete
    </Button>
    <Button
      :class="item.done ? 'btn-warning' : 'btn-success'"
      @click="emits('toggle', item)"
    >
      {{ item.done ? "UnShare" : "Share" }}
    </Button>
  </div>
</template>

<script lang="ts" setup>
import contenteditable from "vue-contenteditable"
import { PropType } from "vue"
import { Item } from "@/types/item"
import Button from "@/components/atoms/Button.vue"

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
