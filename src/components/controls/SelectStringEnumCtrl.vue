<script setup lang="ts">
defineProps({
  modelValue: { type: String, default: '' },
  property: { type: Object, default: () => ({}) },
  readonly: { type: Boolean, default: true },
})
defineEmits(['update:modelValue']);

</script>

<template>
  <div v-if="readonly || property.enum.length < 2" class="ar-lightgrey-background">
    {{ modelValue }}
  </div>

  <el-radio-group class="ar-radio-group" v-else-if="property.enum.length < 5" :model-value="modelValue"
    @update:modelValue="($event) => $emit('update:modelValue', $event)">
    <el-radio class="ar-radio" v-for="item in property.enum" :key="item" :label="item" :model-value="item"></el-radio>
  </el-radio-group>

  <el-select v-else :model-value="modelValue" @update:modelValue="($event) => $emit('update:modelValue', $event)">
    <el-option v-for="item in property.enum" :key="item" :label="item" :value="item">
    </el-option>
  </el-select>
</template>

<style scoped>
/* Radiobuttons */

.el-radio.ar-radio {
  height: 24px
}

.ar-radio-group {
  background-color: #ffffff08;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 4px;
  border-color: #00adff42;
  border-style: solid;
  border-width: 1px;
  font-size: 16px;
  line-height: 24px;
}
</style>
