<script setup lang="ts">
defineProps({
  modelValue: { type: Boolean },
  property: { type: Object, default: () => ({}) },
  readonly: { type: Boolean, default: true },
});
defineEmits(['update:modelValue']);

</script>
<template>
  <div>
    <div
      v-if="readonly"
      class="sf-readonly-wide"
    >{{ modelValue !== undefined ? (modelValue ? 'True' : 'False') :
      ''
    }}</div>
    <el-checkbox
      v-else
      model.value="modelValue"
      @change="($event: any) => $emit('update:modelValue', $event)
          "
    ></el-checkbox>
  </div>
</template>