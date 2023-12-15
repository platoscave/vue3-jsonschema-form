# Vue3 JsonSchema Form
Use the same schema that you use for server-side validation, to generate client-side forms.
## 1 Demo

## 2 Install
```
npm i vue3-jsonschema-form --save
```
## 3 Usage:

Globally in main.ts:
```javascript
import { createApp } from "vue";
import App from "./App.vue";
import JsonSchemaForm from "./JsonSchemaForm";

const app = createApp(App);
app.use(JsonSchemaForm);
app.mount("#app");
```

...or in the script tag of your component:
```javascript
<script setup lang="ts">
	import JsonSchemaForm from "./components/JsonSchemaForm.vue";
</script>
```

## 4 Description
**Vue3 JsonSchema Form** takes a [JsonSchema draft v6](https://json-schema.org/) object and generates a a  form based on [Element Plus](https://element-plus.org/en-US/) input controls. The updated data object is returned as an update event.

### 4.1 Key features
- **Four modes**: JsonSchema Form can be presented in four different modes:
	- **Readonly Dense**: Read only. Only properties with corresponding data in the data object are shown. 
	- **Readonly Full**: Read only. All properties are shown.
	- **Edit Permitted**: All properties are shown. Only properties that have corresponding property in the **Edit Permitted** object are updateable.
	- **Edit Full**: All properties are shown. All properties are updateable. Mostly used for development purposes.
- **Edit Permitted object**: Often we want to present a form as read only for most users and present the same form with certain fields updateable for users with a particular role. This can be achieved by passing a user specific Edit Permitted object which describes which properties are updateable. This object can also determin if the user is allow modify an array of subforms: e.g add, remove, reorder.
- **Validate before save:** We apply el-form validations before returning data. Required properties have a red asterix  next to the label.
- **Info Icon:** If a description is provided then a hover-over info icon is displayed next to the label.
- **Subforms for nested objects:** Nested object are displayed in subforms on a mostly transparent grey background. With multiple nesting levels the subform backgrounds become lighter, making them easy to distinguish.
- **Array of subforms for arrays containing objects:** If the property describes an array of objects then an array of subforms is displayed. The is a '+' icon to add a new subform. Each subform has a '-' icon in order to remove it. The order of the subforms can be changed through drag and drop.
- **Listbox function parameter**: Accepts a function to fill listboxes. That way you can use your favorite query engine to fill permitted values.
- **Automatic listbox - radiobuttons**: If the number of options is less the 5,  radiobuttons are presented rather than a listbox. If there is only one option then that value is presented as read only.
- **Code editor** 

### 4.2 Screenshots
**Readonly Dense** mode
![[Pasted image 20231102122239.png]]

**Edit Full** mode
![[Pasted image 20231102131735.png]]
