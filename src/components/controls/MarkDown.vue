<script setup lang="ts">
import MarkdownIt from 'markdown-it';

defineProps({
  modelValue: { type: String, default: "" },
  property: { type: Object, default: () => { } },
  readonly: { type: Boolean, default: true },
});
</script>

<template>
  <div v-if="readonly" class="ar-lightgrey-background">
    <MarkdownIt :source="modelValue"></MarkdownIt>
  </div>
  <el-input v-else autosize value="modelValue" @change="$emit('update:modelValue', $event)"></el-input>
</template>
