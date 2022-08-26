<template>
  <div class="clip-field">
    <div class="clip-section">
      <label for="">CLIP URL:</label>
      <div class="relative"> <input class="input break-all bg-transparent text-transparent workSans" id="clip_url"
          placeholder="https://bitly.ly/links" v-model="clipField.clip_url" /><a class="text-blue-600 left-0" id="clip_url_link"
          target="_blank" @click="redirectTo(clipField.clip_url)">{{ clipField.clip_url }}</a></div>
    </div>
    <div class="clip-section border-l border-gray-400">
      <label for="">In:</label>
      <input class="input break-all bg-transparent w-8/12 text-gray-600 workSans" id="in_time" placeholder="00:00"
        v-model="clipField.in_time" />
    </div>
    <div class="clip-section border-l border-gray-400">
      <input class="input break-all bg-transparent w-10/12 text-gray-600" id="in_msg" placeholder="Hello..."
        v-model="clipField.in_msg" />
    </div>
    <div class="clip-section border-l border-gray-400">
      <label for="">Out:</label>
      <input class="input break-all bg-transparent w-8/12 text-gray-600 workSans" id="out_time" placeholder="00:30"
        v-model="clipField.out_time" />
    </div>
    <div class="clip-section border-l border-gray-400">
      <input class="input break-all bg-transparent w-10/12 text-gray-600" id="out_msg" placeholder="...Goodbye"
        v-model="clipField.out_msg" />
    </div>
    <div class="clip-section border-l border-gray-400">
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
const redirectTo = (url: string) => {
  window.open(url, "_blank")
}
const emits = defineEmits(["delete"])
</script>
  
  <style scoped lang="scss">
  .title {
    @apply appearance-none text-5xl focus:outline-none;
    width: 47vw;
    font-size: .9rem;
    font-weight: 200;
    color: #414141;
    line-height: 1.5rem;
  }
  
  label {
    @apply text-5xl;
    font-size: .9rem;
    font-weight: 200;
    color: #414141;
    line-height: 1.5rem;
  }
  
  .clip-field {
    @apply rounded-b-lg flex border-gray-400;
    background-color: #e3e4e4;
    margin: 0px !important;
    font-size: .9rem;
    font-weight: 200;
    color: #414141;
    line-height: 1.5rem;
  }
  
  .clip-field label {
    @apply text-base whitespace-nowrap mr-2;
    font-size: .9rem;
    font-weight: 200;
    color: #414141;
    line-height: 1.5rem;
  }
  
  .clip-field .clip-section {
    @apply p-2 flex;
    height: 40px;
    font-size: .9rem;
    font-weight: 200;
    color: #414141;
    line-height: 1.5rem;
  }
  
  .clip-field .clip-section a {
    transform: translate(0px, -100%);
    @apply block;
  
  }
  
  .clip-field .clip-section input {
    @apply font-semibold outline-none;
    font-size: .9rem;
    font-weight: 200;
    color: #414141;
    line-height: 1.5rem;
  }
  
  .script-section textarea.input {
    font-size: 16px !important;
    font-size: .9rem;
    font-weight: 200;
    color: #414141;
    line-height: 1.5rem;
  }
  .workSans {
    font-family: 'Work Sans', sans-serif !important;
    font-size: .9rem;
    font-weight: 200;
    color: #414141;
    line-height: 1.5rem;
  }
  </style>

