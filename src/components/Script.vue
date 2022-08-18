<!-- eslint-disable prettier/prettier -->
<template>
  <div id="script-{{ slotno }}" class="script-section">
    <div v-for="(itemMain, index) in clipFieldData" :key="index">
      <span v-for="(itemIn, indexNew) in itemMain.params" :key="indexNew">
        <div @dragend="dropped($event, indexNew)" draggable="true">
          <Input v-model="itemIn.label" :placeholder="`Enter things into ${slotno}...`"
            @change="updateClips()" />
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
import SlotTitleInput from "@/components/atoms/SlotTitleInput.vue"
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
  date: {
    type: String,
    default: new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0],
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
  console.log(window.location)
  itemStore.setItemToSlot(props.clipFieldData, props.podcastId, props.date)
}
const dropped = (e: DragEvent, index: number) => {
  if (e.offsetY < -20) {
    itemStore.moveClipField(index, "top", props.podcastId, props.slotno, props.date)
    console.log("top", index)
  } else {
    itemStore.moveClipField(index, "bottom", props.podcastId, props.slotno, props.date)
    console.log("bottom", index)
  }
}
const deleteClip = (id: string) => {
  itemStore.deleteScriptClipField(id, props.podcastId, props.date)
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
  @apply text-4xl;
}

.clip-field {
  @apply border rounded-b-lg flex border-gray-400;
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
