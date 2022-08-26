<template>
  <label :class="{ 'flex w-flull': script, 'w-11/12': !script }">
   <span v-if="!script">{{ slotno }}:</span> 
    <input
      v-if="!script"
      class="input break-all max-w-full"
      :placeholder="`title`"
      v-model="value"
      @keydown.enter.prevent="updateEvent"
      @blur="updateEvent"
    />
    <input
      v-else
      class="input break-all max-w-full"
      :placeholder="`${slotno} Enter title`"
      id="scriptSlotTitle"
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
    script: boolean
    updateEvent: () => void
  }>(),
  {
    modelValue: "",
    slotno: 0,
    script: false,
  },
)

const emit = defineEmits(["update:modelValue"])
const value = useVModel(props, "modelValue", emit)
</script>

<style scoped lang="scss">
.input {
  @apply appearance-none text-4xl dark:text-white bg-transparent focus:outline-none;
  width: 47vw;
}
label {
  @apply ss-furniture text-4xl dark:text-white;
}
</style>
