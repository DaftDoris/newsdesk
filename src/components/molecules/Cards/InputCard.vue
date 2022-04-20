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

const emits = defineEmits(['save'])

const text = ref<string>('')

const save = () => {
  emits('save', text.value, props.slot)
  text.value = ''
}

const props = defineProps({
  slot: {
    type: Number,
    default: null,
  },
})

</script>