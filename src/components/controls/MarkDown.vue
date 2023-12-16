<script setup lang="ts">
import Markdown2Html from './Markdown2Html.vue';

defineProps({
    modelValue: { type: String, default: "" },
    property: { type: Object, default: () => ({}) },
    readonly: { type: Boolean, default: true },
});


</script>

<template>
    <h3>LoLo</h3>
    <Markdown2Html :source="modelValue"></Markdown2Html>
    <!-- <div v-if="readonly" class="ar-lightgrey-background">
    <Markdown2Html :source="modelValue"></Markdown2Html>
  </div>
  <el-input v-else autosize value="modelValue" @change="$emit('update:modelValue', $event)"></el-input> -->
</template>
