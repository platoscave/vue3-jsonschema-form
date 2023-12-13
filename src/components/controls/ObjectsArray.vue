<script setup lang="ts">
defineProps({
  modelValue: { type: Object, default: () => ({}) },
  property: { type: Object, default: () => ({}) },
  requiredArr: { type: Array, default: () => ([]) },
  updateableProperties: { type: Object, default: () => ({}) },
  queryCallback: { type: Function },
  formMode: { type: String, default: 'Readonly Full' },
  size: { type: String, default: 'default' },
  labelWidth: { type: String, default: 'auto' },
  labelPosition: { type: String, default: 'left' }
});
const addIcon =
  `<svg viewBox="0 0 100 100" height="12" width="12" >` +
  `   <circle cx="50" cy = "50" r = "50" fill="green"/>` +
  `   <text fill="rgba(255, 255, 255, 0.87)" x = "33" y = "80" font-size="70" font-weight="1000" >+</text>` +
  `</svg>`
const deleteIcon =
  `<svg viewBox="0 0 100 100" height="12" width="12" >` +
  `   <circle cx="50" cy = "50" r = "50" fill="red"/>` +
  `   <text fill="rgba(255, 255, 255, 0.87)" x = "33" y = "80" font-size="70" font-weight="1000" >-</text>` +
  `</svg>`
</script>

<template>
  <div>
    <!-- Create a subForm for each of the items in the modelValue array -->
    <div v-for="(item, idx) in modelValue" :key="idx" :class="{
      'ar-subform-background': true,
      'not-readonly': formMode.startsWith('Edit') && property.additionalItems,
    }">
      <!-- <JsonschemaForm v-model="modelValue[idx]" :draggable="formMode.startsWith('Edit') && property.additionalItems"
        :properties="property.items.properties" :requiredArr="property.required" :form-mode="formMode"
        :hash-level="hashLevel"></JsonschemaForm> -->
      <JsonschemaForm class="ar-subform-background" v-model="modelValue[idx]" :properties="property.items.properties"
        :requiredArr="property.required" :updateable-properties="updateableProperties.items.properties"
        :form-mode="formMode" :size="size" :label-position="labelPosition" :label-width="labelWidth"
        :query-callback="queryCallback">
      </JsonschemaForm>
      <!-- Delete icon -->
      <div class="icon-delete" v-if="formMode.startsWith('Edit') && property.additionalItems" v-html="deleteIcon"
        height="1em" width="1em" @click="modelValue.splice(idx, 1)"></div>

      <!-- <svg class="el-icon-close" v-if="formMode.startsWith('Edit') && property.additionalItems"
        @click="modelValue.splice(idx, 1)">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'toolbar-symbols.svg#el-icon-close'"></use>
      </svg> -->
    </div>
    <!-- Add icon -->
    <div class="icon-add" v-if="formMode.startsWith('Edit') && property.additionalItems" v-html="deleteIcon" height="1em"
      width="1em" @click="modelValue.push({})"></div>

    <!-- <svg class="el-icon-plus" v-if="formMode.startsWith('Edit') && property.additionalItems" @click="modelValue.push({})">
      <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="'toolbar-symbols.svg#el-icon-plus'"></use>
    </svg> -->
  </div>
</template>

<style scoped>
/* subForm background */
.ar-subform-background {
  background-color: #ffffff08;
  padding: 10px 10px 10px 15px;
  border-radius: 4px;
  border-style: none;
  position: relative;
}

.ar-subform-background:not(:last-child) {
  margin-bottom: 10px;
}

/* Icons */
.icon-delete {
  height: 1em;
  width: 1em;
  position: absolute;
  margin: 3px;
  top: 0px;
  right: 0;
  /* background-color: #ff4000a3; */
  color: #ff4000a3;
  z-index: 20;
  border-radius: 50%;
}

.icon-add {
  height: 1em;
  width: 1em;
  margin: 3px;
  /* background-color: green; */
  color: green;
  z-index: 20;
  border-radius: 50%;
}

.not-readonly:hover {
  cursor: pointer;
}
</style>
