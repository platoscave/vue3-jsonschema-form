<script setup lang="ts">
import CodeEditorCtrl from "./CodeEditorCtrl.vue";
defineProps({
    modelValue: { type: String, default: "" },
    property: { type: Object, default: () => ({}) },
    readonly: { type: Boolean, default: true },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
    <img
        class="sf-readonly-wide"
        :src="modelValue"
        height="24"
        width="40"
    />

    <div v-if="!readonly">
        <CodeEditorCtrl
            :model-value="modelValue"
            :property="property"
            :readonly="readonly"
            @update:modelValue="($event) => $emit('update:modelValue', $event)"
        ></CodeEditorCtrl>
    </div>
</template>

<style scoped>
img {
    height: 24px;
    width: 24px;
    border-radius: 25%;
}
</style>
