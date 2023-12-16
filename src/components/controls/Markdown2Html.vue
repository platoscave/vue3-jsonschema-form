<script setup lang="ts">
import { computed } from 'vue';
import { Marked } from '@ts-stack/markdown';

const markdown = '# Example'
const markdownToHtml = computed(() => {
    return Marked.parse(markdown)
});


debugger
</script>

<template>
    <div>markdown</div>
    <div v-html="markdownToHtml"></div>
    <!-- <div>{{ source }}</div>
  <div innerHTML="md">
  </div> -->
</template>