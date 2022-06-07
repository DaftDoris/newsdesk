<template>
  <div class="border-2 rounded-lg p-4">
    <label class="w-11/12">
      {{ slotno }} :
      <span
        v-if="title"
        class="title break-all max-w-full"
        :placeholder="`${slotno} title`"
        readonly
      >
        {{ title }}
      </span>
      <span v-else class="text-gray-400">{{ slotno }} title</span>
    </label>
    <div v-for="item in items" :key="item.id">
      <p class="py-5">{{ item.text }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  slotno: {
    type: Number,
    default: 1,
  },
  items: {
    type: Object,
    default: null,
  },
  title: {
    type: String,
    default: null,
  },
})
</script>

<style scoped lang="scss">
.title {
  @apply appearance-none text-5xl dark:text-white bg-transparent focus:outline-none;
  width: 47vw;
}
label {
  @apply ss-furniture text-5xl dark:text-white;
}
</style>
