<script setup lang="ts">
import JsonschemaTable from '../JsonschemaTable.vue'

const props = defineProps({
    modelValue: { type: Object, default: () => ([{}]) },
    property: { type: Object, default: () => ({}) },
    requiredArr: { type: Array, default: () => ([]) },
    editPermitted: { type: Object, default: () => ({ items: {} }) },
    queryCallback: { type: Function },
    formMode: { type: String, default: 'Readonly Full' },
    size: { type: String, default: 'default' },
    labelWidth: { type: String, default: 'auto' },
    labelPosition: { type: String, default: 'left' },
    columWidths: { type: Array, default: () => ([]) }
});
const emits = defineEmits(['update:modelValue', 'current-change', 'header-dragend'])
</script>

<template>
    <JsonschemaTable
        class="sf-subform-background"
        :model-value="modelValue"
        :properties="property.items.properties"
        :requiredArr="property.required"
        :updateable-properties="editPermitted.items.properties"
        :form-mode="formMode"
        :size="size"
        :label-position="labelPosition"
        :label-width="labelWidth"
        :query-callback="queryCallback"
        :colum-widths="columWidths"
        @update:modelValue="($event: Event) => $emit('update:modelValue', $event)"
        @current-change="($event) => $emit('current-change', $event)"
        @header-dragend="($event) => $emit('header-dragend', $event)"
    ></JsonschemaTable>
</template>

<style scoped></style>
