<template>
  <div class="border-2 script-section rounded-lg border-gray-400">
    <label class="w-full p-4 flex">
      {{ slotno }} :
      <span @click="updateClipField" class="text-gray-400 flex justify-between  items-center w-11/12">{{ slotno }} title <VolumeUpIcon class="h-8"  /></span>
    </label>
    <span v-for="(item, index) in items" :key="index">
     <Input
      v-model="item.label"
      :placeholder="`Enter things into ${slotno}...`"
      @keydown.enter.exact.prevent="save"
    />
    <ClipField :index="index" :clipField="item?.clipField" @delete="deleteClip"></ClipField>
    </span>
   
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, reactive, onMounted } from "vue"

import Input from '@/components/atoms/Input.vue'
import ClipField from '@/components/atoms/ClipField.vue'
import { VolumeUpIcon } from "@heroicons/vue/outline"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  slotno: {
    type: Number,
    default: 1,
  },
})
const emits = defineEmits(['save'])
const items = ref([{label:'key0', clipField :{
   clip_url : "",
   in_time : "",
   in_msg : "",
   out_time : "",
   out_msg : ""
}}])
const updateClipField = () => {
  items.value.push({label:`key${items.value.length}`, clipField :{
   clip_url : "",
   in_time : "",
   in_msg : "",
   out_time : "",
   out_msg : ""
}})
}
const deleteClip = (setIndex:any) => {
  items.value.splice(setIndex, 1)

}

const text = ref<string>('')
const save = () => {
  emits('save', text.value, props.slotno)
  text.value = ''
}
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
.script-section textarea.input{
  font-size: 16px !important;
}
</style>
