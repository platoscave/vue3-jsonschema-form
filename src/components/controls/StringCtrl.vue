<script setup lang="ts">
import { get } from 'lodash';
import type { IProperty } from '../../models/property'

export interface IProps {
    modelValue?: string
    property?: IProperty
    readonly?: boolean
}
withDefaults(defineProps<IProps>(), {
    modelValue: '',
    property: () => ({}),
    readonly: true
})
const emit = defineEmits<{
    (e: 'update:modelValue', modelValue: string): void
}>()

</script>

<template>
    <div>
        <div
            v-if="readonly"
            class="sf-readonly-wide"
        >{{ modelValue }}</div>
        <el-input
            v-else
            autosize
            :model-value="modelValue"
            :placeholder="get(property, 'attrs.placeholder', '')"
            :type="get(property, 'attrs.type', '')"
            :show-password="get(property, 'attrs.type', '') === 'password'"
            :show-word-limit="get(property, 'attrs.showWordLimit', false)"
            :maxlength="property.maxLength"
            :minlength="property.minLength"
            @input="($event: any) => $emit('update:modelValue', $event)"
        ></el-input>
    </div>
</template>