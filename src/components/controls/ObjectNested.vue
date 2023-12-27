<script setup lang="ts">
import type { IComponentInterface } from '../../models/componentInterface'

withDefaults(defineProps<IComponentInterface>(), {
    modelValue: () => ({}),
    property: () => ({}),
    requiredArr: () => ([]),
    editPermitted: () => ({}),
    queryCallback: () => ({}),
    formMode: 'Readonly Full',
    size: 'default',
    labelWidth: 'auto',
    labelPosition: 'left',
    columWidths: () => ([]),
})
defineEmits<{
    (e: 'update:modelValue', modelValue: Object): void
    (e: 'current-change', id: string): void
    (e: 'header-dragend', columWidths: number[]): void
}>()

</script>

<template>
    <JsonschemaForm
        class="sf-subform-background"
        :model-value="modelValue"
        :properties="property.properties"
        :requiredArr="property.required"
        :edit-permitted="editPermitted"
        :form-mode="formMode"
        :size="size"
        :label-position="labelPosition"
        :label-width="labelWidth"
        :query-callback="queryCallback"
        :colum-widths="columWidths"
        @update:modelValue="($event: any) => $emit('update:modelValue', $event)"
        @current-change="($event: any) => $emit('current-change', $event)"
        @header-dragend="($event: any) => $emit('header-dragend', $event)"
    >
    </JsonschemaForm>
</template>

<style scoped></style>
