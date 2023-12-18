<script setup lang="ts">
defineProps({
  modelValue: { type: Object, default: () => ({}) },
  property: { type: Object, default: () => ({}) },
  requiredArr: { type: Array, default: () => ([]) },
  editPermitted: { type: Object, default: () => ({}) },
  queryCallback: { type: Function },
  formMode: { type: String, default: 'Readonly Full' },
  size: { type: String, default: 'default' },
  labelWidth: { type: String, default: 'auto' },
  labelPosition: { type: String, default: 'left' }
});
</script>

<template>
  <!-- <JsonschemaTable class="sf-subform-background" value="modelValue" :properties="property.items.properties"
    :requiredArr="property.required" :form-mode="formMode" :hash-level="hashLevel"></JsonschemaTable> -->
</template>

<style scoped>
/* subForm background */
.sf-subform-background {
  position: relative;
}
</style>
