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
        <InputCard
          v-model:show-all="checked"
          @save="events.onClickSave"
          ref="helloWorld"
        />
      </section>
      <section ref="t6">
        <List>
          <template v-for="item in computedRefs.todoList" :key="item.id">
            <ListItem>
              <TodoCard
                :todo="item"
                @delete="events.onClickDelete"
                @toggle="events.onClickToggle"
              />
            </ListItem>
          </template>
          <template v-if="todoList.length === 0">
            <ListItem>
              <NoneCard :no-item="haveNoItem" />
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
import { computed, watch, ref, onMounted, toRefs, Ref, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useClock } from "@/hooks/useClock";
import { useFadeInOut } from "@/hooks/styles/useTransitions";
import {
  useHtmlTemplateRefs,
  useHasHelloWorldTemplateRefs,
} from "@/hooks/useTemplateRefs";
import { useAuthStore } from "@/store/auth";
import { useTodoStore } from "@/store/todo";
import { useDialog } from "@/store/useDialog";
import { Todo } from "@/types/todo";

import List from "@/components/atoms/List.vue";
import ListItem from "@/components/atoms/ListItem.vue";
import TodoCard from "@/components/molecules/Cards/TodoCard.vue";
import InputCard from "@/components/molecules/Cards/InputCard.vue";
import NoneCard from "@/components/molecules/Cards/NoneCard.vue";

const router = useRouter();
const authStore = useAuthStore();
const todoStore = useTodoStore();
const { showDialog, showConfirm } = useDialog();
const clock = useClock();

const checked = ref(false);

const { helloWorld } = useHasHelloWorldTemplateRefs(["helloWorld"]);

const zxc = ["t1", "t2", "t3", "t4", "t5", "t6", "t7"];
const { t1, t2, t3, t4, t5, t6, t7 } = useHtmlTemplateRefs([
  "t1",
  "t2",
  "t3",
  "t4",
  "t5",
  "t6",
  "t7",
]);
//  or can use this like this
// const { t1, t2, t3, t4, t5, t6, t7 } = useTemplateRefsWrap<HTMLElement>()(['t1', 't2', 't3', 't4', 't5', 't6', 't7'])
//  or list all of template refs... 😖
// const t1 = ref<HTMLElement>()
// const t2 = ref<HTMLElement>()
// const t3 = ref<HTMLElement>()
// const t4 = ref<HTMLElement>()
// const t5 = ref<HTMLElement>()
// const t6 = ref<HTMLElement>()
// const t7 = ref<HTMLElement>()

const { start, initiated } = useFadeInOut([t1, t2, t3, t4, t5, t6, t7], {
  milliseconds: 450,
});

const { user, isAuthenticated } = storeToRefs(authStore);

const todoList = computed<Todo[]>(() =>
  checked.value ? todoStore.getAllList : todoStore.getNotDoneList
);
const notDoneList = computed<Todo[]>(() => todoStore.getNotDoneList);
const haveNoItem = computed<boolean>(() => todoStore.getAllList.length === 0);
const todayMessage = computed<string>(() => {
  if (haveNoItem.value)
    return `you haven't registered <span class="font-bold">any task</span> yet.`;
  if (notDoneList.value.length > 0)
    return `${notDoneList.value.length} more <span class="emphasis">task${
      notDoneList.value.length > 1 ? "s" : ""
    }</span> ${notDoneList.value.length > 1 ? "are" : "is"} left.`;
  return `You're having a <span class="emphasis">great</span> day 🥰`;
});
//  or can use this like this.
const computedRefs = reactive({
  todoList,
  notDoneList,
  haveNoItem,
  todayMessage,
});

watch(
  isAuthenticated,
  async (authenticated) => {
    if (authenticated) {
      await todoStore.fetchTodo(user.value?.userId);
      await start();
    }
  },
  {
    immediate: true,
  }
);

const events = {
  onClickSave(text: string) {
    if (text === "hello-world-test") {
      helloWorld.value?.helloWorld();
      return;
    }

    if (text === "route-test") {
      router.push("/route-test");
      return;
    }

    if (text.length === 0) {
      showDialog("Please enter something 🥲");
      return;
    }

    todoStore.addTodo({ text, level: 0 }, user.value?.userId);
  },
  onClickDelete(todo: Todo) {
    showConfirm(
      "Do you want to delete this todo? 🧐",
      (confirmed: boolean) => {
        confirmed && todoStore.removeTodo(todo, user.value?.userId);
      },
      "Delete Todo"
    );
  },
  onClickToggle(todo: Todo) {
    todoStore.modifyTodo({ ...todo, done: !todo.done }, user.value?.userId);
  },
};
</script>

<style scoped lang="scss"></style>
