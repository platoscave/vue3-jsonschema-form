<script setup lang="ts">
import formSchemaObj from './testData/formSchemaObj'
import { useDark, useToggle } from '@vueuse/core'

let isDark = useDark()
const toggleDark = useToggle(isDark)
let mode = "Readonly Dense"
let activeName = ""
let valid = true
</script>

<template>
  <div>
    <el-row>
      <el-switch size="small" class="ar-left-align" v-model="isDark" @click="toggleDark()" active-text="Dark"
        inactive-text="Light"></el-switch>
    </el-row>
    <el-row>
      <el-radio-group v-model="mode">
        <el-radio label="Readonly Dense">Readonly Dense</el-radio>
        <el-radio label="Readonly Full">Readonly Full</el-radio>
        <el-radio label="Edit Permitted">Edit Permitted</el-radio>
        <el-radio label="Edit Full">Edit Full</el-radio>
      </el-radio-group>
    </el-row>
    <el-row>
      <button type="primary" plain @click="validateForm()">Validate</button>
      <button type="primary" plain @click="resetForm()">Reset</button>
    </el-row>
    <el-row>
      <div>Is Valid: {{ valid }}</div>
    </el-row>
    <el-tabs>
      <el-tab-pane label="Form">
        <el-tabs>
          <el-tab-pane label="Schema Form">Form</el-tab-pane>
          <el-tab-pane label="Jsonschema">Table"</el-tab-pane>
          <el-tab-pane label="Data Object">Table"</el-tab-pane>
          <el-tab-pane label="Updateable Properties">Table"</el-tab-pane>
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


    <hr />
    <!-- Form header with tooltip -->
    <h3 v-if="formSchemaObj.title && formSchemaObj.description">
      <span>{{ formSchemaObj.title + " " }}</span>
      <el-tooltip :content="formSchemaObj.description">
        <i class="el-icon-info"></i>
      </el-tooltip>
    </h3>
    <h3 v-else-if="formSchemaObj.title"></h3>

    <!-- The form -->
    <jsonschema-form ref="schemaForm" class="json-schema-form" v-model="dataObj" :properties="formSchemaObj.properties"
      :requiredArr="formSchemaObj.required" :form-read-only="readonly" :omit-empty-fields="omitEmptyFields"
      :hash-level="0" v-on:change="onChange">
      <!-- 
      @:input="value => alert(value)"

     -->
    </jsonschema-form>
    <hr />

    <h4>dataObj</h4>
    <highlight-code lang="json" class="highlight-code">{{
      dataObj
    }}</highlight-code>

    <h4>Schema</h4>
    <highlight-code lang="json" class="highlight-code">{{
      schema
    }}</highlight-code>
  </div>
</template>

<style scoped>
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
