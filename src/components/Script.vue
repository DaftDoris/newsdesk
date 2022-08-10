<!-- eslint-disable prettier/prettier -->
<template>
  <div id="script-{{ slotno }}" class="border-2 script-section rounded-lg border-gray-400">
    <label class="w-full p-4 flex text-4xl">
      {{ slotno }} :
      <span @click="updateClipField" class="text-gray-400 flex justify-between items-center w-11/12">{{ slotno }} title
        <VolumeUpIcon class="h-8" />
      </span>
    </label>

    <div v-for="(itemMain, index) in clipFieldData" :key="index">
      <span v-for="(itemIn, indexNew) in itemMain.params" :key="indexNew">
        <div @dragend="dropped($event, indexNew)" draggable="true" class="mt-5">
          <Input v-model="itemIn.label" :placeholder="`Enter things into ${slotno}...`"
            @keydown.enter.exact.prevent="save" />
          <ClipField class="text-base" :index="indexNew" :clipField="itemIn?.clipField"
            @delete="deleteClip(itemMain.id)" @change="updateClips()"></ClipField>
        </div>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, reactive, onMounted } from "vue"
import { useItemStore } from "@/store/item"

import Input from "@/components/atoms/Input.vue"
import ClipField from "@/components/atoms/ClipField.vue"
import { VolumeUpIcon } from "@heroicons/vue/outline"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const itemStore = useItemStore()
const props = defineProps({
  podcastId: {
    type: String,
    required: true
  },
  slotno: {
    type: Number,
    default: 1,
  },
  clipFieldData: {
    type: Object,
    default: null,
  },
})
const mainArray = props.clipFieldData
const emits = defineEmits(["save", "dragged"])
const updateClipField = () => {
  props.clipFieldData[0].params.push({
    label: "",
    clipField: {
      clip_url: "",
      in_time: "",
      in_msg: "",
      out_time: "",
      out_msg: "",
    },
  })
}

const updateClips = () => {
  itemStore.setItemToSlot(props.clipFieldData, props.podcastId)
}
const dropped = (e: DragEvent, index: number) => {
  if (e.offsetY < -20) {
    itemStore.moveClipField(index, "top", props.podcastId, props.slotno)
    console.log("top", index)
  } else {
    itemStore.moveClipField(index, "bottom", props.podcastId, props.slotno)
    console.log("bottom", index)
  }
}
const deleteClip = (id: string) => {
  itemStore.deleteScriptClipField(id, props.podcastId)
}



const text = ref<string>("")
const save = () => {
  // emits('save', props.clipFieldData, props.slotno)
}
</script>

<style scoped lang="scss">
.title {
  @apply appearance-none text-5xl;
  width: 47vw;
}

label {
  @apply text-5xl;
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
  margin-top: 5px !important;
}
</style>
