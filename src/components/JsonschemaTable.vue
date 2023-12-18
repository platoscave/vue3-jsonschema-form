<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import BooleanCtrl from "./controls/BooleanCtrl.vue";
import DateTimeCtrl from "./controls/DateTimeCtrl.vue";
import MarkDown from "./controls/MarkdownCtrl.vue";
import Image from "./controls/Image.vue";
import CodeEditor from "./controls/CodeEditor.vue";
import NestedObject from "./controls/NestedObject.vue";
import NumberCtrl from "./controls/NumberCtrl.vue";
import ObjectsArray from "./controls/ObjectsArray.vue";
import TableArray from "./controls/TableArray.vue";
import SelectStringQuery from "./controls/SelectStringQuery.vue";
import SelectStringEnumCtrl from "./controls/SelectStringEnumCtrl.vue";
import SelectArrayQuery from "./controls/SelectArrayQuery.vue";
import StringCtrl from "./controls/StringCtrl.vue";
import JsonschemaForm from "./JsonschemaForm.vue";

const props = defineProps({
    modelValue: { type: Object, default: () => ([]) },
    properties: { type: Object, default: () => ({}) },
    requiredArr: { type: Array, default: () => ([]) },
    editPermitted: { type: Object, default: () => ({}) },
    queryCallback: { type: Function },
    formMode: { type: String, default: 'Readonly Full' },
    size: { type: String, default: 'default' },
    labelWidth: { type: String, default: 'auto' },
    labelPosition: { type: String, default: 'left' },
    columWidths: { type: Array, default: () => ([]) }
});

const emit = defineEmits(['update:modelValue', 'current-change', 'header-dragend'])


interface IProperty {
    tile: string;
    decription: string;
    type: string;
    contentMediaType: string;
    argoQuery: object;
    enum: string[];
    format: string;
    properties: object;
    items: {
        type: string;
        properties: object;
        argoQuery: object;
    };
    displayAs: string;
}

// methodes called from outside, so pass on to our form
const formEl = ref(null);
const validate = () => {
    if (formEl.value) return formEl.value.validate();
};
const resetFields = () => {
    if (formEl.value) formEl.value.resetFields();
};
defineExpose({ validate, resetFields });

watch(props.modelValue, (newDataObj, oldDataObj) => {

    console.log('JSF dataObj', newDataObj)
}, { deep: true });

const validationRules = computed(() => {

    let rulesObj = {};
    // no rules for readonly
    if (props.formMode.startsWith('Readonly')) return {};

    for (var propertyName in props.properties) {
        const property = props.properties[propertyName];

        let rulesArr = [];

        if (props.requiredArr.includes(propertyName)) {
            rulesArr.push({
                required: true,
                message: property.title + " is required.",
            });
        }
        if (property.minLength) {
            rulesArr.push({
                min: property.minLength,
                message: "Please enter at least " + property.minLength + " characters.",
            });
        }
        // email
        if (property.format) {
            if (property.format === "email") {
                rulesArr.push({
                    type: "email",
                    message: "Please enter a valid email address. eg: name@provider.com",
                });
            } else if (property.format === "uri") {
                rulesArr.push({
                    type: "url",
                    message: "Please enter a valid url. eg: https://provider.com",
                });
            }
        }
        if (property.pattern) {
            rulesArr.push({
                pattern: property.pattern,
                message: " Input must comply with: " + property.pattern,
            });
        }

        rulesObj[propertyName] = rulesArr;
    }

    return rulesObj;
});

const includeThisProperty = (formMode: string, dataObj: object[] = [], type: string) => {
    if (
        formMode === "Readonly Dense" &&
        (!dataObj || // modelValue is empty
            (type === "array" && !dataObj.length) || // modelValue is an array and is empty
            (type === "object" && !Object.keys(dataObj).length) // modelValue is an object and is empty
        )
    ) return false;
    return true;
}
const propertyIsReadonly = (formMode: string, propertyName: string) => {
    if (formMode.startsWith('Readonly')) return true
    if (formMode === 'Edit Permitted') return false
    return false
}

// Determin the control type
const getControlName = (property: IProperty) => {

    switch (property.type) {
        case "string":
            const mediaType = property.contentMediaType
            if (mediaType) {
                if (mediaType === "text/markdown") return "MarkDown";
                if (mediaType === "text/html") return "Html";
                if (mediaType.startsWith("image/")) return "Image";
                return "CodeEditor";
            }
            if (property.argoQuery) return "SelectStringQuery";
            if (property.enum) return "SelectStringEnumCtrl";
            if (property.format === "date-time") return "DateTimeCtrl";
            return "StringCtrl";
        case "number": return "NumberCtrl";
        case "integer": return "NumberCtrl";
        case "boolean": return "BooleanCtrl";
        case "object":
            if (property.properties) return "NestedObject";
            else return "CodeEditor";
        case "array":
            // objects
            if (property.items.type === "object" && property.items.properties) {
                if (property.displayAs === "Table") return "TableArray"; // objects in a table
                return "ObjectsArray"; // objects in a subform
            }
            // multi select
            else if (property.items.type === "string") {
                if (property.items.argoQuery) return "SelectArrayQuery";
                return "CodeEditor";
            }
    }
    return "CodeEditor";

};
const isNestedObject = (property: IProperty) => {
    const controlName = getControlName(property)
    if (controlName in ['NestedObject', 'ObjectsArray', 'TableArray']) return true
    return false
}

const getComponent = (property: IProperty) => {

    const dynamicComp = [
        { name: "BooleanCtrl", comp: BooleanCtrl },
        { name: "DateTimeCtrl", comp: DateTimeCtrl },
        { name: "MarkDown", comp: MarkdownCtrl },
        { name: "Image", comp: Image },
        { name: "CodeEditor", comp: CodeEditor },
        { name: "NestedObject", comp: NestedObject },
        { name: "NumberCtrl", comp: NumberCtrl },
        { name: "ObjectsArray", comp: ObjectsArray },
        { name: "SelectArrayQuery", comp: SelectArrayQuery },
        { name: "SelectStringEnumCtrl", comp: SelectStringEnumCtrl },
        { name: "SelectStringQuery", comp: SelectStringQuery },
        { name: "StringCtrl", comp: StringCtrl },
        { name: "JsonschemaForm", comp: JsonschemaForm },
        { name: "TableArray", comp: TableArray },
    ];

    const controlName = getControlName(property)
    const nameComp = dynamicComp.find((item) => item.name === controlName);
    if (nameComp) return nameComp.comp;
    else return CodeEditor.comp
};
const sortFunc = (type: string, a: any, b: any) => {
    if (type === "string") {
        if (a.toUpperCase() < b.toUpperCase()) return -1;
        if (a.toUpperCase() > b.toUpperCase()) return 1;
        return 0;
    } else if (type === "number") {
        const toFloat = (num) => parseFloat(num.replace(".", "").replace(",", "."));
        return toFloat(a) - toFloat(b);
    }
    return 0;
};
const infoIcon =
    `<svg viewBox="0 0 100 100" height="12" width="12" >` +
    `   <circle cx="50" cy = "50" r = "50" fill="blue"/>` +
    `   <text fill="rgba(255, 255, 255, 0.87)" x = "33" y = "80" font-size="70" font-style="italic" font-weight="1000" >i</text>` +
    `</svg>`

</script>



<template>
    <!-- table-layout="auto" -->
    <el-table
        v-if="modelValue && properties"
        ref="tableEl"
        :data="modelValue"
        highlight-current-row
        border
        @current-change="($event) => $emit('current-change', $event)"
        @header-dragend="($event) => $emit('header-dragend', $event)"
    >
        <!--  -->
        <el-table-column
            v-for="( property, propertyName ) in  properties.properties "
            :key="propertyName"
            :property="propertyName"
            :width="columWidths[propertyName]"
            :label="property.title"
            :sortable="property.type !== 'object' && property.type !== 'array'"
            :sort-method="(a, b) => sortFunc(property.type, a[propertyName], b[propertyName])"
            resizable
        >
            <!-- Header with tooltip. -->
            <template #header>
                <span>{{ property.title + " " }} &nbsp;</span>
                <el-tooltip
                    v-if="property.description"
                    effect="light"
                    :content="property.description"
                    raw-content
                >
                    <div
                        class="icon"
                        v-html="infoIcon"
                        height="1em"
                        width="1em"
                    ></div>
                </el-tooltip>
            </template>

            <!-- The control -->
            <template #default="scope">
                <!-- <component :is="getComponent(property)" class="sf-full-width" v-model="scope.row[propertyName]"
                    :property="property" :readonly="formMode.startsWith('Readonly')" :required="false"
                    :hash-level="hashLevel" :form-mode="formMode">
                </component> -->
                <!-- Nested objects have different parms than simple controls. Hense isNestedObject -->
                <!-- The dynamic component is found using getComponent -->
                <component
                    v-if="isNestedObject(property)"
                    :is="getComponent(property)"
                    class="sf-full-width"
                    v-model="modelValue[propertyName]"
                    :property="property.properties"
                    :required-arr="property.required"
                    :updateable-properties="editPermitted[propertyName]"
                    :form-mode="formMode"
                    :size="size"
                    :label-position="labelPosition"
                    :label-width="labelWidth"
                    :query-callback="queryCallback"
                >
                </component>
                <component
                    v-else
                    :is="getComponent(property)"
                    class="sf-full-width"
                    v-model="modelValue[propertyName]"
                    :property="property"
                    :readonly="propertyIsReadonly(formMode, propertyName)"
                    :required="requiredArr.includes(propertyName)"
                >
                </component>
            </template>
        </el-table-column>
    </el-table>
</template>
<style scoped>
/* Item bottom margin */
.el-form-item {
    /* to make the form more dense */
    margin-bottom: 8px;
}



.icon /deep/ circle {
    fill: var(--el-color-primary-light-7);
    margin-left: 5px;

}

.icon /deep/ text {
    fill: var(--el-color-primary);
}

.icon {
    /* force icon next to label */
    display: inline;
    width: 12px;
    height: 12px;
}
</style>