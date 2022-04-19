import { nanoid } from "nanoid"
import { defineStore } from "pinia"
import { fetchData, saveData } from "@/utils/api"
import useAsync from "@/hooks/useAsync"
import { Todo } from "@/types/todo"

interface State {
  todoList: Todo[]
}

export const useTodoStore = defineStore("todo", {
  state: (): State => ({
    todoList: [],
  }),
  actions: {
    async addTodo(params: Todo, userId?: string) {
      const id = nanoid()
      const createdAt = new Date()
      const done = false
      const todo: Todo = { ...params, id, createdAt, done }

      this.todoList.push(todo)
      await useAsync(() => saveData(this.todoList, userId || "unknown"))
    },
    async removeTodo(todo: Todo, userId?: string) {
      const index = this.todoList.findIndex((x) => x.id === todo.id)

      if (index < 0) {
        throw new Error(`Can't find todo item [${todo.id}]`)
      }

      this.todoList.splice(index, 1)
      await useAsync(() => saveData(this.todoList, userId || "unknown"))
    },
    async updateTodo(todo: Todo, userId?: string) {
      // const index = this.todoList.findIndex(x => x.id === todo.id)

      // if (index < 0) {
      //   throw new Error(`Can't find todo item [${todo.id}]`)
      // }

      // this.todoList.splice(index, 1)
      await useAsync(() => saveData(this.todoList, userId || "unknown"))
    },
    async modifyTodo(todo: Todo, userId?: string) {
      const index = this.todoList.findIndex((x) => x.id === todo.id)

      if (index < 0) {
        throw new Error(`Can't find todo item [${todo.id}]`)
      }

      this.todoList.splice(index, 1, todo)
      await useAsync(() => saveData(this.todoList, userId || "unknown"))
    },
    async fetchTodo(userId?: string) {
      this.todoList = await useAsync(() => fetchData(userId || "unknown"))
    },
  },
  getters: {
    getList: (state: State) => state.todoList,
    getAllList: (state): Todo[] => [
      ...state.todoList.filter((x) => !x.done),
      ...state.todoList.filter((x) => x.done),
    ],
  },
})
