<template>
  <div class="mt-2 w-full">
    <Input
      v-model="text"
      placeholder="Enter somethings..."
      @keydown.enter.prevent="save"
    />
  </div>
</template>

<script lang="ts" setup>
import Input from '@/components/atoms/Input.vue'
// import Button from '@/components/atoms/Button.vue'
import { ref } from 'vue'
import { useVModel } from '@vueuse/core'
import { useDialog } from '@/store/useDialog'

const props = defineProps<{ showAll: boolean }>()
const { showDialog } = useDialog()

const emits = defineEmits(['save'])
// const checked = useVModel(props, 'showAll', emits)

const text = ref<string>('')

const save = () => {
  emits('save', text.value)
  text.value = ''
}

const helloWorld = () => {
  showDialog("Hello World 🙂\nI'm on InputCard Component!")
}

defineExpose<{ helloWorld: () => void }>({ helloWorld })
</script>

<style scoped>

</style>
