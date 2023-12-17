<script setup lang="ts">
const props = defineProps({
    modelValue: { type: Object, default: () => ([{}]) },
    property: { type: Object, default: () => ({}) },
    requiredArr: { type: Array, default: () => ([]) },
    editPermitted: { type: Object, default: () => ({ items: {} }) },
    queryCallback: { type: Function },
    formMode: { type: String, default: 'Readonly Full' },
    size: { type: String, default: 'default' },
    labelWidth: { type: String, default: 'auto' },
    labelPosition: { type: String, default: 'left' }
});
const emits = defineEmits(['update:modelValue'])


const onUpdateModelValue = (newDataObj: any, idx: string) => {
    props.modelValue[idx] = newDataObj
    emits('update:modelValue', props.modelValue)
}

const addIcon =
    `<svg id="el-icon-plus" viewBox = "0 0 1024 1024" xmlns = "http://www.w3.org/2000/svg">` +
    `<path fill="currentColor" d = "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-38.4 409.6H326.4a38.4 38.4 0 1 0 0 76.8h147.2v147.2a38.4 38.4 0 0 0 76.8 0V550.4h147.2a38.4 38.4 0 0 0 0-76.8H550.4V326.4a38.4 38.4 0 1 0-76.8 0v147.2z" > </path>` +
    `< /svg>`
const deleteIcon =
    `<svg id="el-icon-close" viewBox = "0 0 1024 1024" xmlns = "http://www.w3.org/2000/svg">` +
    `<path fill="currentColor" d = "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336L512 457.664z" > </path>` +
    `< /svg>`
</script>

<template>
    <div>
        <!-- Create a subForm for each of the items in the modelValue array -->
        <div
            v-for="(item, idx) in modelValue"
            :key="idx"
            :class="{
                'ar-subform-background': true,
                'not-readonly': formMode.startsWith('Edit') && property.additionalItems,
            }"
        >
            <JsonschemaForm
                class="xar-subform-background"
                :model-value="modelValue[idx]"
                :properties="property.items.properties"
                :requiredArr="property.required"
                :updateable-properties="editPermitted.items.properties"
                :form-mode="formMode"
                :size="size"
                :label-position="labelPosition"
                :label-width="labelWidth"
                :query-callback="queryCallback"
                @update:modelValue="($event: any) => onUpdateModelValue($event, idx)"
            >
            </JsonschemaForm>
            <!-- Delete icon -->
            <div
                class="icon-delete"
                v-if="formMode.startsWith('Edit') && property.additionalItems"
                v-html="deleteIcon"
                height="1.5em"
                width="1.5em"
                @click="modelValue.splice(idx, 1)"
            ></div>
        </div>
        <!-- Add icon -->
        <div
            class="icon-add"
            v-if="formMode.startsWith('Edit') && property.additionalItems"
            v-html="addIcon"
            height="1.5em"
            width="1.5em"
            @click="modelValue.push({})"
        ></div>
    </div>
</template>

<style scoped>
/* subForm background */
.ar-subform-background {
    background-color: #ffffff08;
    padding: 10px 10px 10px 15px;
    border-radius: 4px;
    border-style: none;
    position: relative;
}

.ar-subform-background:not(:last-child) {
    xmargin-bottom: 10px;
}

/* Icons */
.icon-delete {
    height: 1.5em;
    width: 1.5em;
    position: absolute;
    margin: 3px;
    top: 0px;
    right: 0;
    /* background-color: #ff4000a3; */
    color: #ff4000a3;
    z-index: 20;
    border-radius: 50%;
}

.icon-delete :hover {
    color: #DA4567;
}

.icon-add {
    height: 1.5em;
    width: 1.5em;
    margin: 3px;
    /* background-color: green; */
    color: green;
    z-index: 20;
    border-radius: 50%;
}

.icon-add :hover {
    color: rgb(5, 202, 5);
}

.not-readonly:hover {
    cursor: pointer;
}
</style>
