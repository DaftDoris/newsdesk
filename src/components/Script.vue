<template>
  <div class="border-2 rounded-lg p-4">
    <label class="w-11/12">
      {{ slotno }} :
      <span class="text-gray-400">{{ slotno }} title</span>
    </label>
  </div>
</template>

<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  slotno: {
    type: Number,
    default: 1,
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
