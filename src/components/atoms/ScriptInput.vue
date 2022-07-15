<template>
  <label class="w-11/12">
    <input
      class="input break-all max-w-full"
      :placeholder="placeholder"
      v-model="value"
@keydown.enter.exact.prevent="save"
    />
  </label>
</template>

<script lang="ts" setup>

const props = defineProps({
  placeholder: {
    type: String,
    default: null,
  },
  value: {
    type: String,
    default: null,
  },
})

const emits = defineEmits(['save'])
const save = () => {
  emits("save")
}
</script>

<style scoped lang="scss">
.input {
  @apply appearance-none  dark:text-white bg-transparent focus:outline-none;
  width: 47vw;
}
label {
  @apply ss-furniture  dark:text-white;
}
</style>
