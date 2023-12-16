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
defineEmits(['update:modelValue']);

</script>

<template>
    <JsonschemaForm class="ar-subform-background" :model-value="modelValue" :properties="property.properties"
        :requiredArr="property.required" :updateable-properties="editPermitted" :form-mode="formMode" :size="size"
        :label-position="labelPosition" :label-width="labelWidth" :query-callback="queryCallback"
        @update:modelValue="($event: any) => $emit('update:modelValue', $event)">
    </JsonschemaForm>
</template>

<style scoped>
/* subForm background */
.ar-subform-background {
    background-color: #ffffff08;
    padding: 10px 10px 10px 15px;
    border-radius: 4px;
    border-style: none;
    margin-bottom: 10px;
}
</style>
