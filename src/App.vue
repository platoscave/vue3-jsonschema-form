<script setup lang="ts">
import { ref, watch, } from "vue";
//@ts-expect-error
import initialFormSchemaObj from './testData/initialFormSchemaObj'
//@ts-expect-error
import initialTableSchemaObj from './testData/initialTableSchemaObj'
//@ts-expect-error
import initialFormDataObj from './testData/initialFormDataObj'
//@ts-expect-error
import initialTableDataObj from './testData/initialTableDataObj'
//@ts-expect-error
import initialEditPermittedObj from './testData/initialEditPermittedObj'
//@ts-expect-error
import initialFormQueryData from './testData/formQueryData'

import JsonschemaTable from './components/JsonschemaTable.vue'
import StringCodeEditorCtrl from './components/controls/StringCodeEditorCtrl.vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { useDark, useToggle } from '@vueuse/core'

let isDark = useDark()
const toggleDark = useToggle(isDark)

let formModeRef = ref<("Readonly Full" | "Readonly Dense" | "Edit Permitted" | "Edit Full")>("Edit Full")
let sizeRef = ref("default")
let labelPositionRef = ref<("left" | "top" | "right")>("left")
let labelWidtthRef = ref("auto")
let validRef = ref(true)
let columWidthsRef = ref([])

let formSchemaObjRef = ref(initialFormSchemaObj)
let tableSchemaObjRef = ref(initialTableSchemaObj)
let formDataObjRef = ref(initialFormDataObj)
let tableDataObjRef = ref(initialTableDataObj)
let formEditPermittedRef = ref(initialEditPermittedObj)
let formQueryDataRef = ref(initialFormQueryData)


const validateForm = () => {
};
const resetForm = () => {
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
        console.log('Invalid JSON' + err.message)
    }
}


// deep watch dataObj, perform pudate
watch(formDataObjRef, (newDataObj) => {
    console.log('Formm dataObj', newDataObj)
}, { deep: true });

watch(tableDataObjRef, (newDataObj) => {
    console.log('Table dataObj', newDataObj)
}, { deep: true });


</script>

<template>
    <h2 class="header">Vue3 Jsonschema Form/Table</h2>

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
            @input="($event: any) => labelWidtthRef = $event.target.value"
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
                <pane size="25">
                    <div class="header">Jsonschema </div>
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
                        :edit-permitted="formEditPermittedRef"
                        :form-mode="formModeRef"
                        :sizeRef="sizeRef"
                        :label-position="labelPositionRef"
                        :label-width="labelWidtthRef"
                        :query-callback="queryCallback"
                        :colum-widths="columWidthsRef"
                        @current-change="($event: any) => $emit('current-change', $event)"
                        @header-dragend="($event: any) => $emit('header-dragend', $event)"
                    >
                    </JsonschemaForm>
                </pane>
                <pane size="25">
                    <div class="header">Data </div>
                    <StringCodeEditorCtrl
                        :model-value="JSON.stringify(formDataObjRef, null, 2)"
                        :readonly=false
                        @update:modelValue="($event) => copyToRef($event, formDataObjRef)"
                    ></StringCodeEditorCtrl>
                    <div class="header">Edit Permitted </div>
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
            <h2>Jsonschema Table</h2>
            <!-- The form -->
            <JsonschemaTable
                v-model="tableDataObjRef"
                :properties="tableSchemaObjRef.properties"
                :required-arr="tableSchemaObjRef.required"
                :edit-permitted="formEditPermittedRef"
                :form-mode="formModeRef"
                :sizeRef="sizeRef"
                :label-position="labelPositionRef"
                :label-width="labelWidtthRef"
                :query-callback="queryCallback"
                :colum-widths="columWidthsRef"
                @current-change="($event) => $emit('current-change', $event)"
                @header-dragend="($event) => $emit('header-dragend', $event)"
            >
            </JsonschemaTable>

            <splitpanes
                vertical
                class="default-theme"
            >
                <pane size="30">
                    <div class="header">Jsonschema </div>
                    <StringCodeEditorCtrl
                        :model-value="JSON.stringify(tableSchemaObjRef, null, 2)"
                        :readonly=false
                        @update:modelValue="($event) => copyToRef($event, tableSchemaObjRef)"
                    ></StringCodeEditorCtrl>
                </pane>
                <pane>
                    <div class="header">Data </div>
                    <StringCodeEditorCtrl
                        :model-value="JSON.stringify(tableDataObjRef, null, 2)"
                        :readonly=false
                        @update:modelValue="($event) => copyToRef($event, tableDataObjRef)"
                    ></StringCodeEditorCtrl>
                </pane>
                <pane size="30">

                    <div class="header">Edit Permitted </div>
                    <!-- <div>Only aplicable in "Edit Permitted" Form Mode</div> -->
                    <StringCodeEditorCtrl
                        :model-value="JSON.stringify(formEditPermittedRef, null, 2)"
                        :readonly=false
                        @update:modelValue="($event) => copyToRef($event, formEditPermittedRef)"
                    ></StringCodeEditorCtrl>
                </pane>
            </splitpanes>
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
