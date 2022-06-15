<template>
  <main
    v-show="initiated && isAuthenticated"
    class="h-full grid grid-cols-5 gap-4 divide-x"
  >
    <div class="px-4 column-h overflow-y-auto" id="inbox-column" :class="{'col-span-3':hideShowColumn.inbox}" >
      <div class="flex justify-between items-center">
        <h2 class="text-2xl dark:text-white">Inbox</h2>
        <ListActionButton 
          title="toggle inbox expansion"
        >
          <PlusIcon
            @click="hideShowColumn.inbox = true,hideShowColumn.script= hideShowColumn.draft = false"
            v-if="!hideShowColumn.inbox"
            class="dark:text-white bg-transparent transition-colors w-6"
          />
          <MinusIcon
            class="dark:text-white bg-transparent transition-colors w-6"
            @click="hideShowColumn.inbox = false, hideShowColumn.draft =true"
            v-else
          />
        </ListActionButton>
      </div>
      <inbox
      :podcastId = "podcastId"
      :docname = "docname"
      />
    </div>
    <div class="px-4 column-h overflow-y-auto" id="draft-column" :class="{'col-span-3':hideShowColumn.draft}">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl dark:text-white">Draft</h2>
        <ListActionButton 
          title="toggle draft expansion"
        >
          <PlusIcon
            @click="hideShowColumn.draft = true,hideShowColumn.script= hideShowColumn.inbox = false"
            v-if="!hideShowColumn.draft"
            class="dark:text-white bg-transparent transition-colors w-6"
          />
          <MinusIcon
            class="dark:text-white bg-transparent transition-colors w-6"
            @click="hideShowColumn.draft = false, hideShowColumn.inbox =true"
            v-else
          />
      </ListActionButton>
      </div>
      <section
        v-for="slot in Array.from({ length: 7 }, (_, i) => 7 - i)"
        :key="slot"
        :slotno="slot"
      >
      <div class="flex items-center justify-between">
        <SlotTitleInput
          v-model="itemStore.getSlotTitleList[slot]"
          :slotno="slot"
          :updateEvent="events.onUpdateSaveDoc"
        />
        <span class="relative flex">
          <button title="Copy Slot item" @click="copySlotText(slot)" class=" text-white font-bold p-2 rounded transition-colors">
            <ClipboardCopyIcon class="h-6 w-6 text-black" />
            <div class="rounded-md absolute bottom-10 w-fit right-1 text-white bg-black p-1 border-radius" v-if="showTooltip[slot]">Copied</div>
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
              />
            </ListItem>
          </template>
        </List>
      </section>
    </div>
    <div class="px-4 column-h overflow-y-auto" id="script-column" :class="{'col-span-3':hideShowColumn.script}">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl dark:text-white">Script</h2>
        <ListActionButton 
          title="toggle script expansion"
        >
          <PlusIcon
            @click="hideShowColumn.script = true,hideShowColumn.draft= hideShowColumn.inbox = false"
            v-if="!hideShowColumn.script"
            class="dark:text-white bg-transparent transition-colors w-6"
          />
          <MinusIcon
            class="dark:text-white bg-transparent transition-colors w-6"
            @click="hideShowColumn.script = false, hideShowColumn.inbox =true"
            v-else
          />
      </ListActionButton>
      </div>
      <div class="block py-2 script-data">
        <input id="script-title" type="text" @focusout="updateScript" placeholder="Title" class="block placeholder:text-gray-600 text-xl" v-model="scriptData.title">
        <input id="script-specialday" type="text" @focusout="updateScript" placeholder="Special Day"  class="block placeholder:text-gray-600 text-xl" v-model="scriptData.specialDay">
        <input id="script-birthdays" type="text" @focusout="updateScript" placeholder="Birthdays" class="placeholder:text-gray-600 text-xl" v-model="scriptData.birthdays">
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { watch, ref, reactive, computed } from "vue"
import { storeToRefs } from "pinia"
import { useAuthStore } from "@/store/auth"
import { useItemStore } from "@/store/item"
import { useShareStore } from "@/store/itemShare"
import { usescriptStore } from "@/store/script"
import { Item } from "@/types/item"

import { useRoute } from "vue-router"

const authStore = useAuthStore()
const itemStore = useItemStore()
const shareStore = useShareStore()
const scriptStore = usescriptStore()
const initiated = ref(false)
const scriptData = ref(computed(()=> scriptStore.getScriptData ))
const route = useRoute()

const { user, isAuthenticated } = storeToRefs(authStore)

const props = defineProps({
  podcastId: {
    type: String,
    default: "smart7",
  },
  date:{
    type: String,
    default: new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .split("T")[0],
  }
})


const showTooltip = ref(Array.from({ length: 7 }, (_, i) => false))
// @TODO: work with todays date
const docname = ref(props.date);
const scriptDocname = new Date().toISOString().split("T")[0]
const hideShowColumn = reactive({
  inbox: false,
  draft: true,
  script:false
})

const updateScript = () => {
  scriptStore.saveData( props.podcastId, scriptDocname,scriptData.value)
}

const dragged = (x: number, y: number, item: Item) => {
  const slot = <Item["slot"]>parseInt(
    <string>// @ts-ignore
    document.elementFromPoint(x, y)?.closest("section")?.attributes["slotno"]?.value,
  )

  const scriptColumn = document.elementFromPoint(x, y)?.closest("div #script-column")

  if (scriptColumn) {
    hideShowColumn.script = true
    hideShowColumn.inbox = hideShowColumn.draft = false
  } else {
    hideShowColumn.draft = true
    hideShowColumn.script = hideShowColumn.inbox = false
  }

  if(slot && slot === item.slot){
    const id =
    <string>// @ts-ignore
     document.elementFromPoint(x, y)?.attributes["data-id"]?.value
    
    if(id){
      const slotItem =itemStore.getList
      const index1 = slotItem.findIndex(ele => ele.id === item.id);
      const index2 = slotItem.findIndex(ele => ele.id === id);
      const data= moveArrayItemToNewIndex(slotItem, index1, index2);
      itemStore.updateSlotItem(data,props.podcastId, docname.value);
    }
  }
  if (slot) {
    item.slot = slot
    itemStore.saveData(props.podcastId, docname.value)
  }
}

const moveArrayItemToNewIndex= (arr: any, old_index: number, new_index: number) =>{
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; 
};

const connect = () => {
  if (initiated.value) itemStore.connect(props.podcastId, docname.value)
  if (initiated.value) scriptStore.connect(props.podcastId, scriptDocname)
}
watch(
  () => route.params,
  (toParams, previousParams) => {
    docname.value = String(toParams.date)
   if (toParams.date) connect(); 
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
  let textValue = ''
  itemData.map((el) => {
    if(el.text) {
      textValue += el.text.replace(/&nbsp;/g," ").replace(/<br\s*[\/]?>/g, "\r\n").replace(/(<([^>]+)>)/g, "")
      textValue += "\r\n\n"
    }
  })
  navigator.clipboard.writeText(textValue)
  if(textValue){
    showTooltip.value[slot] =true
    setTimeout(() => {
      showTooltip.value[slot] = false
    }, 500);
  }
}

const events = {
  onClickSave(text: string, slot: Item["slot"]) {
    itemStore.addItem({ text, slot }, props.podcastId, docname.value)
  },
  onUpdateSaveDoc() {
    itemStore.saveData(props.podcastId, docname.value)
  },
  onClickDelete(item: Item) {
    if (window.confirm('Are you sure?')) {
      itemStore.removeItem(item, props.podcastId, docname.value)
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
h2, input {
  @apply ss-furniture;
}
.column-h {
  height: calc(100vh - 72px);
}
</style>
