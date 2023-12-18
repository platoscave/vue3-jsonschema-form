<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps({
    hashLevel: { type: Number, default: 0 },
    modelValue: { type: String, default: "" },
    property: { type: Object, default: {} },
    readonly: { type: Boolean, default: true },
    // we need to add these to prevent vue warn, for some reason
    class: { type: String, default: "" },
    required: { type: Boolean, default: false },
    formMode: { type: String, default: "" },
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

    <div
        v-if="!readonly"
        class="sf-full-width"
    >
        <el-input
            class="sf-full-width"
            :value="modelValue"
            @input="$emit('update:modelValue', $event)"
        ></el-input>
    </div>
</template>

<style scoped>
img {
    height: 24px;
    width: 24px;
    border-radius: 25%;
}
</style>
