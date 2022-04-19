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
import { ref } from 'vue'

const props = defineProps<{ showAll: boolean }>()
const emits = defineEmits(['save'])

const text = ref<string>('')

const save = () => {
  emits('save', text.value)
  text.value = ''
}

</script>