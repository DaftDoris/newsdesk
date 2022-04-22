<template>
  <label>
    {{ slotno }}:
    <input
      class="input"
      :placeholder="`${slotno} title`"
      v-model="value"
      @keydown.enter.prevent="updateEvent"
      @blur="updateEvent"
    />
  </label>
</template>

<script lang="ts" setup>
import { useVModel } from "@vueuse/core"

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    slotno: number
    updateEvent: () => void
  }>(),
  {
    modelValue: "",
    slotno: 0,
  },
)

const emit = defineEmits(["update:modelValue"])
const value = useVModel(props, "modelValue", emit)
</script>

<style scoped lang="scss">
.input {
  @apply appearance-none text-5xl dark:text-white bg-transparent focus:outline-none;
}
label {
  @apply text-5xl dark:text-white;
}
</style>
