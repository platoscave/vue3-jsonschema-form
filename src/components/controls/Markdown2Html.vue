<script setup lang="ts">
import { computed } from 'vue';
import { Marked } from '@ts-stack/markdown';

const props = defineProps({
    modelValue: { type: String, default: '' }
});

const markdownToHtml = computed(() => {
    return Marked.parse(props.modelValue)
});

</script>

<template>
    <div v-html="markdownToHtml"></div>
</template>