<template>
  <main
    v-show="initiated && isAuthenticated"
    class="h-full grid grid-cols-3 gap-4 divide-x"
  >
    <div class="px-4">
      <h2 class="text-2xl dark:text-white">Longer List</h2>
      <p>coming soon...</p>
    </div>
    <div class="px-4 mt-4">
      <section ref="t5">
        <InputCard @save="events.onClickSave" />
      </section>
      <section ref="t6">
        <List>
          <template v-for="item in todoStore.getList" :key="item.id">
            <ListItem>
              <TodoCard
                :todo="item"
                @delete="events.onClickDelete"
                @toggle="events.onClickToggle"
                @update="events.onClickUpdate"
              />
            </ListItem>
          </template>
        </List>
      </section>
    </div>
    <div class="px-4">
      <h2 class="text-2xl dark:text-white">Script</h2>
      <p>coming soon...</p>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { watch, ref } from "vue"
import { storeToRefs } from "pinia"
import { useAuthStore } from "@/store/auth"
import { useTodoStore } from "@/store/todo"
import { Todo } from "@/types/todo"

import List from "@/components/atoms/List.vue"
import ListItem from "@/components/atoms/ListItem.vue"
import TodoCard from "@/components/molecules/Cards/TodoCard.vue"
import InputCard from "@/components/molecules/Cards/InputCard.vue"

const authStore = useAuthStore()
const todoStore = useTodoStore()

const initiated = ref(false)

const { user, isAuthenticated } = storeToRefs(authStore)

watch(
  isAuthenticated,
  async (authenticated) => {
    if (authenticated) {
      await todoStore.fetchTodo(user.value?.userId)
      initiated.value = true
    }
  },
  {
    immediate: true,
  },
)

const events = {
  onClickSave(text: string) {
    todoStore.addTodo({ text, level: 0 }, user.value?.userId)
  },
  onClickDelete(todo: Todo) {
    todoStore.removeTodo(todo, user.value?.userId)
  },
  onClickUpdate(todo: Todo) {
    todoStore.updateTodo(todo, user.value?.userId)
  },
  onClickToggle(todo: Todo) {
    todoStore.modifyTodo({ ...todo, done: !todo.done }, user.value?.userId)
  },
}
</script>

<style scoped lang="scss"></style>
