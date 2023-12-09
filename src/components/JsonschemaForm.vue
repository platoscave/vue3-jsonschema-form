<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import DateTime from "./controls/DateTime.vue";
import MarkDown from "./controls/MarkDown.vue";
import Image from "./controls/Image.vue";
import CodeEditor from "./controls/CodeEditor.vue";
import NestedObject from "./controls/NestedObject.vue";
import Number from "./controls/Number.vue";
import ObjectsArray from "./controls/ObjectsArray.vue";
import TableArray from "./controls/TableArray.vue";
import SelectStringQuery from "./controls/SelectStringQuery.vue";
import SelectStringEnum from "./controls/SelectStringEnum.vue";
import SelectArrayQuery from "./controls/SelectArrayQuery.vue";
import StringPlain from "./controls/StringPlain.vue";
import JsonschemaForm from "./JsonschemaForm.vue";

const props = defineProps({
    modelValue: { type: Object, default: () => { } },
    properties: { type: Object, default: () => { } },
    requiredArr: { type: Array, default: () => [] },
    updateableProperties: { type: Object, default: () => { } },
    queryCallback: { type: Function },
    formMode: { type: String, default: 'Readonly Full' },
    size: { type: String, default: 'Default' },
    labelWidth: { type: String, default: 'auto' },
    labelPosition: { type: String, default: 'left' }
});

const emit = defineEmits(['update'])

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

const includeThisProperty = (formMode: string, dataObj: object[], type: string) => {
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

const getComponent = (property: IProperty) => {

    const dynamicComp = [
        { name: "DateTime", comp: DateTime },
        { name: "MarkDown", comp: MarkDown },
        { name: "Image", comp: Image },
        { name: "CodeEditor", comp: CodeEditor },
        { name: "NestedObject", comp: NestedObject },
        { name: "Number", comp: Number },
        { name: "ObjectsArray", comp: ObjectsArray },
        { name: "SelectArrayQuery", comp: SelectArrayQuery },
        { name: "SelectStringEnum", comp: SelectStringEnum },
        { name: "SelectStringQuery", comp: SelectStringQuery },
        { name: "StringPlain", comp: StringPlain },
        { name: "JsonschemaForm", comp: JsonschemaForm },
        { name: "TableArray", comp: TableArray },
    ];

    // Determin the control type
    const getControlName = (type: string) => {

        switch (type) {
            case "string":
                const mediaType = property.contentMediaType
                if (mediaType) {
                    if (mediaType === "text/html") return "Html";
                    if (mediaType.startsWith("image/")) return "Image";
                    return "CodeEditor";
                }
                if (property.argoQuery) return "SelectStringQuery";
                if (property.enum) return "SelectStringEnum";
                if (property.format === "date-time") return "DateTime";
                return "StringPlain";
            case "number": return "Number";
            case "integer": return "Number";
            case "boolean": return "ElCheckbox";
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

    const controlName = getControlName(property.type)
    const nameComp = dynamicComp.find((item) => item.name === controlName);
    if (nameComp) return nameComp.comp;
    else return CodeEditor.comp
};
const infoIcon =
    `<svg viewBox = "0 0 1024 1024" xmlns = "http://www.w3.org/2000/svg">\n` +
    `    <path fill="blue" d="M512 64a448 448 0 1 1 0 896.064A448 448 0 0 1 512 64zm67.2 275.072c33.28 0 60.288-23.104 60.288-57.344s-27.072-57.344-60.288-57.344c-33.28 0-60.16 23.104-60.16 57.344s26.88 57.344 60.16 57.344zM590.912 699.2c0-6.848 2.368-24.64 1.024-34.752l-52.608 60.544c-10.88 11.456-24.512 19.392-30.912 17.28a12.992 12.992 0 0 1-8.256-14.72l87.68-276.992c7.168-35.136-12.544-67.2-54.336-71.296-44.096 0-108.992 44.736-148.48 101.504 0 6.784-1.28 23.68.064 33.792l52.544-60.608c10.88-11.328 23.552-19.328 29.952-17.152a12.8 12.8 0 0 1 7.808 16.128L388.48 728.576c-10.048 32.256 8.96 63.872 55.04 71.04 67.84 0 107.904-43.648 147.456-100.416z"></path>\n` +
    `</svg >`
</script>
<template>
    <!-- Validation rules are provided by a Computed -->
    <!-- :model and :rules are needed for validation rules. Do not mess with them! You will regret it-->
    <el-form ref="formEl" :model="modelValue" :rules="validationRules" :size="size" :label-position="labelPosition"
        :label-width="labelWidth" :show-message="formMode.startsWith('Edit')">
        <!-- For each property in properties -->
        <div v-for="(property, propertyName) in properties" :key="propertyName">
            <!-- includeThisProperty: Skip form item if formMode is Readonly Dense and value is empty -->
            <!-- :prop is needed for validation rules. Do not mess with it! -->
            <el-form-item class="ar-form-item" v-if="includeThisProperty(formMode, modelValue[propertyName], property.type)
                " :prop="propertyName">
                <!-- Use label slot to add label with info icon -->
                <template #label>
                    <span>{{ property.title + " " }}</span>
                    <el-tooltip v-if="property.description" effect="light" :content="property.description" raw-content>
                        <svg class="icon" height="1em" width="1em" color="blue">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                :xlink:href="'toolbar-symbols.svg#el-icon-info'"></use>
                        </svg>
                    </el-tooltip>
                </template>
                <component :is="getComponent(property)" class="ar-control" v-model="modelValue[propertyName]"
                    :property="property" :readonly="propertyIsReadonly(formMode, propertyName)"
                    :required="requiredArr.includes(propertyName)" :form-mode="formMode">
                </component>
            </el-form-item>
        </div>
    </el-form>
</template>
