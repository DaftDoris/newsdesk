<template>
  <contenteditable tag="p" 
  v-model="text" :noNL="true" :noHTML="true" @returned="update" />

    <div class="flex justify-end mt-4">
      <Button class="btn-error mr-2" @click="emits('delete', todo)">
        Delete
      </Button>
      <Button
        :class="todo.done ? 'btn-warning' : 'btn-success'"
        @click="emits('toggle', todo)"
      >
        {{ todo.done ? 'Revert' : 'Done' }}
      </Button>
  </div>
</template>

<script lang="ts" setup>
import contenteditable from 'vue-contenteditable'
import { computed, PropType, SetupContext, defineComponent } from "vue";
import { Todo } from "@/types/todo";
import { dateString } from "@/utils/stringFormat";
import Button from "@/components/atoms/Button.vue";
import { ref } from 'vue'

const text = ref<string>(props.todo.text)


// // use defineComponent
// export default defineComponent({
//   components: {
//     Button
//   },
//   props: {
//     todo: {
//       type: Object as PropType<Nullable<Todo>>,
//       default: () => null
//     }
//   },
//   emits: ['delete', 'toggle'],
//   setup (props) {
//     const createdAt = computed(() => dateString(props.todo?.createdAt ?? ''))
//
//     return {
//       createdAt
//     }
//   }
// })
// const text = ref<string>('')

const update = (text: string) => {
  props.todo.text = text
  emits('update', props.todo)
}

const props = defineProps({
  todo: {
    type: Object as PropType<Todo>,
    default: null,
  },
});

const emits = defineEmits(["delete", "update", "save"]);

// const save = () => {
//   emits("save", text.value);
//   text.value = "";
// };
// const emits = defineEmits(['save'])

const createdAt = computed(() => dateString(props.todo?.createdAt ?? ""));
</script>

<style scoped></style>
