<script setup lang="ts">
import { ref, watch, reactive, toRaw, toRefs, computed, onMounted } from "vue";

import initialFormSchemaObj from './testData/initialFormSchemaObj'
import initialFormDataObj from './testData/initialFormDataObj'
import initialFormUpdateableObj from './testData/initialFormUpdateableObj'

import { Codemirror } from 'vue-codemirror'

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

let formMode = ref("Readonly Dense")
let size = ref("Default")
let labelPosition = ref("Left")
let valid = ref(true)

let formSchemaObj:any = ref({properties:{}, required:{}})
let formDataObj = ref({data:{}})
let formUpdateableProperties = ref({data:{}})


const updatedFormDataObj = (newFormDataObj:Object) => {

}
const validateForm = () => {

};
const resetForm = () => {
    //debugger;
    formSchemaObj.value.properties = initialFormSchemaObj.properties
    formSchemaObj.value.required = initialFormSchemaObj.required
    formDataObj.value.data = initialFormDataObj.data
    formUpdateableProperties.value.data = initialFormUpdateableObj.data
};
const queryCallback = () => {

}
onMounted(() => {
    resetForm()
})
// deep watch dataObj, perform pudate
// watch(updatedFormDataObj, (newDataObj, oldDataObj) => {

//   console.log('watch dataObj', newDataObj)

//   // Get rid of false updates (otherwise we will loop)
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
// }, { deep: true });

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
    <div>
        <button @click="toggleDark()">
            <i inline-block align-middle i="dark:carbon-moon carbon-sun" />
            <span class="ml-2">{{ isDark ? 'Dark' : 'Light' }}</span>
        </button>
        <el-row>
            <el-radio-group v-model="formMode">
                <el-radio label="Readonly Dense">Readonly Dense</el-radio>
                <el-radio label="Readonly Full">Readonly Full</el-radio>
                <el-radio label="Edit Permitted">Edit Permitted</el-radio>
                <el-radio label="Edit Full">Edit Full</el-radio>
            </el-radio-group>
        </el-row>
        <el-row>
            <el-radio-group v-model="size">
                <el-radio label="Large">Large</el-radio>
                <el-radio label="Default">Default</el-radio>
                <el-radio label="Small">Small</el-radio>
            </el-radio-group>
        </el-row>
        <el-row>
            <el-radio-group v-model="labelPosition">
                <el-radio label="Left">Left</el-radio>
                <el-radio label="Right">Right</el-radio>
                <el-radio label="Top">Top</el-radio>
            </el-radio-group>
        </el-row>
        <el-row>
            <button @click="validateForm()">Validate</button>
            <button @click="resetForm()">Reset</button>
            <span>Is Valid: {{ valid }}</span>
        </el-row>
        <el-tabs>
            <el-tab-pane label="Form">
                <el-tabs>
                    <el-tab-pane label="Schema Form">
                        <!-- The form -->
                        <JsonschemaForm 
                            :model-value="formDataObj.data"
                            :properties="formSchemaObj.properties" 
                            :requiredArr="formSchemaObj.required"
                            :updateable-properties="formUpdateableProperties.data"
                            :form-mode="formMode"
                            :size="size"
                            :label-position="labelPosition"
                            :query-callback="queryCallback"
                            @update="updatedFormDataObj($event.target.value)">
                        </JsonschemaForm>
                    </el-tab-pane>
                    <el-tab-pane label="Jsonschema">
                        <el-input type="textarea" autosize :value="JSON.stringify(formSchemaObj, null, 4)"></el-input>
                    </el-tab-pane>
                    <el-tab-pane label="Data Object">
                        <el-input type="textarea" autosize :value="JSON.stringify(formDataObj.data, null, 4)"></el-input>
                    </el-tab-pane>
                    <el-tab-pane label="Updateable Properties">
                        <el-input type="textarea" autosize :value="JSON.stringify(formUpdateableProperties.data, null, 4)"></el-input>
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="Table">
                <el-tabs>
                    <el-tab-pane label="Schema Table">Form</el-tab-pane>
                    <el-tab-pane label="Jsonschema">Table"</el-tab-pane>
                    <el-tab-pane label="Data Object">Table"</el-tab-pane>
                    <el-tab-pane label="Updateable Properties">Table"</el-tab-pane>
                </el-tabs>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style scoped>
button {
    margin-right: 1em
}
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}

.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
