<template>
  <label class="w-11/12">
    <input
      class="input break-all max-w-full"
      :placeholder="placeholder"
      v-model="value"
      @keydown.enter.prevent="updateEvent"
      @blur="updateEvent"
    />
  </label>
</template>

<script lang="ts" setup>
import { useVModel } from "@vueuse/core"

const props = defineProps({
  placeholder: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(["update:modelValue"])
const value = useVModel(props, "modelValue", emit)
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
