<script setup lang="ts">
import Markdown2Html from './Markdown2Html.vue';
import StringCodeEditorCtrl from './StringCodeEditorCtrl.vue'

defineProps({
    modelValue: { type: String, default: "" },
    property: { type: Object, default: () => ({}) },
    readonly: { type: Boolean, default: true },
});

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
            @update:modelValue="($event: Event) => $emit('update:modelValue', $event)"
        ></StringCodeEditorCtrl>
    </div>
</template>
