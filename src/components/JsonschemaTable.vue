<script setup lang="ts">
import { ref, computed } from "vue";
import BooleanCtrl from "./controls/BooleanCtrl.vue";
import StringDateTimeCtrl from "./controls/StringDateTimeCtrl.vue";
import StringMarkdownCtrl from "./controls/StringMarkdownCtrl.vue";
import StringIconCtrl from "./controls/StringIconCtrl.vue";
import StringCodeEditorCtrl from "./controls/StringCodeEditorCtrl.vue";
import ObjectNested from "./controls/ObjectNested.vue";
import NumberCtrl from "./controls/NumberCtrl.vue";
import ArrayObjectsForm from "./controls/ArrayObjectsForm.vue";
import ArrayObjectsTable from "./controls/ArrayObjectsTable.vue";
import StringQueryCtrl from "./controls/StringQueryCtrl.vue";
import StringEnumCtrl from "./controls/StringEnumCtrl.vue";
import ArrayQueryCtrl from "./controls/ArrayQueryCtrl.vue";
import StringCtrl from "./controls/StringCtrl.vue";
import JsonschemaForm from "./JsonschemaForm.vue";
import Markdown2Html from './controls/Markdown2Html.vue'

const props = defineProps({
    modelValue: { type: Array, default: () => ([{}]) },
    properties: { type: Object, default: () => ({}) },
    requiredArr: { type: Array, default: () => ([]) },
    editPermitted: { type: Object, default: () => ({}) },
    queryCallback: { type: Function },
    formMode: { type: String, default: 'Readonly Full' },
    size: { type: String, default: 'default' },
    labelWidth: { type: String, default: 'auto' },
    labelPosition: { type: String, default: 'left' },
    columWidths: { type: Array, default: () => ([]) },
    // TODO
    currentRow: { type: String, default: '' },

});

const emits = defineEmits(['update:modelValue', 'current-change', 'header-dragend'])


interface IProperty {
    tile: string;
    decription: string;
    type: string;
    contentMediaType: string;
    query: object;
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
const formElRef = ref(null);
const validate = () => {
    if (formElRef.value) return formElRef.value.validate();
};
const resetFields = () => {
    if (formElRef.value) formElRef.value.resetFields();
};
defineExpose({ validate, resetFields });

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
                if (mediaType === "text/markdown") return "StringMarkdownCtrl";
                if (mediaType === "text/html") return "StringHtmlCtrl";
                if (mediaType.startsWith("image/")) return "StringIconCtrl";
                return "StringCodeEditorCtrl";
            }
            if (property.query) return "StringQueryCtrl";
            if (property.enum) return "StringEnumCtrl";
            if (property.format === "date-time") return "StringDateTimeCtrl";
            return "StringCtrl";
        case "number": return "NumberCtrl";
        case "integer": return "NumberCtrl";
        case "boolean": return "BooleanCtrl";
        case "object":
            if (property.properties) return "ObjectNested";
            else return "StringCodeEditorCtrl";
        case "array":
            // objects
            if (property.items.type === "object" && property.items.properties) {
                if (property.displayAs === "table") return "ArrayObjectsTable"; // objects in a table
                return "ArrayObjectsForm"; // objects in a subform
            }
            // multi select
            else if (property.items.type === "string") {
                if (property.items.query) return "ArrayQueryCtrl";
                return "StringCodeEditorCtrl";
            }
    }
    return "StringCodeEditorCtrl";


};
const isNestedObject = (property: IProperty) => {
    const controlName = getControlName(property)
    if (['ObjectNested', 'ArrayObjectsForm', 'ArrayObjectsTable'].includes(controlName)) return true
    return false
}

const getComponent = (property: IProperty) => {

    const dynamicComp = [
        { name: "BooleanCtrl", comp: BooleanCtrl },
        { name: "StringDateTimeCtrl", comp: StringDateTimeCtrl },
        { name: "StringMarkdownCtrl", comp: StringMarkdownCtrl },
        { name: "StringIconCtrl", comp: StringIconCtrl },
        { name: "StringCodeEditorCtrl", comp: StringCodeEditorCtrl },
        { name: "ObjectNested", comp: ObjectNested },
        { name: "NumberCtrl", comp: NumberCtrl },
        { name: "ArrayObjectsForm", comp: ArrayObjectsForm },
        { name: "ArrayObjectsTable", comp: ArrayObjectsTable },
        { name: "ArrayQueryCtrl", comp: ArrayQueryCtrl },
        { name: "StringEnumCtrl", comp: StringEnumCtrl },
        { name: "StringQueryCtrl", comp: StringQueryCtrl },
        { name: "StringCtrl", comp: StringCtrl },
        { name: "JsonschemaForm", comp: JsonschemaForm },
    ];

    const controlName = getControlName(property)
    const nameComp = dynamicComp.find((item) => item.name === controlName);
    if (nameComp) return nameComp.comp;
    else return StringCodeEditorCtrl.comp
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
const addIcon =
    `<svg viewBox = "0 0 1024 1024" xmlns = "http://www.w3.org/2000/svg">` +
    `<path fill="currentColor" d = "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-38.4 409.6H326.4a38.4 38.4 0 1 0 0 76.8h147.2v147.2a38.4 38.4 0 0 0 76.8 0V550.4h147.2a38.4 38.4 0 0 0 0-76.8H550.4V326.4a38.4 38.4 0 1 0-76.8 0v147.2z" > </path>` +
    `< /svg>`
const deleteIcon =
    `<svg viewBox = "0 0 1024 1024" xmlns = "http://www.w3.org/2000/svg">` +
    `<path fill="currentColor" d = "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336L512 457.664z" > </path>` +
    `< /svg>`

</script>



<template>
    <!-- table-layout="auto" -->
    <el-table
        ref="tableElRef"
        :data="modelValue"
        highlight-current-row
        current-row-key="currentRow"
        border
        @current-change="($event) => $emit('current-change', $event)"
        @header-dragend="($event) => $emit('header-dragend', $event)"
    >
        <!-- <div v-for="( property, propertyName ) in  properties "> -->
        <el-table-column
            v-for="( property, propertyName) in properties"
            :column-key="propertyName"
            :prop="propertyName"
            :label="property.title"
            :sortable="property.type !== 'object' && property.type !== 'array'"
            :sort-method="(a, b) => sortFunc(property.type, a[propertyName], b[propertyName])"
            resizable
        >
            <!-- Use label slot to add label with tooltip info infoIcon -->
            <template #header>
                <span>{{ property.title }} &nbsp;</span>
                <el-tooltip
                    v-if="property.description"
                    effect="light"
                    raw-content
                >
                    <span
                        class="infoIcon"
                        v-html="infoIcon"
                    >
                    </span>
                    <template #content>
                        <Markdown2Html :model-value="property.description"></Markdown2Html>
                    </template>
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
                    v-model="scope.row[propertyName]"
                    :property="property"
                    :required-arr="property.required"
                    :updateable-properties="editPermitted[propertyName]"
                    :form-mode="formMode"
                    :size="size"
                    :label-position="labelPosition"
                    :label-width="labelWidth"
                    :query-callback="queryCallback"
                    :colum-widths="columWidths"
                    @current-change="($event: Event) => $emit('current-change', $event)"
                    @header-dragend="($event: Event) => $emit('header-dragend', $event)"
                >
                </component>
                <component
                    v-else
                    :is="getComponent(property)"
                    class="sf-full-width"
                    v-model="scope.row[propertyName]"
                    :property="property"
                    :readonly="propertyIsReadonly(formMode, propertyName)"
                    :required="props.requiredArr.includes(propertyName)"
                    :query-callback="queryCallback"
                    :colum-widths="columWidths"
                >
                </component>
            </template>
        </el-table-column>
        <el-table-column
            label=""
            width="40"
        >
            <!-- Use label slot to add label with tooltip info infoIcon -->
            <template #header>
                <div
                    class="icon-add"
                    v-html="addIcon"
                    @click="modelValue.push({})"
                ></div>
            </template>
            <template #default="scope">
                <div
                    class="icon-delete"
                    v-html="deleteIcon"
                    @click="modelValue.splice(idx, 1)"
                >
                </div>
            </template>
        </el-table-column>
        <!-- </div> -->


    </el-table>
</template>
<style scoped>
.infoIcon {
    /* force infoIcon next to label */
    color: var(--el-color-primary-light-7);
    display: inline-block;
    width: 1.5em;
    height: 1.5em;
}

.infoIcon :hover {
    color: var(--el-color-primary-light-3);
}

/* Icons */
.icon-delete {
    height: 1.5em;
    width: 1.5em;
    margin: 3px;
    color: var(--el-color-error-light-5);
    z-index: 20;
}

.icon-delete :hover {
    /* color: var(--el-color-error); */
    color: red;
}

.icon-add {
    height: 1.5em;
    width: 1.5em;
    margin: 3px;
    color: var(--el-color-success-light-5);
    z-index: 20;
    border-radius: 50%;
}

.icon-add :hover {
    color: var(--el-color-success);
}

.not-readonly:hover {
    cursor: pointer;
}
</style>