<template>
  <main
    v-show="initiated && isAuthenticated"
    class="h-full grid grid-cols-5 gap-4 divide-x"
  >
    <div class="px-4">
      <h2 class="text-2xl dark:text-white">Longer List</h2>
      <p>coming soon...</p>
    </div>
    <div class="px-4 mt-4 col-span-3">
      <section v-for="slot in Array.from({length:7}, (_, i) => 7 - i)" :key="slot">
        <h2 class="text-5xl dark:text-white">{{slot}}</h2>
        <List>
          <template v-for="item in itemStore.getSlotList(slot)" :key="item.id">
            <ListItem>
              <ItemCard
                :item="item"
                @delete="events.onClickDelete"
                @toggle="events.onClickToggle"
                @update="events.onClickUpdate"
              />
            </ListItem>
          </template>
          <InputCard @save="events.onClickSave" :slot="slot" />
        </List>
      </section>
    </div>
    <div class="px-4">
      <h2 class="text-2xl dark:text-white">Script</h2>
      <p>coming soon...</p>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { watch, ref, computed } from "vue"
import { storeToRefs } from "pinia"
import { useAuthStore } from "@/store/auth"
import { useItemStore } from "@/store/item"
import { Item } from "@/types/item"

import List from "@/components/atoms/List.vue"
import ListItem from "@/components/atoms/ListItem.vue"
import ItemCard from "@/components/molecules/Cards/ItemCard.vue"
import InputCard from "@/components/molecules/Cards/InputCard.vue"

const authStore = useAuthStore()
const itemStore = useItemStore()

const initiated = ref(false)

const { user, isAuthenticated } = storeToRefs(authStore)

// @TODO: work with todays date
const docname = "todaysdate"
const podcastname = "smartseven"

watch(
  isAuthenticated,
  async (authenticated) => {
    if (authenticated) {
      await itemStore.fetchItem(podcastname, docname)
      initiated.value = true
    }
  },
  {
    immediate: true,
  },
)

const events = {
  onClickSave(text: string, slot: number) {
    itemStore.addItem({ text, slot}, podcastname, docname)
  },
  onClickDelete(item: Item) {
    itemStore.removeItem(item, podcastname, docname)
  },
  onClickUpdate(item: Item) {
    itemStore.updateItem(item, podcastname, docname)
  },
  onClickToggle(item: Item) {
    itemStore.modifyItem({ ...item, shared: !item.shared }, podcastname, docname)
  },
}
</script>

<style scoped lang="scss">
ListItem {
  display:none;
}
</style>
