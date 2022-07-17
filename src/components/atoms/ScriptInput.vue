<template>
  <label class="w-11/12">
    <input
      class="input break-all max-w-full"
      :placeholder="placeholder"
      v-model="text"
@keydown.enter.exact.prevent="save"
    />
  </label>
</template>

<script lang="ts" setup>
import { ref } from "vue"
const props = defineProps({
  placeholder: {
    type: String,
    default: null,
  },
  value: {
    type: String,
    default: null,
  },
})

const text = ref<string>('')

const emits = defineEmits(['save'])
const save = () => {
  emits("save", text.value)
}
</script>

<style scoped lang="scss">
.input {
  @apply appearance-none  dark:text-white bg-transparent focus:outline-none;
  width: 47vw;
}
label {
  @apply ss-furniture  dark:text-white;
}
</style>
