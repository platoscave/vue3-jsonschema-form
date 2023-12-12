<script setup lang="ts">
defineProps({
  modelValue: { type: Boolean, default: "" },
  property: { type: Object, default: () => { } },
  readonly: { type: Boolean, default: true },
});
defineEmits(['update:modelValue']);

</script>
<template>
  <div>
    <div v-if="readonly" class="ar-lightgrey-background">{{ modelValue ? 'True' : 'False' }}</div>
    <el-checkbox v-else model.value="modelValue" @change="($event) => $emit('update:modelValue', $event)
      "></el-checkbox>
  </div>
</template>