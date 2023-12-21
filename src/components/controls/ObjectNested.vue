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
    labelPosition: { type: String, default: 'left' },
    columWidths: { type: Array, default: () => ([]) }
});
defineEmits(['update:modelValue', 'current-change', 'header-dragend'])

</script>

<template>
    <JsonschemaForm
        class="sf-subform-background"
        :model-value="modelValue"
        :properties="property.properties"
        :requiredArr="property.required"
        :updateable-properties="editPermitted"
        :form-mode="formMode"
        :size="size"
        :label-position="labelPosition"
        :label-width="labelWidth"
        :query-callback="queryCallback"
        :colum-widths="columWidths"
        @update:modelValue="($event: any) => $emit('update:modelValue', $event)"
        @current-change="($event: Event) => $emit('current-change', $event)"
        @header-dragend="($event: Event) => $emit('header-dragend', $event)"
    >
    </JsonschemaForm>
</template>

<style scoped></style>
