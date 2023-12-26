<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { IProperty } from '../../models/property'

export interface IProps {
    modelValue?: string[]
    property?: IProperty
    readonly?: boolean
    queryCallback?: Function
    required?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
    modelValue: () => ([]),
    property: () => ({ items: {} }),
    readonly: true,
    queryCallback: () => ({}),
    required: false
})
const emit = defineEmits<{
    (e: 'update:modelValue', modelValue: string[]): void
}>()

interface IItem {
    key: string
    label?: string
    iconSrc?: string
}
const itemsRef = ref<IItem[]>([])


const readonlyItems = computed(() => {
    if (!(props.modelValue && itemsRef.value)) return "";
    return itemsRef.value.filter((item) => {
        return props.modelValue.includes(item.key);
    });
});

onMounted(async () => {
    if (props.queryCallback && props.property.items?.query) {
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
            v-for="item in readonlyItems as Array<IItem>"
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
        @update:modelValue="($event: any) => $emit('update:modelValue', $event)"
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
