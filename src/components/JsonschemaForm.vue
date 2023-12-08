<script setup lang="ts">
export interface IProps {
    modelValue?: {}
    properties?: {}
    requiredArr?:  string[],
    updateableProperties?: {}
    queryCallback?: any,
    formMode?: string
    size?: string
    labelPosition?: string
}

const props = withDefaults(defineProps<IProps>(), {
    modelValue:  () => {},
    properties:  () => {},
    requiredArr: () => [],
    updateableProperties: () => {},
    formMode: 'Readonly Full',
    size: 'Default',
    labelPosition: 'Left'
})
const emit = defineEmits(['update'])

</script>
<template>
    <div>{{ formMode }}</div>
    <div>{{ size }}</div>
    <div>{{ labelPosition }}</div>
</template>