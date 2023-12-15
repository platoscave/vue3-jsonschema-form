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


const items = [];


const readonlyLabels = computed(() => {
    if (!(props.modelValue && items.value)) return "";
    return items.value.filter((obj) => {
        return props.modelValue.includes(obj.key);
    });
});

onMounted(async () => {
    if (props.queryCallback && props.property.query) {
        const items = await props.queryCallback(props.property.query)
        console.log('items', items)
        //items.value = items
        //this.$refs.
    }
})
</script>

<template>
    <div v-if="readonly" class="ar-lightgrey-background">
        <div v-for="item in readonlyLabels" :key="item.key" :model-value="item.key">
            <img :src="item.iconSrc" />
            <span>{{ item.label }}</span>
        </div>
    </div>

    <el-checkbox-group class="ar-checkbox-group" v-else-if="items.length < 5" :model-value="modelValue"
        @update:modelValue="($event) => $emit('update:modelValue', $event)">
        <el-checkbox class="ar-checkbox" v-for="item in items" :key="item.key" :label="item.label"
            :model-value="item.key"></el-checkbox>
    </el-checkbox-group>

    <el-select v-else multiple :model-value="modelValue"
        @update:modelValue="($event) => $emit('update:modelValue', $event)">
        <el-option v-for="item in items" :key="item.key" :label="item.label" :value="item.key">
            <img :src="item.iconSrc" />
            <span>{{ item.label }}</span>
        </el-option>
    </el-select>
</template>

<style scoped>
.el-checkbox.ar-checkbox {
    height: 24px
}

/* checkbox background*/
.ar-checkbox-group {
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
    margin-right: 10px;
    vertical-align: middle;
}
</style>
