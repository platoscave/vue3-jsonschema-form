<script setup lang="ts">
import StringCodeEditorCtrl from "./StringCodeEditorCtrl.vue";
defineProps({
    modelValue: { type: String, default: "" },
    property: { type: Object, default: () => ({}) },
    readonly: { type: Boolean, default: true },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
    <div>
        <!-- <img
            class="sf-readonly-wide"
            :src="modelValue"
            height="24"
            width="40"
        /> -->
        <div
            class="infoIcon"
            v-html="modelValue"
        ></div>

        <div v-if="!readonly">
            <StringCodeEditorCtrl
                :model-value="modelValue"
                :property="property"
                :readonly="readonly"
                @update:modelValue="($event) => $emit('update:modelValue', $event)"
            ></StringCodeEditorCtrl>
        </div>
    </div>
</template>

<style scoped>
img {
    height: 24px;
    width: 24px;
    border-radius: 25%;
}
</style>
