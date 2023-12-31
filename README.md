# Vue3 Jsonschema Form/Table
A Vue3 plugin that generates Element Plus forms or tables based on a Jsonschema object. 
Use the same schema that you use for server-side validation, to generate a client-side form or table.
### Playground
Try it in our [playground](). 
Paste your favorite Json Schema and see what happens. 
### Install
```
npm i vue3-jsonschema-form --save
```
### Usage:

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
	import JsonSchemaForm from "JsonSchemaForm.vue";
</script>
```
Add jsonschema-form.css to your main.ts, or copy it and use it as inspiration.
```
import 'jsonschema-form.css'
```

### Description
**Vue3 JsonSchema Form/Table** takes a [JsonSchema draft v7](https://json-schema.org/) [JSON Schema: A Media Type for Describing JSON Documents](https://json-schema.org/draft/2020-12/json-schema-core) object and generates a form or table based on [Element Plus](https://element-plus.org/en-US/) input controls. The updated data object is returned as an update:modelValue event.

### Features
- **Four modes**: The Jsonschema form can be presented in four different modes:
	- **Readonly Dense**: Read only. Only properties with corresponding data in the data object are shown. 
	- **Readonly Full**: Read only. All properties are shown.
	- **Edit Permitted**: All properties are shown. Only properties that have corresponding property in the **Edit Permitted** object are updateable.
	- **Edit Full**: All properties are shown. All properties are updateable. Mostly used for development purposes.
- **Edit Permitted object**: Often we want to present a form as read only for most users and present the same form with certain fields updateable for users with a particular role. This can be achieved by passing a user specific Edit Permitted object which describes which properties are updateable. This object can also determin if the user is allow modify an array of subforms: e.g add, remove, reorder.
- **Listbox query callback**: Accepts a Promise function to fill listboxes. That way you can use your favorite data source to fill permitted values asysncronisly .
- **Automatic listbox - radiobuttons**: If the number of options is less the 5, radiobuttons are presented rather than a listbox. If there is only one option then that value is presented as read only.
- **Validate before save:** We apply el-form validations before returning data. Required properties have a red asterix  next to the label.
- **Info Icon:** If a description is provided then a hover-over info icon is displayed next to the label. The pop-up text accepts markdown.
- **Subforms for nested objects:** Nested object are displayed as nested subforms on a mostly transparent grey background. With each nesting level the subform backgrounds become lighter, making them easy to distinguish.
- **Array of subforms for arrays containing objects:** If the property describes an array of objects then an array of subforms is displayed. Use the '+' icon to add a new object or the '-' icon to remove one. The order of the objects in the array can be changed through drag and drop.
- **Table in Form**: Embed a table in in your form or vice versa. 
- **Row click event**: Supports row click event in tables or array of sub-forms so that they can be used for page navigation.
- **Form layout**: Supports Element Plus Form layout attributes: size, label position, label width.
- **Dark mode**: Supports light / dark mode
- **Code editor / Markdown interpreter** 

### Form/Table Attributes
| Name | Description  | Types | Accepted Values | Default |
|:----------------- | --------- | --------- | --------- | --------- |
| model-value / v-model| binding value | object | | { } |
| properties | The properties object from your Jsonschema  | object | | { } |
| required | The required array from your Jsonschema  | array | | [ ] |
| form-mode | The form mode to be used  | string | Readonly Dense / Readonly Full / Edit Permitted / Edit Full| Readonly Full |
| query-callback | A function that returns a promise to an array.  | function | |  |
| size | The required array from your Jsonschema  | string | large / default /small| default |
| label-width | Width of label, e.g. '50px'. All its direct child form items will inherit this value. auto is supported.  | string | string / number | auto |
| labelposition | Position of label. If set to 'left' or 'right', label-width prop is also required.  | string | left / right / top | right |
| colum-widths | An array of colum widths for the table or one of the sub-tables.  | array | | [ ] |
| current-row | The id of the row to be highlighted  | string | |  |
 
### Form/Table Events
| Name | Description | Parameters | 
|:----------------- | --------- | --------- |
|update:modelValue | triggers when data is updated by the user | modelValue|
|current-change | triggers when current row changes | currentRow, oldCurrentRow |
|header-dragend | triggers after a table colum is dragged | Array of table colum widths |
### Form/Table Exposes
| Name | Description | Parameters | 
|:----------------- | --------- | --------- |
|validate | Validate the whole form. Receives a callback or returns Promise. | Promise |
|clearValidate | Clear validation message for specified fields. |  |

### Compatability
Below is an overview of the properties attribute which we support. Foremost among these is the type attribute.
| Attribute<br>Type | Values | Usage |
|:-------------------| ------ | ------| 
| **type**<br>string                   | string, number, integer, boolean, object, array | Determines control component type e.g. string input, number input, sub-forms etc. | 
| **title**<br>string                  | | Used as label in forms and tables. |
| **description**<br>string | markdown | Used in info-icon tooltip. |
| **maxLength**<br>number              | | **type**: string<br>Used in string input. Limits the number of characters. |
| **minLength**<br>number              | | **type**: string<br>Used in string input. Used to generate a validation rule. |
| **minimum**<br>number                | | **type**: number<br>Used in number input. Limits minimum value. |
| **maximum**<br>number                | | **type**: number<br>Used in number input. Limits maximum value. |
| **multipleOf**<br>number             | | **type**: number<br>Used in number input. Determines number of decimal places. |
| **format**<br>string | email, uri, date, date-time |  **type**: string<br>'email, uri': Used in string input, used to generate a validation rule. <br>'date': pure date.<br>'date-time': ISO timestamp, in GMT  |              
| **pattern**<br>string | regular exspression |  **type**: string<br>Used in string input. Used to generate a validation rule. | 
| **contentMediaType**<br>string | text/markdown,<br>image/ | **type**: string<br>Used in string input. Displays code editor in edit mode.
| **displayAsTable**<br>boolean | true, false|  **type**: array<br>Display the array as table or sub-form. 
| **query**<br>object                  | | **type**: string, array<br>Non-jsonschema. The query used to fill dropdown listbox / radio buttons. |
| **properties**<br>properties object  | | **type**: object<br>Properties for nested object to be displayed as sub-form. |
| **enum**<br>string[]                 | | **type**: string<br>Array used to fill dropdown listbox / radio buttons. |
| **attrs**<br>object | | non-jsonschema |
| &nbsp;&nbsp;&nbsp;&nbsp;**placeholder**<br>&nbsp;&nbsp;&nbsp;&nbsp;string | | **type**: string, number<br>Placeholder text. |
| &nbsp;&nbsp;&nbsp;&nbsp;**type**<br>&nbsp;&nbsp;&nbsp;&nbsp;string | password, textarea| **type**: string<br>'password: hiddent input.<br>'textarea': auto grow input field.|
| &nbsp;&nbsp;&nbsp;&nbsp;**showWordLimit**<br>&nbsp;&nbsp;&nbsp;&nbsp;boolean | true, false | **type**: string **attrs.type**: textarea<br>Whether or not to show character count.|
| **items**<br>object |  | **type**: array<br>Describes the items of the array.
| &nbsp;&nbsp;&nbsp;&nbsp;**type**<br>&nbsp;&nbsp;&nbsp;&nbsp;string | object, string | **type**: array<br>|
| &nbsp;&nbsp;&nbsp;&nbsp;**query**<br>&nbsp;&nbsp;&nbsp;&nbsp;object | |  **type**: array,  **items.type**: string<br>Non-jsonschema. The query used to fill multi-select dropdown listbox / checkboxes.
| &nbsp;&nbsp;&nbsp;&nbsp;**properties**<br>&nbsp;&nbsp;&nbsp;&nbsp;properties object  | | **type**: array,  **items.type**: object<br>Properties for array item object to be displayed as sub-form. |
| **required**<br>string[] | | Array of required property names. Used in rule genneration. |
| **additionalItems**<br>boolean |  | **type**: array<br>Array of required property names. Used in rule genneration. |

### Screenshots
**Readonly Dense** mode
![[Pasted image 20231102122239.png]]

**Edit Full** mode
![[Pasted image 20231102131735.png]]
