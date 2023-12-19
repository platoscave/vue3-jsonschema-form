<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
const props = defineProps({
    modelValue: { type: String, default: "" },
    property: { type: Object, default: () => ({}) },
    readonly: { type: Boolean, default: true },
    queryCallback: { type: Function, default: () => ([]) },
    required: { type: Boolean, default: false },
});
defineEmits(['update:modelValue']);

const itemsRef = ref([])

const readonlyOutput = computed(() => {
    if (!(props.modelValue && itemsRef.value)) return { icon: '', label: '' };
    let valueObj = itemsRef.value.find(obj => {
        return obj.key === props.modelValue;
    })

    if (!valueObj) return { icon: '', label: props.modelValue };
    return { iconSrc: valueObj.iconSrc, label: valueObj.label }
})

onMounted(async () => {
    if (props.queryCallback && props.property.query) {
        const results = await props.queryCallback(props.property.query)

        // Copy itemsRef from results to itemsRef using push(). Perserve reactivity!
        for (let i = 0; i < results.length; i++) {
            itemsRef.value.push(results[i]);
        }
    }
})

</script>

<template>
    <div v-if="itemsRef">

        <div
            v-if="readonly"
            class="sf-readonly-wide"
        >
            <img
                v-if="readonlyOutput.iconSrc"
                :src="readonlyOutput.iconSrc"
            />
            <span>{{ readonlyOutput.label }}</span>
        </div>

        <el-radio-group
            v-else-if="itemsRef.length < 5"
            :model-value="modelValue"
            @update:modelValue="($event) => $emit('update:modelValue', $event)"
        >
            <el-radio
                v-for="item in itemsRef"
                :key="item.key"
                :label="item.label"
                :model-value="item.key"
            ></el-radio>
        </el-radio-group>

        <el-select
            v-else
            :model-value="modelValue"
            :clearable="required ? false : true"
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

    </div>
</template>

<style scoped>
img {
    height: 20px;
    width: 20px;
    margin-right: 5px;
    vertical-align: middle;
}
</style>
