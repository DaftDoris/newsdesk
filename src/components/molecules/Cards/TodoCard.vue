/* eslint-disable vue/no-mutating-props */
<template>
  <contenteditable
    tag="p"
    v-model="todo.text"
    :noNL="true"
    :noHTML="true"
    @returned="update"
  />

  <div class="flex justify-end mt-4">
    <Button class="btn-error mr-2" @click="emits('delete', todo)">
      Delete
    </Button>
    <Button
      :class="todo.done ? 'btn-warning' : 'btn-success'"
      @click="emits('toggle', todo)"
    >
      {{ todo.done ? "UnShare" : "Share" }}
    </Button>
  </div>
</template>

<script lang="ts" setup>
import contenteditable from "vue-contenteditable"
import { PropType } from "vue"
import { Todo } from "@/types/todo"
import Button from "@/components/atoms/Button.vue"

const update = (text: string) => {
  props.todo.text = text
  emits("update", props.todo)
}

const props = defineProps({
  todo: {
    type: Object as PropType<Todo>,
    default: null,
  },
})

const emits = defineEmits(["delete", "update", "save", "toggle"])
</script>

<style scoped></style>
