<template>
  <label class="block text-base font-bold zero-line-height">
    {{ label }}
    <textarea class="input" id="default-editor" :type="type" :placeholder="placeholder" v-model="value" />
  </label>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core'

const props = withDefaults(defineProps<{
  label?: string,
  type?: string,
  modelValue?: string | number,
  placeholder?: string
}>(), {
  label: '',
  type: 'text',
  modelValue: '',
  placeholder: ''
})

const emit = defineEmits(['update:modelValue'])
const value = useVModel(props, 'modelValue', emit)
</script>

<style scoped lang="scss">
.input {
  @apply shadow appearance-none border rounded w-full py-4 px-4 text-base font-normal leading-6 text-gray-500 dark:text-gray-50 dark:bg-gray-900 leading-tight focus:outline-none transition-colors;
  font-family: 'Work Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 200;
  color: rgb(65, 65, 65);
  box-shadow: none;
}
.zero-line-height {
  line-height: 0;
}
</style>
