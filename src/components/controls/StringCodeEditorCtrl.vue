<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
// https://discuss.codemirror.net/t/module-not-found-error/5510/8
// FIrstly, run - npm config set legacy-peer-deps true
// then try to run - npm i codemirror @version5
import * as CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/gfm/gfm.js'
import 'codemirror/mode/css/css.js'
import type { IProperty } from '../../models/property'

export interface IProps {
    modelValue?: string
    property?: IProperty
    readonly?: boolean
}
const props = withDefaults(defineProps<IProps>(), {
    modelValue: '',
    property: () => ({}),
    readonly: true
})
const emit = defineEmits<{
    (e: 'update:modelValue', modelValue: string): void
}>()

const editorRef: any = ref(null)
let codeMirror: any = null

const getMode = () => {
    const mediaType = props.property.contentMediaType
    if (!mediaType) return 'javascript'
    const mediaTypeArr = mediaType.split('/')
    const simpleMime = mediaTypeArr[1].replace("x-", "");
    switch (simpleMime) {
        case 'markdown': return 'gfm'
        case 'svg': return 'xml'
        case 'xml': return 'xml'
        case 'html': return 'xml'
        case 'javascript': return 'javascript'
        case 'ecmascript': return 'javascript'
        case 'json': return 'javascript'
        case 'typescript': return 'javascript'
        case 'schema+json': return 'javascript'

        case 'csrc (C)': return 'c-like'
        case 'c++src (C++)': return 'c-like'
        case 'csharp (C#)': return 'c-like'
        case 'objectivec (Objective-C)': return 'c-like'
        case 'vertex': return 'c-like'
        case 'fragment (shader programs)': return 'c-like'

        default: return 'javascript'
    }
}


watch(() => props.modelValue, (value) => {
    if (codeMirror) codeMirror.setValue(value)
});

onMounted(() => {
    codeMirror = CodeMirror.fromTextArea(editorRef.value, {
        theme: 'dracula',
        mode: getMode(),
        readOnly: props.readonly ? 'nocursor' : false,
        //beautify: { initialBeautify: true, autoBeautify: true },
    })

    // change event, emit update
    codeMirror.on('blur', (codeMirror: any) => emit('update:modelValue', codeMirror.getValue()));

    // Force refresh after delay (top of event que). Otherwise it'll be empty until you click on it.
    setTimeout(() => codeMirror.refresh())
})


</script>

<template>
    <!-- readonly is used to omit boarder on readonly mode -->
    <textarea
        ref="editorRef"
        :value="modelValue"
        readonly
    >
    </textarea>
</template>
