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
  <!-- <ar-sub-table class="ar-subform-background" value="modelValue" :properties="property.items.properties"
    :requiredArr="property.required" :form-mode="formMode" :hash-level="hashLevel"></ar-sub-table> -->
</template>

<style scoped>
/* subForm background */
.ar-subform-background {
  background-color: #ffffff08;
  padding: 10px 10px 10px 15px;
  border-radius: 4px;
  border-style: none;
  margin-bottom: 10px;
  position: relative;
}
</style>
