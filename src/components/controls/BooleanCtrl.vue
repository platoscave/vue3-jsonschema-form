<script setup lang="ts">

export interface IProps {
  modelValue?: boolean
  readonly?: boolean
}
withDefaults(defineProps<IProps>(), {
  modelValue: undefined,
  readonly: true
})
const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void
}>()

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