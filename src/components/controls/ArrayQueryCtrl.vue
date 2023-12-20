<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
const props = defineProps({
    modelValue: { type: Array, default: () => ([]) },
    property: { type: Object, default: () => ({}) },
    readonly: { type: Boolean, default: true },
    queryCallback: { type: Function, default: () => ([]) },
    required: { type: Boolean, default: false },
});
defineEmits(['update:modelValue']);


const itemsRef = ref([])


const readonlyLabels = computed(() => {
    if (!(props.modelValue && itemsRef.value)) return "";
    return itemsRef.value.filter((obj: any) => {
        return props.modelValue.includes(obj.key);
    });
});

onMounted(async () => {
    if (props.queryCallback && props.property.items.query) {
        const results: [] = await props.queryCallback(props.property.items.query)

        // Copy itemsRef from results to itemsRef using push(). Perserve reactivity!
        for (let i = 0; i < results.length; i++) {
            itemsRef.value.push(results[i]);
        }
    }
})
</script>

<template>
    <div
        v-if="readonly"
        class="sf-readonly-wide"
    >
        <div
            v-for="item in readonlyLabels"
            :key="item.key"
            :model-value="item.key"
        >
            <img :src="item.iconSrc" />
            <span>{{ item.label }}</span>
        </div>
    </div>

    <el-checkbox-group
        v-else-if="itemsRef.length < 5"
        :model-value="modelValue"
        @update:modelValue="($event) => $emit('update:modelValue', $event)"
    >
        <el-checkbox
            v-for="item in itemsRef"
            :key="item.key"
            :label="item.key"
            :model-value="item.key"
        >
            {{ item.label }}
        </el-checkbox>
    </el-checkbox-group>

    <el-select
        v-else
        multiple
        :model-value="modelValue"
        @update:modelValue="($event) => $emit('update:modelValue', $event)"
    >
        <el-option
            v-for="item in itemsRef"
            :key="item.key"
            :label="item.label"
            :value="item.key"
        >
            <img :src="item.iconSrc" />
            <span>{{ item.label }}</span>
        </el-option>
    </el-select>
</template>

<style scoped>
img {
    height: 20px;
    width: 20px;
    margin-right: 10px;
    vertical-align: middle;
}
</style>
