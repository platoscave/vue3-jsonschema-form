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

const props = defineProps({
    modelValue: { type: String, default: "let a = 10" },
    property: { type: Object, default: () => ({}) },
    readonly: { type: Boolean, default: true },
});

const emits = defineEmits(["update:modelValue"]);
const editorRef: any = ref(null);

const getMode = (mediaType: string) => {
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

let codeMirror: any = null
watch(() => props.modelValue, (value) => {

    if (codeMirror) {
        codeMirror.setValue(value)
        setTimeout(function () {
            //codeMirror.inputEditor.save()
        }, 1)
    }
});
onMounted(() => {
    codeMirror = CodeMirror.fromTextArea(editorRef.value, {
        theme: 'dracula',
        mode: getMode(props.property.contentMediaType),
        readOnly: props.readonly,
        //beautify: { initialBeautify: true, autoBeautify: true },
        // autofocus: true
        //matchBrackets: true
    })
    codeMirror.save()
    codeMirror.on('change', (codeMirror: any) => emits('update:modelValue', codeMirror.getValue()));
})


</script>

<template>
    <textarea
        ref="editorRef"
        :value="modelValue"
    >
    </textarea>
</template>
