<script setup lang="ts">
import { computed } from "vue";
import type { IProperty } from '../../models/property'

export interface IProps {
    modelValue?: number
    property?: IProperty
    readonly?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
    modelValue: undefined,
    property: () => ({}),
    readonly: true
})
const emit = defineEmits<{
    (e: 'update:modelValue', modelValue: number): void
}>()

const precision = computed(() => {
    if (props.property.type === "number") {
        if (props.property.multipleOf) {
            // use the exponent of multipleOf to determin precision
            let exp = String(props.property.multipleOf.toExponential());
            let expNumber = Number(exp.substr(exp.lastIndexOf("e") + 1));
            return Math.abs(expNumber); // must be positive int
        }
    }
    // integer
    return 0;
});

</script>

<template>
    <div
        v-if="readonly"
        class="sf-readonly-narrow"
    >
        <div v-if="modelValue !== undefined">{{ Number.parseFloat(modelValue.toString()).toFixed(precision) }}</div>
    </div>
    <el-input-number
        v-else
        :value="modelValue"
        :min="property.minimum"
        :max="property.maximum"
        :precision="precision"
        :placeholder="property.attrs?.placeholder"
        :controls=false
        @input="($event: any) => $emit('update:modelValue', $event)"
    >
    </el-input-number>
</template>

<style scoped>
.el-input-number {
    width: 220px;
}

.el-input-number /deep/ .el-input__inner {
    text-align: right;
}
</style>
