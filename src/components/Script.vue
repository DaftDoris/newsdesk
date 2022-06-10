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
      <p class="py-5 break-all" v-html="linkify(item.text)"></p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { usescriptStore } from "@/store/script"
import { computed } from "vue"
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

const linkify = (text: string) => {
  const itemText = text
    .replace(/(">.*?)<\/a>/g, "")
    .replace(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)/g, "")

  const replacePattern =
    /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim
  const replacedText = itemText.replace(replacePattern, function (link, m1) {
    return `<a class="cursor-pointer" style="color:rgb(37 99 235 / 1)" onclick="window.open('${link}').focus()" target="_blank" href="${link}">${link.length > 50 ? link.slice(0, 50) + "..." : link}</a>`
  })

  return replacedText.replace(/\n/g, "<br/>")
}
</script>

<style scoped lang="scss">
label {
  @apply ss-furniture text-5xl dark:text-white;
}
</style>
