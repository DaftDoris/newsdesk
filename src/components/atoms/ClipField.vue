<template>
  <div class="clip-field">
    <div class="clip-section">
      <label for="">CLIP URL:</label>
      <input
        class="input break-all bg-transparent text-blue-600"
        placeholder="URL"
        v-model="clipField.clip_url"
      />
    </div>
    <div class="clip-section border-l-2 border-gray-400">
      <label for="">In:</label>
      <input
        class="input break-all bg-transparent w-8/12 text-gray-600"
        placeholder="In"
        v-model="clipField.in_time"
        id="inTimeClipField"
      />
    </div>
    <div class="clip-section border-l-2 border-gray-400">
      <input
        class="input break-all bg-transparent w-10/12 text-gray-600"
        placeholder="message"
        v-model="clipField.in_msg"
      />
    </div>
    <div class="clip-section border-l-2 border-gray-400">
      <label for="">Out:</label>
      <input
        class="input break-all bg-transparent w-8/12 text-gray-600"
        placeholder="Out"
        v-model="clipField.out_time"
        id="outTimeClipField"
      />
    </div>
    <div class="clip-section border-l-2 border-gray-400">
      <input
        class="input break-all bg-transparent w-10/12 text-gray-600"
        placeholder="message"
        v-model="clipField.out_msg"
      />
    </div>
    <div class="clip-section border-l-2 border-gray-400">
      <BackspaceIcon class="w-5 h-5" @click="emits('delete', index)" />
    </div>
  </div>
</template>
  
  <script lang="ts" setup>
  
import { BackspaceIcon } from "@heroicons/vue/outline"
import { PropType } from "vue"
const props = defineProps({
  index: {
    type: Number,
    default: null,
  },
  clipField: {
    type: Object,
    default: null,
  },
})

const emits = defineEmits(["delete"])

</script>
  
  <style scoped lang="scss">
.title {
  @apply appearance-none text-5xl dark:text-white bg-transparent focus:outline-none;
  width: 47vw;
}
label {
  @apply text-5xl dark:text-white;
}
.clip-field {
  @apply border-2 rounded-b-lg flex border-gray-400;
  background-color: #e3e4e4;
  margin: 20px -2px -2px -2px;
}
.clip-field label {
  @apply text-base whitespace-nowrap mr-2;
}
.clip-field .clip-section {
  @apply p-2 flex;
}
.clip-field .clip-section input {
  @apply font-semibold outline-none;
}
.script-section textarea.input {
  font-size: 16px !important;
}
</style>
  
