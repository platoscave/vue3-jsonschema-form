<script setup lang="ts">
import { ref, watch, reactive, toRaw, toRefs, computed, onMounted } from "vue";

import initialFormSchemaObj from './testData/initialFormSchemaObj'
import initialFormDataObj from './testData/initialFormDataObj'
import initialEditPermittedObj from './testData/initialEditPermittedObj'
import initialFormQueryData from './testData/formQueryDataRef'

import StringCodeEditorCtrl from './components/controls/StringCodeEditorCtrl.vue'

import { Codemirror } from 'vue-codemirror'

import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { useDark, useToggle } from '@vueuse/core'
// Using ES6 import syntax
//import hljs from 'highlight.js/lib/core';
//import javascript from 'highlight.js/lib/languages/javascript';
// Then register the languages you need
//hljs.registerLanguage('javascript', javascript);

let isDark = useDark()
const toggleDark = useToggle(isDark)
const extensions = [json(), oneDark]

let formModeRef = ref("Edit Full")
let sizeRef = ref("default")
let labelPositionRef = ref("left")
let labelWidtthRef = ref("auto")
let validRef = ref(true)

let formSchemaObjRef = ref(initialFormSchemaObj)
let formDataObjRef = ref(initialFormDataObj)
let formEditPermittedRef = ref(initialEditPermittedObj)
let formQueryDataRef = ref(initialFormQueryData)


// const updatedFormDataObj = (newFormDataObj: {}) => {
//     // validate
//     // copy
//     //formDataObjRef.value = newFormDataObj
// }
const validateForm = () => {

};
const resetForm = () => {
    //formDataObjRef.value = initialFormDataObj

    formSchemaObjRef = initialFormSchemaObj
    formEditPermittedRef = initialEditPermittedObj
};

// Query callback for dropdown listbox. Returns a promise 
// the list is filled when the promise is resolved
const queryCallback = (query: any) => {

    let data = formQueryDataRef.value
    if (query.select === 'small') data = formQueryDataRef.value.slice(0, 3)
    // artitificial delay 2 sec
    return new Promise(function (resolve) {
        setTimeout(() => resolve(data), 2000);
    });
}

// Copy properties, perserve reactivity
const copyToRef = (sourceStr: string, destObj: any) => {
    try {
        const sourceObj = JSON.parse(sourceStr)
        // delete properties one by one
        Object.keys(destObj).forEach(key => delete destObj[key]);
        Object.keys(sourceObj).forEach(key => destObj[key] = sourceObj[key]);
    }
    catch (err: any) {
        console.log(err.message)
    }
}

onMounted(() => {
    resetForm()
})
// deep watch dataObj, perform pudate
watch(formDataObjRef, (newDataObj, oldDataObj) => {

    console.log('App dataObj', newDataObj)

}, { deep: true });


</script>

<template>
    <div class="header">Vue3 Jsonschema Form/Table</div>

    <button @click="toggleDark()">
        <i
            inline-block
            align-middle
            i="dark:carbon-moon carbon-sun"
        />
        <span class="ml-2">{{ isDark ? 'Dark' : 'Light' }}</span>
    </button>
    <div>
        <el-radio-group v-model="formModeRef">
            <el-radio label="Readonly Dense">Readonly Dense</el-radio>
            <el-radio label="Readonly Full">Readonly Full</el-radio>
            <el-radio label="Edit Permitted">Edit Permitted</el-radio>
            <el-radio label="Edit Full">Edit Full</el-radio>
        </el-radio-group>
    </div>
    <div>
        <el-radio-group v-model="sizeRef">
            <el-radio label="large">large</el-radio>
            <el-radio label="default">default</el-radio>
            <el-radio label="small">small</el-radio>
        </el-radio-group>
    </div>
    <div>
        <el-radio-group v-model="labelPositionRef">
            <el-radio label="left">left</el-radio>
            <el-radio label="right">right</el-radio>
            <el-radio label="top">top</el-radio>
        </el-radio-group>
    </div>
    <div>
        <el-input
            v-model="labelWidtthRef"
            style="width:200px;"
            placeholder="Label width: e.g. 100 or auto"
            @input="labelWidtthRef = $event.target.value"
            sizeRef="small"
        ></el-input>
    </div>
    <div>
        <button @click="validateForm()">Validate</button>
        <button @click="resetForm()">Reset</button>
        <span>Is Valid: {{ validRef }}</span>
    </div>
    <el-tabs>
        <el-tab-pane label="Form">
            <splitpanes
                vertical
                class="default-theme"
            >
                <pane sizeRef="25">
                    <div class="header">Jsonschema Object</div>
                    <StringCodeEditorCtrl
                        :model-value="JSON.stringify(formSchemaObjRef, null, 2)"
                        :readonly=false
                        @update:modelValue="($event) => copyToRef($event, formSchemaObjRef)"
                    ></StringCodeEditorCtrl>
                </pane>
                <pane>
                    <h2>Jsonschema Form</h2>
                    <!-- The form -->
                    <JsonschemaForm
                        v-model="formDataObjRef"
                        :properties="formSchemaObjRef.properties"
                        :required-arr="formSchemaObjRef.required"
                        :updateable-properties="formEditPermittedRef"
                        :form-mode="formModeRef"
                        :sizeRef="sizeRef"
                        :label-position="labelPositionRef"
                        :label-width="labelWidtthRef"
                        :query-callback="queryCallback"
                    >
                    </JsonschemaForm>
                </pane>
                <pane sizeRef="25">
                    <div class="header">Data Object</div>
                    <StringCodeEditorCtrl
                        :model-value="JSON.stringify(formDataObjRef, null, 2)"
                        :readonly=false
                        @update:modelValue="($event) => copyToRef($event, formDataObjRef)"
                    ></StringCodeEditorCtrl>
                    <div class="header">Edit Permitted Object</div>
                    <!-- <div>Only aplicable in "Edit Permitted" Form Mode</div> -->
                    <StringCodeEditorCtrl
                        :model-value="JSON.stringify(formEditPermittedRef, null, 2)"
                        :readonly=false
                        @update:modelValue="($event) => copyToRef($event, formEditPermittedRef)"
                    ></StringCodeEditorCtrl>
                </pane>
            </splitpanes>
        </el-tab-pane>
        <el-tab-pane label="Table">
            <el-tabs>
                <el-tab-pane label="Schema Table">Form</el-tab-pane>
                <el-tab-pane label="Jsonschema">Table"</el-tab-pane>
                <el-tab-pane label="Data Object">Table"</el-tab-pane>
                <el-tab-pane label="Edit Permitted">Table"</el-tab-pane>
            </el-tabs>
        </el-tab-pane>
    </el-tabs>
</template>

<style scoped>
button {
    margin-right: 1em
}

.splitpanes.default-theme .splitpanes__pane {
    background-color: transparent;
}

.default-theme /deep/ .splitpanes__splitter {
    background-color: #4c4c4c;
    width: 4px;
    border-left: 1px solid #1f1b1b;
}

.splitpanes__pane {
    padding: 5px;
}


.header {
    font-weight: bolder;
}
</style>
