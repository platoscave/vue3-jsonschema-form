<script setup lang="ts">
import { computed } from 'vue';
import { Marked } from '@ts-stack/markdown';

export interface IProps {
    modelValue?: string
}
const props = withDefaults(defineProps<IProps>(), {
    modelValue: '',
})

const markdownToHtml = computed(() => {
    return Marked.parse(props.modelValue)
});

</script>

<template>
    <div v-html="markdownToHtml"></div>
</template>