<template>
  <h1>JSON Forms Vue 3</h1>
  <router-view />
</template>
<script lang="ts" setup>
import { provide } from 'vue';

const props = defineProps({
  apiURL: {
    type: String,
    required: true
  }
})
provide<string>('apiURL', props.apiURL)

console.log('APP', props)
</script>