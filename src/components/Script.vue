<!-- eslint-disable prettier/prettier -->
<template>
  <div id="script-{{ slotno }}" class="script-section">
    <span @click="updateClipField" class="absolute inline-block text-gray-400" style="right: 10px;top: 22px;">
      <VolumeUpIcon class="h-8 dark:text-white" />
    </span>
    <div v-for="(itemMain, index) in clipFieldData" :key="index">
      <span v-for="(itemIn, indexNew) in itemMain.params" :key="indexNew">
        <div @dragend="dropped($event, indexNew)" draggable="true">
          <editor api-key='wrg3d2pspm50rpya2jigebeiglg262wyd6x87rf2nnh2jjfh' v-model="itemIn.label"
            @keyup="emits('keypress', 'checkUpdate')" @change="updateClips()" :init="{ /* your other settings */ }" />
          <ClipField class="text-base" :index="indexNew" :clipField="itemIn?.clipField"
            @delete="deleteClipNew(itemMain.id,indexNew)" @change="updateClips()"></ClipField>
        </div>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, reactive, onMounted } from "vue"
import { useItemStore } from "@/store/item"
import Editor from '@tinymce/tinymce-vue'
import { VolumeUpIcon } from "@heroicons/vue/outline"
import ClipField from "@/components/atoms/ClipField.vue"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const editor = Editor
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
const emits = defineEmits(["save", "dragged", "keypress"])

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
  itemStore.setItemToSlot(props.clipFieldData, props.podcastId, props.date)
}
const dropped = (e: DragEvent, index: number) => {
  if (e.offsetY < -20) {
    itemStore.moveClipField(index, "top", props.podcastId, props.slotno, props.date)
  } else {
    itemStore.moveClipField(index, "bottom", props.podcastId, props.slotno, props.date)
  }
}
const deleteClip = (id: string) => {
  itemStore.deleteScriptClipField(id, props.podcastId, props.date)
}

const deleteClipNew = (id: string, ind: number) => {
  itemStore.deleteScriptClipFieldNew(id, ind, props.podcastId, props.date)
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
  margin-top: -18px !important;
  z-index: 99;
  position: relative;
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

.tox .tox-statusbar {
  display: none !important;
}
</style>
