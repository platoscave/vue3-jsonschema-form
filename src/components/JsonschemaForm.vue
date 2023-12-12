<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import BooleanCtrl from "./controls/BooleanCtrl.vue";
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
import { ElCheckbox } from "element-plus";

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

// Determin the control type
const getControlName = (property: IProperty) => {

    switch (property.type) {
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

    const controlName = getControlName(property)
    const nameComp = dynamicComp.find((item) => item.name === controlName);
    if (nameComp) return nameComp.comp;
    else return CodeEditor.comp
};
const infoIcon =
    `<svg viewBox="0 0 100 100" height="12" width="12" >` +
    `   <circle cx="50" cy = "50" r = "50" fill="blue"/>` +
    `   <text fill="rgba(255, 255, 255, 0.87)" x = "33" y = "80" font-size="70" font-style="italic" font-weight="1000" >i</text>` +
    `</svg>`

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
                <!-- Use label slot to add label with tooltip info icon -->
                <template #label>
                    <span>{{ property.title + " " }} &nbsp;</span>
                    <el-tooltip v-if="property.description" effect="light" :content="property.description" raw-content>
                        <div class="icon" v-html="infoIcon" height="1em" width="1em"></div>
                    </el-tooltip>
                </template>
                <!-- The dynamic component is found using getComponent -->
                <div v-if="isNestedObject(property)"></div>
                <!-- <component v-if="isNestedObject(property)" :is="getComponent(property)" class="ar-control"
                    v-model="modelValue[propertyName]" :property="property.properties" :required-arr="property.required"
                    :updateable-properties="updateableProperties" :form-mode="formMode" :size="size"
                    :label-position="labelPosition" :label-width="labelWidth" :query-callback="queryCallback">
                </component> -->
                <component v-else :is="getComponent(property)" class="ar-control" v-model="modelValue[propertyName]"
                    :property="property" :readonly="propertyIsReadonly(formMode, propertyName)"
                    :required="requiredArr.includes(propertyName)">
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
    display: inline;
    width: 12px;
    height: 12px;
}
</style>