<script setup lang="ts">
defineProps({
  modelValue: { type: String, default: "" },
  readonly: { type: Boolean, default: true },
});
defineEmits(['update:modelValue']);
</script>

<template>
  <div v-if="readonly" class="ar-lightgrey-background">{{ modelValue }}</div>
  <!-- <el-input v-else autosize :value="modelValue" @input="$emit('update:modelValue', $event)"></el-input> -->
  <el-input v-else autosize :model-value="modelValue" @input="($event) => {
    console.log($event)
    $emit('update:modelValue', $event)
  }"></el-input>
</template>