<script setup lang="ts">
const props = defineProps({
  modelValue: { type: String, default: "" },
  property: { type: Object, default: () => { } },
  readonly: { type: Boolean, default: true },
});
defineEmits(['update:modelValue']);
console.log(props.property)

</script>

<template>
  <div>{{ property.placeholder }}</div>

  <div v-if="readonly" class="ar-lightgrey-background">{{ modelValue }}</div>

  <el-input v-else autosize :model-value="modelValue" :placeholder="'hi' + property.placeholder"
    @input="($event) => $emit('update:modelValue', $event)"></el-input>
</template>