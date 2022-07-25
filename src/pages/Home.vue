<template>
  <main v-show="initiated && isAuthenticated" class="h-full grid grid-cols-5 gap-4 divide-x">
    <div class="px-4 column-h overflow-y-auto" id="inbox-column" :class="{ 'col-span-3': hideShowColumn.inbox }">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl dark:text-white">Inbox</h2>
        <ListActionButton title="toggle inbox expansion">
          <PlusIcon @click="hideShowColumn.inbox = true, hideShowColumn.script = hideShowColumn.draft = false"
            v-if="!hideShowColumn.inbox" class="dark:text-white bg-transparent transition-colors w-6" />
          <MinusIcon class="dark:text-white bg-transparent transition-colors w-6"
            @click="hideShowColumn.inbox = false, hideShowColumn.draft = true" v-else />
        </ListActionButton>
      </div>
      <inbox :podcastId="podcastId" :docname="docname" @draggedInbox="draggedInbox"
        @delete="events.onClickInboxDelete" />
    </div>
    <div class="px-4 column-h overflow-y-auto" id="draft-column" :class="{ 'col-span-3': hideShowColumn.draft }">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl dark:text-white">Draft</h2>
        <ListActionButton title="toggle draft expansion">
          <PlusIcon @click="hideShowColumn.draft = true, hideShowColumn.script = hideShowColumn.inbox = false"
            v-if="!hideShowColumn.draft" class="dark:text-white bg-transparent transition-colors w-6" />
          <MinusIcon class="dark:text-white bg-transparent transition-colors w-6"
            @click="hideShowColumn.draft = false, hideShowColumn.inbox = true" v-else />
        </ListActionButton>
      </div>
      <section v-for="slot in Array.from({ length: 7 }, (_, i) => 7 - i)" :key="slot" :slotno="slot">
        <div class="flex items-center justify-between">
          <SlotTitleInput v-model="itemStore.getSlotTitleList[slot]" :slotno="slot"
            :updateEvent="events.onUpdateSaveDoc" />
          <span class="relative flex">
            <button title="Copy Slot item" @click="copySlotText(slot)"
              class="text-white font-bold p-2 rounded transition-colors">
              <ClipboardCopyIcon class="h-6 w-6 text-black" />
              <div class="
                  rounded-md
                  absolute
                  bottom-10
                  w-fit
                  right-1
                  text-white
                  bg-black
                  p-1
                  border-radius
                " v-if="showTooltip[slot]">
                Copied
              </div>
            </button>
          </span>
        </div>
        <InputCard @save="events.onClickSave" :slot="slot" />
        <List>
          <template v-for="item in itemStore.getSlotList(slot).reverse()" :key="item.id">
            <ListItem>
              <ItemCard :item="item" @delete="events.onClickDelete" @share="events.onClickShare"
                @update="events.onClickUpdate" @dragged="dragged" />
            </ListItem>
          </template>
        </List>
      </section>
    </div>
    <div class="px-4 column-h overflow-y-auto" id="script-column" :class="{ 'col-span-3': hideShowColumn.script }">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl dark:text-white">Script</h2>
        <ListActionButton title="toggle script expansion">
          <PlusIcon @click="hideShowColumn.script = true, hideShowColumn.draft = hideShowColumn.inbox = false"
            v-if="!hideShowColumn.script" class="dark:text-white bg-transparent transition-colors w-6" />
          <MinusIcon class="dark:text-white bg-transparent transition-colors w-6"
            @click="hideShowColumn.script = false, hideShowColumn.inbox = true" v-else />
        </ListActionButton>
      </div>

      <div class="mt-10" id="script-data">
        <ScriptInput id="scriptTitleInput" placeholder="Title" @save="events.saveInputTitle" />
        <ScriptInput id="scriptSpecialDaysInput" placeholder="Special Days" @save="events.saveInputSpecialDay" />
        <ScriptInput id="scriptBirthdaysInput" placeholder="Birthdays" @save="events.saveInputBirthdays" />
        <div class="text-center font-bold text-lg">
          Clips: <span id="totalClipTime">{{ totalClipTime }}</span> |
          Script: <span id="totalScriptTime">{{ totalScriptTime }}</span> |
          Total: <span id="totalTime">{{ totalTime }}</span> |
          <span @click="exportScript">
            Export
            <CloudUploadIcon class="dark:text-white bg-transparent transition-colors w-6 in-line" />
          </span>
        </div>
        <div v-for="slot in Array.from({ length: 7 }, (_, i) => 7 - i)" :key="slot">


          <Scripts class="my-5" :slotno="slot" :clipFieldData="itemStore.getScriptList(slot)" :podcastId="podcastId"
            @save="events.onClickScriptsSave" @change="checkUpdate(slot)" />

        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { watch, ref, reactive, onMounted } from "vue"
import { storeToRefs } from "pinia"
import { useAuthStore } from "@/store/auth"
import { useItemStore } from "@/store/item"
import { useShareStore } from "@/store/itemShare"
import { Item } from "@/types/item"

import List from "@/components/atoms/List.vue"
import ListItem from "@/components/atoms/ListItem.vue"
import Inbox from "@/components/Inbox.vue"
import ItemCard from "@/components/molecules/Cards/ItemCard.vue"
import InputCard from "@/components/molecules/Cards/InputCard.vue"
import SlotTitleInput from "@/components/atoms/SlotTitleInput.vue"
import ScriptInput from "@/components/atoms/ScriptInput.vue"
import ListActionButton from "@/components/atoms/ListActionButton.vue"
import { PlusIcon, MinusIcon, ClipboardCopyIcon, CloudUploadIcon } from "@heroicons/vue/outline"
import Scripts from "@/components/Script.vue"
import { useRoute } from "vue-router"

const authStore = useAuthStore()
const itemStore = useItemStore()
const shareStore = useShareStore()
const initiated = ref(false)
const route = useRoute()

const slotItems: any = [];
let totalClipTime: string = '00:00';
let totalScriptTime: string = '00:00';
let totalTime: string = '00:00';

const { user, isAuthenticated } = storeToRefs(authStore)

const props = defineProps({
  podcastId: {
    type: String,
    default: "smart7",
  },
  date: {
    type: String,
    default: new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0],
  },
})

const showTooltip = ref(Array.from({ length: 7 }, (_, i) => false))
// @TODO: work with todays date
const docname: any = ref(props.date)
const hideShowColumn = reactive({
  inbox: false,
  draft: true,
  script: false,
})
const draggedInbox = (x: number, y: number, text: string, key: string) => {
  const slot = <Item["slot"]>parseInt(
    <
    string // @ts-ignore
    >document.elementFromPoint(x, y)?.closest("section")?.attributes["slotno"]?.value,
  )

  if (slot) {
    itemStore.addItem({ text, slot }, props.podcastId, docname)
    shareStore.removeDraggedItem(text, props.podcastId, key)
    shareStore.connect(props.podcastId)
  }
}

const removeItemFromSlot = async () => {

  if (localStorage.getItem("deleteClip") != null) {
    const deleteClip = JSON.parse(localStorage.getItem("deleteClip") || "");
    localStorage.removeItem("deleteClip");
    let slotitemData = slotItems[deleteClip.slotno].items;
    slotitemData.splice(deleteClip.index, 1);
    let slotitem: any = [];
    if (slotitemData.length > 0) { slotitemData.forEach((element: any) => { slotitem.push(element) }); }
    slotItems[deleteClip.slotno].items = slotitem;
    await updateClipTime();
  }
}

const checkUpdate = async (slot: any) => {
  // let items: any = await itemStore.getSlotItem();
  let totalClipSeconds = 0;
  let scriptCount = 0;
  for (let i = 1; i < 8; i++) {
    const slotitemData = itemStore.getScriptList(i)
    if (slotitemData.length > 0) {
      console.log(`slotitemData => ${i}`, slotitemData);
      slotitemData.forEach((element) => {
        const clipField = element.params[0].clipField
        let text = element.params[0].label.replace(/\n/g, "");
        scriptCount += text.split(" ").length;

        const in_time = clipField.in_time.split(":");
        const out_time = clipField.out_time.split(":");
        const in_seconds = (parseInt(in_time[0]) * 60) + parseInt(in_time[1]);
        const out_seconds = (parseInt(out_time[0]) * 60) + parseInt(out_time[1]);
        let seconds = out_seconds - in_seconds;
        if (!isNaN(seconds)) { totalClipSeconds += seconds }
        console.log(`slotitem => ${i}`, clipField);
      });
    }
  }

  const remainingSeconds = totalClipSeconds % 60;
  const minutes = Math.floor(totalClipSeconds / 60);
  totalClipTime = `${(minutes < 10) ? "0" + minutes : minutes}:${(remainingSeconds < 10) ? "0" + remainingSeconds : remainingSeconds}`;
  let shoetime = document.getElementById("totalClipTime") as HTMLSpanElement;
  shoetime.innerText = totalClipTime;

  // Total Script Time
  let ratio = (scriptCount / 185) * 60;
  const ScriptSeconds = Math.floor(ratio % 60);
  const ScriptMinutes = Math.floor(ratio / 60);
  totalScriptTime = `${(ScriptMinutes < 10) ? "0" + ScriptMinutes : ScriptMinutes}:${(ScriptSeconds < 10) ? "0" + ScriptSeconds.toFixed(0) : ScriptSeconds.toFixed(0)}`;
  let showScriptTime = document.getElementById("totalScriptTime") as HTMLSpanElement;
  showScriptTime.innerText = totalScriptTime;

  // totalTime
  let combinedSeconds = remainingSeconds + ScriptSeconds + 58;
  let calculatedMinutes = Math.floor(combinedSeconds / 60);
  let calculatedSeconds = Math.floor(combinedSeconds % 60);
  let combinedMinutes = minutes + ScriptMinutes + calculatedMinutes;
  let TotalCombinedSecomds = combinedMinutes * 60 + calculatedSeconds;
  totalTime = (TotalCombinedSecomds > 58)
    ? `${(combinedMinutes < 10) ? "0" + combinedMinutes : combinedMinutes}:${(calculatedSeconds < 10) ? "0" + calculatedSeconds : calculatedSeconds}`
    : "00:00"
  let showTotalTime = document.getElementById("totalTime") as HTMLSpanElement;
  showTotalTime.innerText = totalTime;
  showTotalTime.style.color = (TotalCombinedSecomds < (7 * 60)) ? "red" : "black";

}

const updateClipTime = async () => {
  let totalClipSeconds = 0;
  slotItems.forEach(async (item: any) => {
    item.items.forEach(async (element: any) => {
      const clipField = element.clipField;
      // change strint to minutes and seconds
      const in_time = clipField.in_time.split(":");
      const out_time = clipField.out_time.split(":");
      const in_seconds = (parseInt(in_time[0]) * 60) + parseInt(in_time[1]);
      const out_seconds = (parseInt(out_time[0]) * 60) + parseInt(out_time[1]);
      let seconds = out_seconds - in_seconds;
      if (!isNaN(seconds)) { totalClipSeconds += seconds }
    });
  });
  const remainingSeconds = totalClipSeconds % 60;
  const minutes = Math.floor(totalClipSeconds / 60);
  totalClipTime = `${(minutes < 10) ? "0" + minutes : minutes}:${(remainingSeconds < 10) ? "0" + remainingSeconds : remainingSeconds}`;
  let shoetime = document.getElementById("totalClipTime") as HTMLSpanElement;
  shoetime.innerText = totalClipTime;
}

const dragged = (x: number, y: number, item: Item) => {

  const slot = <Item["slot"]>parseInt(
    <
    string // @ts-ignore
    >document.elementFromPoint(x, y)?.closest("section")?.attributes["slotno"]?.value,
  )

  const scriptColumn = document
    .elementFromPoint(x, y)
    ?.closest("div #script-column")

  if (scriptColumn) {
    hideShowColumn.script = true
    hideShowColumn.inbox = hideShowColumn.draft = false
    const data: any = [{
      label: item.text,
      clipField: {
        clip_url: "",
        in_time: "",
        in_msg: "",
        out_time: "",
        out_msg: "",
      },
    }]

    itemStore.addScriptItem(data, props.podcastId, item.slot)
    itemStore.getScriptListData(props.podcastId)

  } else {
    hideShowColumn.draft = true
    hideShowColumn.script = hideShowColumn.inbox = false
  }

  if (slot && slot === item.slot) {
    const id = <
      string // @ts-ignore
      >document.elementFromPoint(x, y)?.attributes["data-id"]?.value

    if (id) {
      const slotItem = itemStore.getList
      const index1 = slotItem.findIndex((ele) => ele.id === item.id)
      const index2 = slotItem.findIndex((ele) => ele.id === id)
      const data = moveArrayItemToNewIndex(slotItem, index1, index2)
      itemStore.updateSlotItem(data, props.podcastId, docname.value)
    }
  }
  if (slot) {
    item.slot = slot
    itemStore.saveData(props.podcastId, docname.value)
  }
}

const moveArrayItemToNewIndex = (
  arr: any,
  old_index: number,
  new_index: number,
) => {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1
    while (k--) {
      arr.push(undefined)
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
  return arr
}

const connect = () => {
  if (initiated.value) { itemStore.connect(props.podcastId, docname.value) }
  itemStore.getScriptListData(props.podcastId)
}
watch(
  () => route.params,
  (toParams, previousParams) => {
    docname.value = toParams.date
    if (toParams.date) connect()
  },
)

watch(
  isAuthenticated,
  async (authenticated) => {
    if (authenticated) {
      initiated.value = true
      connect()
    }
  },
  {
    immediate: true,
  },
)

watch(() => props.podcastId, connect, {
  immediate: true,

})

const copySlotText = (slot: number) => {
  const itemData = itemStore.getSlotList(slot).reverse()
  let textValue = ""
  itemData.map((el) => {
    if (el.text) {
      textValue += el.text
        .replace(/&nbsp;/g, " ")
        .replace(/<br\s*[\/]?>/g, "\r\n")
        .replace(/(<([^>]+)>)/g, "")
      textValue += "\r\n\n"
    }
  })
  navigator.clipboard.writeText(textValue)
  if (textValue) {
    showTooltip.value[slot] = true
    setTimeout(() => {
      showTooltip.value[slot] = false
    }, 500)
  }
}

const events = {
  onClickSave(text: string, slot: Item["slot"]) {
    itemStore.addItem({ text, slot }, props.podcastId, docname.value)
  },
  onClickScriptsSave(params: any, slotno: string) {
    let data: any = { clipField: params }
    itemStore.addScriptItem(data, props.podcastId, slotno)
  },
  onUpdateSaveDoc() {
    itemStore.saveData(props.podcastId, docname.value)
  },
  saveInputTitle(data: any) {
    itemStore.saveInputTitleData(props.podcastId, data)
  },
  saveInputSpecialDay(data: any) {
    itemStore.saveInputSpecialDayData(props.podcastId, data)
  },
  saveInputBirthdays(data: any) {
    itemStore.saveInputBirthdaysData(props.podcastId, data)
  },
  onClickDelete(item: Item) {
    if (window.confirm("Are you sure?")) {
      itemStore.removeItem(item, props.podcastId, docname.value)
    }
  },
  onClickInboxDelete(text: string, podcastId: string) {
    if (window.confirm("Are you sure?")) {
      itemStore.removeInboxItem(text, podcastId, podcastId)
    }
  },
  onClickUpdate(item: Item) {
    itemStore.updateItem(item, props.podcastId, docname.value)
  },
  onClickShare(item: Item, destination: any) {
    shareStore.sendItem(item, destination, props.podcastId)
  },
}
</script>

<style scoped lang="scss">
h2 {
  @apply ss-furniture;
}

.column-h {
  height: calc(100vh - 72px);
}

.in-line {
  display: inline-block;
}
</style>