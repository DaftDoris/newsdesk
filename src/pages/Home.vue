<template>

  <main
    v-show="initiated && isAuthenticated"
    class="h-full grid grid-cols-5 gap-4 divide-x"
  >
    <div
      class="px-4 column-h overflow-y-auto"
      id="inbox-column"
      :class="{ 'col-span-3': hideShowColumn.inbox }"
    >
      <div class="flex justify-between items-center mobile-align-tab">
        <h2 class="text-3xl dark:text-white">Inbox</h2>
        <ListActionButton title="toggle inbox expansion" class="mobile-icon-show">
        <MailOpenIcon class="w-5 mobile-show" />
          <PlusIcon
            @click="
              ;(hideShowColumn.inbox = true),
                (hideShowColumn.script = hideShowColumn.draft = false)
            "
            v-if="!hideShowColumn.inbox"
            class="dark:text-white bg-transparent transition-colors w-6"
          />
          <MinusIcon
            class="dark:text-white bg-transparent transition-colors w-6"
            @click="
              ;(hideShowColumn.inbox = false), (hideShowColumn.draft = true)
            "
            v-else
          />
        </ListActionButton>
      </div>
      <div class="mobile-hide-show">
      <inbox
        :podcastId="podcastId"
        :docname="docname"
        @draggedInbox="draggedInbox"
        @delete="events.onClickInboxDelete"
      />
      </div>
    </div>
    <div
      class="px-4 column-h overflow-y-auto"
      id="draft-column"
      :class="{ 'col-span-3': hideShowColumn.draft }"
    >
      <div class="flex justify-between items-center mobile-align-tab">
        <h2 class="text-3xl dark:text-white">Draft</h2>
        <ListActionButton title="toggle draft expansion" class="mobile-icon-show">
          <DocumentTextIcon class="w-5 mobile-show" />
          <PlusIcon
            @click="
              ;(hideShowColumn.draft = true),
                (hideShowColumn.script = hideShowColumn.inbox = false)
            "
            v-if="!hideShowColumn.draft"
            class="dark:text-white bg-transparent transition-colors w-6"
          />
          <MinusIcon
            class="dark:text-white bg-transparent transition-colors w-6"
            @click="
              ;(hideShowColumn.draft = false), (hideShowColumn.inbox = true)
            "
            v-else
          />
        </ListActionButton>
      </div>
      <div class="mobile-hide-show">
      <section
        v-for="slot in Array.from({ length: 7 }, (_, i) => 7 - i)"
        :key="slot"
        :slotno="slot"
        :slotno_custom="slot"
      >

        <div class="flex items-center justify-between">
          <SlotTitleInput v-model="itemStore.getSlotTitleList[slot]" :slotno="slot"
            :updateEvent="events.onUpdateSaveDoc" />
          <span class="relative flex">
          <button title="submit button" @click="submitItemOnMobileview(slot)" class="submit-btn">Submit</button>
            <button
              title="Copy Slot item"
              @click="copySlotText(slot)"
              class="text-white font-bold p-2 rounded transition-colors"
            >
              <DuplicateIcon class="h-6 w-6 text-black dark:text-white" />
              <div
                class="

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
              <ItemCard
                :item="item"
                @delete="events.onClickDelete"
                @share="events.onClickShare"
                @update="events.onClickUpdate"
                @dragged="dragged"
                @draggednew="draggednew"
              />

            </ListItem>
          </template>
        </List>
      </section>
      </div>
    </div>

    <div
      class="px-4 column-h overflow-y-auto"
      id="script-column"
      :class="{ 'col-span-3': hideShowColumn.script }"
    >
      <div class="flex justify-between items-center mobile-align-tab">
        <h2 class="text-3xl dark:text-white ">Script</h2>
        <ListActionButton title="toggle script expansion" class="mobile-icon-show">
          <CodeIcon class="w-5 mobile-show" />
          <PlusIcon
            @click="
              ;(hideShowColumn.script = true),
                (hideShowColumn.draft = hideShowColumn.inbox = false)
            "
            v-if="!hideShowColumn.script"
            class="dark:text-white bg-transparent transition-colors w-6"
          />
          <MinusIcon
            class="dark:text-white bg-transparent transition-colors w-6"
            @click="
              ;(hideShowColumn.script = false), (hideShowColumn.inbox = true)
            "
            v-else
          />
        </ListActionButton>
      </div>

      <div class="mt-3 mobile-hide-show" id="script-data">
        <ScriptInput
          class="text-lg dark:text-white"
          id="scriptTitleInput"
          placeholder="Title"
          @save="events.saveInputTitle"
        />
        <ScriptInput
          class="text-lg dark:text-white"
          id="scriptSpecialDaysInput"
          placeholder="Special Days"
          @save="events.saveInputSpecialDay"
        />
        <ScriptInput
          class="text-lg dark:text-white"
          id="scriptBirthdaysInput"
          placeholder="Birthdays"
          @save="events.saveInputBirthdays"
        />

        <div class="text-center text-lg text-gray-700 dark:text-white">
          Clips: <span id="totalClipTime">{{ totalClipTime }}</span> |
          Script: <span id="totalScriptTime">{{ totalScriptTime }}</span> |
          Word Count: <span id="totalWordCount">{{ totalWordCount }}</span> |
          Total: <span id="totalTime">{{ totalTime }}</span> |
          <span id="exportScript" class="cursor-pointer" @click="exportScript()">
            Export
            <CloudUploadIcon class="
                dark:text-white
                bg-transparent
                transition-colors
                w-6
                in-line
              " />
          </span>
        </div>
        <div v-for="slot in Array.from({ length: 7 }, (_, i) => 7 - i)" :key="slot">
          <div id="script-{{ slotno }}" class="border relative rounded-lg border-gray-400 pt-4 mb-5"
            @dragend="droppedScript($event, slot)" draggable="true">
            <span class="pl-4">
              <SlotTitleInput v-model="itemStore.getScriptSlotTitleList[slot]" :slotno="slot"
                :updateEvent="events.onUpdateSaveDoc" />
            </span>
            <Scripts class="my-5" :slotno="slot" :clipFieldData="itemStore.getScriptList(slot)" :podcastId="podcastId"
              @save="events.onClickScriptsSave" @keypress="checkUpdate()" @change="checkUpdate()" :date="date" />
          </div>
          <div class="flex border relative rounded-lg bg-red-100 border-gray-400 my-5 p-2 bg-" v-if="slot == 4">
            <label for="" class="dark:text-black">STILL TO COME: </label>
            <input class="input break-all ml-3 border-0 outline-0 w-10/12 max-w-full bg-red-100"
              placeholder="Enter Value" v-model="itemStore.still_to_come" @change="updateStillToCome()" />
          </div>
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
import { PlusIcon, MinusIcon } from "@heroicons/vue/outline"
import { CloudUploadIcon,MailOpenIcon,DocumentTextIcon,CodeIcon,DuplicateIcon  } from "@heroicons/vue/solid"
import Scripts from "@/components/Script.vue"
import { useRoute } from "vue-router"
import jsPDF from "jspdf"

const authStore = useAuthStore()
const itemStore = useItemStore()
const shareStore = useShareStore()
const initiated = ref(false)
const route = useRoute()
const { user, isAuthenticated } = storeToRefs(authStore)
const slotItems: any = []
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

function pad(num: string) {
  return (num.length < 2) ? "0" + num : num;
}

let totalClipTime: string = "00:00"
let totalScriptTime: string = "00:00"
let totalTime: string = "00:00"
let totalWordCount: string = "0"
let slotItemsNew: any = []
let doc: any = new jsPDF("p", "pt", "letter")
let y = 30
let pageHeight = 0

const createSlotItem = async () => {
  slotItemsNew = []
  itemStore.scriptItemList.forEach((item) => {
    if (!slotItemsNew[item.slot]) {
      slotItemsNew[item.slot] = { items: [] }
    }
    slotItemsNew[item.slot].items.push(item)
  })
}
const droppedScript = (e: DragEvent, slot: number) => {
  if (e.offsetY < -20) {
    itemStore.moveScript(slot, "top", props.podcastId, props.date)
  } else {
    itemStore.moveScript(slot, "bottom", props.podcastId, props.date)
  }
}
const exportScript = async () => {
  createSlotItem()
  let doc = new jsPDF("p", "pt", "letter");
  const scriptTitleInput = document.getElementById(
    "scriptTitleInput",
  ) as HTMLInputElement
  const scriptSpecialDaysInput = document.getElementById(
    "scriptSpecialDaysInput",
  ) as HTMLInputElement
  const scriptBirthdaysInput = document.getElementById(
    "scriptBirthdaysInput",
  ) as HTMLInputElement
  // create pdf for each slot 
  let clipText = `Clips: ${totalClipTime} | Script: ${totalScriptTime} | Total: ${totalTime}`;
  let pdfhtml = '<p style="font-family: sans-serif!important;margin-bottom:40px;font-size:25px;text-underline-offset: 13px;text-decoration:underline">' + props.podcastId + '</p><p>' + scriptTitleInput.value + '</p><p>' + scriptSpecialDaysInput.value + '</p><p>' + scriptBirthdaysInput.value + '</p><p style="margin-bottom:20px">' + clipText + '</p>';
  for (let i = 7; i > 0; i--) {
    pdfhtml += '<p style="font-weight:bold;">' + `${i} Title` + '</p>';
    if (slotItemsNew[i]) {
      slotItemsNew[i].items.filter((element: any) => {
        let splitText = doc
          .setFont("Helvetica", "")
          .setFontSize(13)
          .splitTextToSize(element.params[0].label, 500)
        splitText.map((text: string, ind: number) => {

          pdfhtml += text;

        })
        let clipfield = element.params[0].clipField
        const cliptest = `CLIP URL: ${clipfield.clip_url} | In: ${clipfield.in_time} | ${clipfield.in_msg} | Out: ${clipfield.out_time} | ${clipfield.out_msg}`
        pdfhtml += "<p>" + cliptest + "</p>";

      })
    }


  }

  let docPdf = new jsPDF("p", "pt", "letter")
  let pdfHtmlData = "<div style='width:520px;margin:20px auto'>" + pdfhtml + "</div>";
  docPdf.html(pdfHtmlData, {
    x: 50,
    y: 0,
    autoPaging: 'text',
    margin: [40, 0, 40, 0],
    callback: function (pdf) {
      window.open(docPdf.output("bloburl"), "_blank") // open pdf in new tab
    }
  })

}

const updateStillToCome = async () => {
  await itemStore.saveData(props.podcastId, docname.value)
}
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

const removeItem = async () => {
  const deleteClip = JSON.parse(localStorage.getItem("deleteClip") || "")
  localStorage.removeItem("deleteClip")
  let slotitemData = slotItems[deleteClip.slotno].items
  slotitemData.splice(deleteClip.index, 1)
  let slotitem: any = []
  if (slotitemData.length > 0) {
    slotitemData.forEach((element: any) => {
      slotitem.push(element)
    })
  }
  slotItems[deleteClip.slotno].items = slotitem
  await checkUpdate()
}

const removeItemFromSlot = async () => {
  if (localStorage.getItem("deleteClip") != null) {
    removeItem();
  }
}
const checkUpdate = async () => {
  let totalClipSeconds = 0;
  let scriptCount = 0
  const slotitemData = await itemStore.scriptItemList
  slotitemData.map((element) => {
    if (element.params.length != 0) {
      const clipField = element.params[0].clipField
      let text = element.params[0].label.replace(/\n/g, "")
      scriptCount += (text !== '') ? text.split(" ").length : 0
      const in_time = (clipField.in_time != '') ? clipField.in_time.split(":") : [0, 0]
      const out_time = (clipField.out_time != '') ? clipField.out_time.split(":") : [0, 0]
      const in_seconds = parseInt(in_time[0]) * 60 + parseInt(in_time[1])
      const out_seconds = parseInt(out_time[0]) * 60 + parseInt(out_time[1])
      let seconds = out_seconds - in_seconds;
      totalClipSeconds += seconds;
    }
  })

  const remainingSeconds = totalClipSeconds % 60
  const minutes = Math.floor(totalClipSeconds / 60)
  totalClipTime = `${pad(minutes.toString())}:${pad(remainingSeconds.toString())}`
  let shoetime = document.getElementById("totalClipTime") as HTMLSpanElement
  shoetime.innerText = totalClipTime
  // Total Script Time
  let wordCount = document.getElementById("totalWordCount") as HTMLSpanElement;
  wordCount.innerText = scriptCount.toString();
  let ratio = (scriptCount / 185) * 60
  const ScriptSeconds = Math.floor(ratio % 60)
  const ScriptMinutes = Math.floor(ratio / 60)
  totalScriptTime = `${pad(ScriptMinutes.toString())}:${pad(ScriptSeconds.toString())}`
  let showScriptTime = document.getElementById("totalScriptTime",) as HTMLSpanElement
  showScriptTime.innerText = totalScriptTime
  // totalTime
  let combinedSeconds = remainingSeconds + ScriptSeconds + 58
  let calculatedMinutes = Math.floor(combinedSeconds / 60)
  let calculatedSeconds = Math.floor(combinedSeconds % 60)
  let combinedMinutes = minutes + ScriptMinutes + calculatedMinutes
  let TotalCombinedSecomds = combinedMinutes * 60 + calculatedSeconds
  totalTime = "00:00"
  if (TotalCombinedSecomds > 58) {
    totalTime = `${pad(combinedMinutes.toString())}:${pad(calculatedSeconds.toString())}`
  }
  let showTotalTime = document.getElementById("totalTime") as HTMLSpanElement
  showTotalTime.innerText = totalTime
  showTotalTime.style.color = TotalCombinedSecomds < 7 * 60 ? "red" : "black"
}



const updateClipTime = async () => {
  let totalClipSeconds = 0
  slotItems.forEach(async (item: any) => {
    item.items.forEach(async (element: any) => {
      const clipField = element.clipField
      // change strint to minutes and seconds
      const in_time = clipField.in_time.split(":")
      const out_time = clipField.out_time.split(":")
      const in_seconds = parseInt(in_time[0]) * 60 + parseInt(in_time[1])
      const out_seconds = parseInt(out_time[0]) * 60 + parseInt(out_time[1])
      let seconds = out_seconds - in_seconds
      if (!isNaN(seconds)) {
        totalClipSeconds += seconds
      }
    })
  })
  const remainingSeconds = totalClipSeconds % 60
  const minutes = Math.floor(totalClipSeconds / 60)
  totalClipTime = `${minutes < 10 ? "0" + minutes : minutes}:${remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds
    }`
  let shoetime = document.getElementById("totalClipTime") as HTMLSpanElement
  shoetime.innerText = totalClipTime
}

const draggednew  =async (x: number, y: number, item: Item) => {

  const data: any = [
      {
        label: item.text,
        clipField: {
          clip_url: "",
          in_time: "",
          in_msg: "",
          out_time: "",
          out_msg: "",
        },
      },
    ]

    await itemStore.addScriptItem(
      data,
      props.podcastId,
      item.slot,
      docname.value,
    )
   alert('Item moved to script');

}

const dragged = async (x: number, y: number, item: Item) => {
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
    const data: any = [
      {
        label: item.text,
        clipField: {
          clip_url: "",
          in_time: "",
          in_msg: "",
          out_time: "",
          out_msg: "",
        },
      },
    ]

    await itemStore.addScriptItem(
      data,
      props.podcastId,
      item.slot,
      docname.value,
    )
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
      const data = await moveArrayItemToNewIndex(slotItem, index1, index2)
      await itemStore.updateSlotItem(data, props.podcastId, docname.value)
    }
  }
  if (slot) {
    item.slot = slot
    await itemStore.saveData(props.podcastId, docname.value)
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
  if (initiated.value) {
    itemStore.connect(props.podcastId, docname.value)
  }
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

const submitItemOnMobileview = (slotno: number) => { 
      const slot = <Item["slot"]>parseInt(
    <
      string // @ts-ignore
    ><unknown>slotno,
  )      
      const section=(<HTMLInputElement>document.querySelector("section[slotno_custom='"+slot+"'] textarea"));
      const text = section.value      
      if(text && slotno){
        itemStore.addItem({ text, slot }, props.podcastId, docname.value)     
        section.value='';   
      }
      
}

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
    itemStore.addScriptItem(data, props.podcastId, slotno, docname.value)
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
      shareStore.removeDraggedItem(text, props.podcastId, podcastId)
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