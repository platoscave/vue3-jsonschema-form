<script setup lang="ts">
import Markdown2Html from './Markdown2Html.vue';
import StringCodeEditorCtrl from './StringCodeEditorCtrl.vue'
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
        >
            <Markdown2Html :model-value="modelValue"></Markdown2Html>
        </div>
        <StringCodeEditorCtrl
            v-else
            :model-value="modelValue"
            :property="property"
            :readonly="readonly"
            @update:modelValue="($event) => $emit('update:modelValue', $event)"
        ></StringCodeEditorCtrl>
    </div>
</template>
