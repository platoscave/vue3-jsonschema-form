<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import BooleanCtrl from "./controls/BooleanCtrl.vue";
import DateTimeCtrl from "./controls/DateTimeCtrl.vue";
import MarkDown from "./controls/MarkdownCtrl.vue";
import StringIconCtrl from "./controls/StringIconCtrl.vue";
import CodeEditorCtrl from "./controls/CodeEditorCtrl.vue";
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
                if (mediaType.startsWith("image/")) return "StringIconCtrl";
                return "CodeEditorCtrl";
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
            else return "CodeEditorCtrl";
        case "array":
            // objects
            if (property.items.type === "object" && property.items.properties) {
                if (property.displayAs === "Table") return "TableArray"; // objects in a table
                return "ObjectsArray"; // objects in a subform
            }
            // multi select
            else if (property.items.type === "string") {
                if (property.items.argoQuery) return "SelectArrayQuery";
                return "CodeEditorCtrl";
            }
    }
    return "CodeEditorCtrl";

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
        { name: "StringIconCtrl", comp: StringIconCtrl },
        { name: "CodeEditorCtrl", comp: CodeEditorCtrl },
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
    else return CodeEditorCtrl.comp
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
    `<svg viewBox = "0 0 1024 1024" xmlns = "http://www.w3.org/2000/svg">` +
    `<path fill="currentColor" d = "M512 64a448 448 0 1 1 0 896.064A448 448 0 0 1 512 64zm67.2 275.072c33.28 0 60.288-23.104 60.288-57.344s-27.072-57.344-60.288-57.344c-33.28 0-60.16 23.104-60.16 57.344s26.88 57.344 60.16 57.344zM590.912 699.2c0-6.848 2.368-24.64 1.024-34.752l-52.608 60.544c-10.88 11.456-24.512 19.392-30.912 17.28a12.992 12.992 0 0 1-8.256-14.72l87.68-276.992c7.168-35.136-12.544-67.2-54.336-71.296-44.096 0-108.992 44.736-148.48 101.504 0 6.784-1.28 23.68.064 33.792l52.544-60.608c10.88-11.328 23.552-19.328 29.952-17.152a12.8 12.8 0 0 1 7.808 16.128L388.48 728.576c-10.048 32.256 8.96 63.872 55.04 71.04 67.84 0 107.904-43.648 147.456-100.416z" > </path>` +
    `< /svg>`

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
                        class="infoIcon"
                        v-html="infoIcon"
                        height="1em"
                        width="1em"
                    ></div>
                </el-tooltip>
            </template>

            <!-- The control -->
            <template #default="scope">
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

.infoIcon {
    /* force infoIcon next to label */
    color: var(--el-color-primary-light-7);
    display: inline;
    width: 1em;
    height: 1em;
}

.infoIcon :hover {
    color: var(--el-color-primary-light-3);
}
</style>