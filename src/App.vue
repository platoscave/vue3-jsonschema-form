<script setup lang="ts">
import { ref, watch, reactive, toRaw, toRefs, computed, onMounted } from "vue";

import initialFormSchemaObj from './testData/initialFormSchemaObj'
import initialFormDataObj from './testData/initialFormDataObj'
import initialEditPermittedObj from './testData/initialEditPermittedObj'
import initialFormQueryData from './testData/formQueryData'

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

let formMode = ref("Edit Full")
let size = ref("default")
let labelPosition = ref("left")
let labelWidth = ref("auto")
let valid = ref(true)

let formSchemaObj = { properties: {}, required: [] }
let formDataObj = ref(initialFormDataObj)
let formEditPermitted = ref(initialEditPermittedObj)
let formQueryData = ref(initialFormQueryData)


// const updatedFormDataObj = (newFormDataObj: {}) => {
//     // validate
//     // copy
//     //formDataObj.value = newFormDataObj
// }
const validateForm = () => {

};
const resetForm = () => {
    //formDataObj.value = initialFormDataObj

    formSchemaObj = initialFormSchemaObj
    formEditPermitted = initialEditPermittedObj
};
const queryCallback = (query: any) => {

    let data = formQueryData.value
    if (query.select === 'small') data = formQueryData.value.slice(0, 3)
    debugger
    return new Promise(function (resolve, reject) {
        setTimeout(() => resolve(data), 2000);
    });
}


onMounted(() => {
    resetForm()
})
// deep watch dataObj, perform pudate
watch(formDataObj, (newDataObj, oldDataObj) => {

    console.log('App dataObj', newDataObj)

    // Get rid of false updates (otherwise we will loop)
    //   if (previousDataObj === JSON.stringify(newDataObj)) return;
    //   previousDataObj = JSON.stringify(newDataObj)

    //   if (!formMode.value.startsWith("Edit")) return;
    //   if (!oldDataObj) return; // will be empty first time
    //   subFormEl.value.validate().then((valid) => {
    //     console.log("valid", valid);
    //     if (valid) {
    //       db.state.put(toRaw(newDataObj)).catch(function (e) {
    //         alert("Failed update: " + e);
    //       })
    //     }
    //   });
}, { deep: true });

// const highlightedCode = computed(() => {
//   if (props.modelValue) {
//     const res = hljs.highlightAuto(
//       JSON.stringify(props.modelValue, null, 2)
//     );
//     return toHtml(res);
//   }
//   return "";
// });
</script>

<template>
    <div class="header">Vue3 Jsonschema Form/Table</div>

    <button @click="toggleDark()">
        <i inline-block align-middle i="dark:carbon-moon carbon-sun" />
        <span class="ml-2">{{ isDark ? 'Dark' : 'Light' }}</span>
    </button>
    <div>
        <el-radio-group v-model="formMode">
            <el-radio label="Readonly Dense">Readonly Dense</el-radio>
            <el-radio label="Readonly Full">Readonly Full</el-radio>
            <el-radio label="Edit Permitted">Edit Permitted</el-radio>
            <el-radio label="Edit Full">Edit Full</el-radio>
        </el-radio-group>
    </div>
    <div>
        <el-radio-group v-model="size">
            <el-radio label="large">large</el-radio>
            <el-radio label="default">default</el-radio>
            <el-radio label="small">small</el-radio>
        </el-radio-group>
    </div>
    <div>
        <el-radio-group v-model="labelPosition">
            <el-radio label="left">left</el-radio>
            <el-radio label="right">right</el-radio>
            <el-radio label="top">top</el-radio>
        </el-radio-group>
    </div>
    <div>
        <el-input v-model="labelWidth" style="width:200px;" placeholder="Label width: e.g. 100 or auto"
            @input="labelWidth = $event.target.value" size="small"></el-input>
    </div>
    <div>
        <button @click="validateForm()">Validate</button>
        <button @click="resetForm()">Reset</button>
        <span>Is Valid: {{ valid }}</span>
    </div>
    <el-tabs>
        <el-tab-pane label="Form">
            <splitpanes vertical class="default-theme">
                <pane size="25">
                    <div class="header">Jsonschema Object</div>
                    <el-input type="textarea" autosize :value="JSON.stringify(formSchemaObj, null, 2)"></el-input>
                </pane>
                <pane>
                    <div class="header">Jsonschema Form</div>
                    <!-- The form -->
                    <JsonschemaForm v-model="formDataObj" :properties="formSchemaObj.properties"
                        :required-arr="formSchemaObj.required" :updateable-properties="formEditPermitted"
                        :form-mode="formMode" :size="size" :label-position="labelPosition" :label-width="labelWidth"
                        :query-callback="queryCallback">
                    </JsonschemaForm>
                </pane>
                <pane size="25">
                    <splitpanes horizontal>
                        <pane>
                            <div class="header">Data Object</div>
                            <el-input type="textarea" autosize :value="JSON.stringify(formDataObj, null, 4)"></el-input>
                        </pane>
                        <pane size="20">
                            <div class="header">Edit Permitted Object</div>
                            <!-- <div>Only aplicable in "Edit Permitted" Form Mode</div> -->
                            <el-input type="textarea" autosize
                                :value="JSON.stringify(formEditPermitted, null, 4)"></el-input>
                        </pane>
                    </splitpanes>
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
