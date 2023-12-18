<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import BooleanCtrl from "./controls/BooleanCtrl.vue";
import DateTimeCtrl from "./controls/DateTimeCtrl.vue";
import MarkdownCtrl from "./controls/MarkdownCtrl.vue";
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
    modelValue: { type: Object, default: () => ({}) },
    properties: { type: Object, default: () => ({}) },
    requiredArr: { type: Array, default: () => ([]) },
    editPermitted: { type: Object, default: () => ({}) },
    queryCallback: { type: Function },
    formMode: { type: String, default: 'Readonly Full' },
    size: { type: String, default: 'default' },
    labelWidth: { type: String, default: 'auto' },
    labelPosition: { type: String, default: 'left' }
});

const emits = defineEmits(['update:modelValue'])


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
        query: object;
    };
    displayAs: string;
}

// Methodes called from parent comp, so pass on to our form
const formEl = ref(null);
const validate = () => {
    if (formEl.value) return formEl.value.validate();
};
const resetFields = () => {
    if (formEl.value) formEl.value.resetFields();
};
// Expose these methods to parent component
defineExpose({ validate, resetFields });

// We do our own 'update:modelValue' so we can take advantage of 
// v-model automatic update of subproperties
watch(() => props.modelValue, (newDataObj, oldDataObj) => {

    console.log('JSFwacth dataObj', newDataObj)

}, { deep: true });

// Create the validation rules object
const validationRules = computed(() => {

    let rulesObj = {};
    // no rules for readonly
    // TODO formmode Edit Permitted
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

// Determin the control name based on property type
const getControlName = (property: IProperty) => {

    switch (property.type) {
        case "string":
            const mediaType = property.contentMediaType
            if (mediaType) {
                console.log('mediaType', mediaType)
                if (mediaType === "text/markdown") return "MarkdownCtrl";
                if (mediaType === "text/html") return "Html";
                if (mediaType.startsWith("image/")) return "Image";
                return "CodeEditor";
            }
            if (property.query) return "SelectStringQuery";
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
                if (property.items.query) return "SelectArrayQuery";
                return "CodeEditor";
            }
    }
    return "CodeEditor";

};
// Nested object have different props compared to plain controls, so we find out here 
const isNestedObject = (property: IProperty) => {
    const controlName = getControlName(property)
    if (['NestedObject', 'ObjectsArray', 'TableArray'].includes(controlName)) return true
    return false
}


const onUpdateModelValue = (newDataObj: any, propertyName: string) => {
    props.modelValue[propertyName] = newDataObj
    emits('update:modelValue', props.modelValue)
}

// Get the control component based on name 
const getComponent = (property: IProperty) => {

    const dynamicComp = [
        { name: "BooleanCtrl", comp: BooleanCtrl },
        { name: "DateTimeCtrl", comp: DateTimeCtrl },
        { name: "MarkdownCtrl", comp: MarkdownCtrl },
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
const infoIcon =
    `<svg viewBox = "0 0 1024 1024" xmlns = "http://www.w3.org/2000/svg">` +
    `<path fill="currentColor" d = "M512 64a448 448 0 1 1 0 896.064A448 448 0 0 1 512 64zm67.2 275.072c33.28 0 60.288-23.104 60.288-57.344s-27.072-57.344-60.288-57.344c-33.28 0-60.16 23.104-60.16 57.344s26.88 57.344 60.16 57.344zM590.912 699.2c0-6.848 2.368-24.64 1.024-34.752l-52.608 60.544c-10.88 11.456-24.512 19.392-30.912 17.28a12.992 12.992 0 0 1-8.256-14.72l87.68-276.992c7.168-35.136-12.544-67.2-54.336-71.296-44.096 0-108.992 44.736-148.48 101.504 0 6.784-1.28 23.68.064 33.792l52.544-60.608c10.88-11.328 23.552-19.328 29.952-17.152a12.8 12.8 0 0 1 7.808 16.128L388.48 728.576c-10.048 32.256 8.96 63.872 55.04 71.04 67.84 0 107.904-43.648 147.456-100.416z" > </path>` +
    `< /svg>`

</script>


<template>
    <!-- Validation rules are provided by a Computed -->
    <!-- :model and :rules are needed for validation rules. Do not mess with them! You will regret it-->
    <el-form
        ref="formEl"
        :model="modelValue"
        :rules="validationRules"
        :size="size"
        :label-position="labelPosition"
        :label-width="labelWidth"
        :show-message="formMode.startsWith('Edit')"
    >
        <!-- For each property in properties -->
        <div
            v-for="(property, propertyName) in properties"
            :key="propertyName"
        >
            <!-- includeThisProperty: Skip form item if formMode is Readonly Dense and value is empty -->
            <!-- :prop is needed for validation rules. Do not mess with it! -->
            <el-form-item
                v-if="includeThisProperty(formMode, modelValue[propertyName], property.type)"
                :prop="propertyName"
            >
                <!-- Use label slot to add label with tooltip info icon -->
                <template #label>
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
                            height="1.5em"
                            width="1.5em"
                        ></div>
                    </el-tooltip>
                </template>
                <!-- Nested objects have different parms than simple controls. Hense isNestedObject -->
                <!-- The dynamic component is found using getComponent -->
                <component
                    v-if="isNestedObject(property)"
                    :is="getComponent(property)"
                    class="sf-full-width"
                    :model-value="modelValue[propertyName]"
                    :property="property"
                    :required-arr="property.required"
                    :updateable-properties="editPermitted[propertyName]"
                    :form-mode="formMode"
                    :size="size"
                    :label-position="labelPosition"
                    :label-width="labelWidth"
                    :query-callback="queryCallback"
                    @update:modelValue="($event: any) => onUpdateModelValue($event, propertyName)"
                >
                </component>
                <component
                    v-else
                    :is="getComponent(property)"
                    class="sf-full-width"
                    :model-value="modelValue[propertyName]"
                    :property="property"
                    :readonly="propertyIsReadonly(formMode, propertyName)"
                    :required="props.requiredArr.includes(propertyName)"
                    :query-callback="queryCallback"
                    @update:modelValue="($event: any) => onUpdateModelValue($event, propertyName)"
                >
                </component>
            </el-form-item>
        </div>
    </el-form>
</template>
<style scoped>
.icon /deep/ circle {
    fill: var(--el-color-primary-light-7);
}

.icon /deep/ text {
    fill: var(--el-color-primary);
}

.icon {
    /* force icon next to label */
    color: var(--el-color-primary-light-7);
    display: inline;
    width: 1.5em;
    height: 1.5em;
}

.icon :hover {
    color: var(--el-color-primary-light-3);
}
</style>