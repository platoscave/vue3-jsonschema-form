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

const items = ref([])

const readonlyOutput = computed(() => {
    if (!(props.modelValue && items.value)) return { icon: '', label: '' };
    let valueObj = items.value.find(obj => {
        return obj.key === props.modelValue;
    })

    if (!valueObj) return { icon: '', label: props.modelValue };
    return { iconSrc: valueObj.iconSrc, label: valueObj.label }
})

onMounted(async () => {
    if (props.queryCallback && props.property.query) {
        const results = await props.queryCallback(props.property.query)

        // Copy items from results to items using push(). Perserve reactivity!
        for (let i = 0; i < results.length; i++) {
            items.value.push(results[i]);
        }
    }
})

</script>

<template>
    <div v-if="items">

        <div
            v-if="readonly"
            class="ar-lightgrey-background"
        >
            <img
                v-if="readonlyOutput.iconSrc"
                :src="readonlyOutput.iconSrc"
            />
            <span>{{ readonlyOutput.label }}</span>
        </div>

        <el-radio-group
            class="ar-radio-group"
            v-else-if="items.length < 5"
            :model-value="modelValue"
            @update:modelValue="($event) => $emit('update:modelValue', $event)"
        >
            <el-radio
                v-for="item in items"
                :key="item.key"
                :label="item.label"
                :model-value="item.key"
            ></el-radio>
        </el-radio-group>

        <el-select
            v-else
            class="ar-select"
            :model-value="modelValue"
            :clearable="required ? false : true"
            @update:modelValue="($event) => $emit('update:modelValue', $event)"
        >
            <el-option
                v-for="item in items"
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
.el-radio.ar-radio {
    height: 24px
}

.ar-radio-group {
    background-color: #ffffff08;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 4px;
    border-color: #00adff42;
    border-style: solid;
    border-width: 1px;
    font-size: 16px;
    line-height: 24px;
}

img {
    height: 20px;
    width: 20px;
    margin-right: 5px;
    vertical-align: middle;
}
</style>
