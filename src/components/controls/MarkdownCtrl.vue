<script setup lang="ts">
import Markdown2Html from './Markdown2Html.vue';

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
            <Markdown2Html :markdownText="modelValue"></Markdown2Html>
        </div>
        <!-- <el-input v-else autosize value="modelValue" @change="$emit('update:modelValue', $event)"></el-input> -->
    </div>
</template>
