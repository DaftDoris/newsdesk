<template>
  <div class="border-2 rounded-lg p-4">
    <label class="w-11/12">
      {{ slotno }} : 
      <input
        class="text-gray-400 max-w-full text-black"
        :placeholder="`${slotno} title`"
        v-model="scriptStore.getScriptSlotTitleList[slotno]"
        @keydown.enter.prevent="updateEvent"
        @blur="updateEvent"
      />
    </label>
    <div v-for="item in items" :key="item.id">
      <p class="py-5">{{ item.text }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { usescriptStore } from "@/store/script"
//eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  slotno: {
    type: Number,
    default: 1,
  },
  title: {
    type: String,
    default: "",
  },
  items: {
    type: Object,
    default: null,
  },
})
const updateEvent = () => {
  emits("updateEvent", scriptStore.getScriptSlotTitleList)
}
const emits = defineEmits(["updateEvent"])
const scriptStore = usescriptStore()
</script>

<style scoped lang="scss">
label {
  @apply ss-furniture text-5xl dark:text-white;
}
</style>
