<script setup lang="ts">
const props = defineProps<{
  value: { type: String, default: "" },
  readonly: { type: Boolean, default: true },
}>();
</script>

<template>
  <div v-if="readonly" class="ar-lightgrey-background">
    {{ modelValue }}
  </div>
  <!-- TODO type="textarea" 
    @input="$emit('update:modelValue', $event)"
  
  -->
  <el-input v-else autosize :value="value" @input="($event)=> $emit('update:value', $event.target.value)"></el-input>
</template>
