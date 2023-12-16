<script setup lang="ts">
import { get } from 'lodash';
defineProps({
    modelValue: { type: String, default: "" },
    property: { type: Object, default: () => ({}) },
    readonly: { type: Boolean, default: true },
});
defineEmits(['update:modelValue']);
</script>

<template>
    <div>
        <div
            v-if="readonly"
            class="ar-lightgrey-background"
        >{{ modelValue }}</div>
        <el-input
            v-else
            autosize
            :model-value="modelValue"
            :placeholder="get(property, 'attrs.placeholder', '')"
            :type="get(property, 'attrs.type', '')"
            :show-password="get(property, 'attrs.type', '') === 'password'"
            :show-word-limit="get(property, 'attrs.showWordLimit', '')"
            :maxlength="property.maxLength"
            :minlength="property.minLength"
            @input="($event) => $emit('update:modelValue', $event)"
        ></el-input>
    </div>
</template>