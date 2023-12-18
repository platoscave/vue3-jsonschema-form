<script setup lang="ts">
import { ref, watch, reactive, toRaw, toRefs, computed, onMounted } from "vue";
import * as CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/gfm/gfm.js'
import 'codemirror/mode/css/css.js'
// https://discuss.codemirror.net/t/module-not-found-error/5510/8
// FIrstly, run - npm config set legacy-peer-deps true
// then try to run - npm i codemirror @version5

const props = defineProps({
    modelValue: { type: String, default: "let a = 10" },
    property: { type: Object, default: () => ({}) },
    readonly: { type: Boolean, default: true },
});

const emit = defineEmits(["update:modelValue"]);


const getMode = (mediaType: string) => {
    if (!mediaType) return 'javascript'
    const mediaTypeArr = mediaType.split('/')
    const simpleMime = mediaTypeArr[1].replace("x-", "");
    switch (simpleMime) {
        case 'markdown': return 'gfm'
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

onMounted(() => {
    CodeMirror.fromTextArea(document.getElementById('editor'), {
        theme: 'dracula',
        mode: getMode(props.property.contentMediaType),
        readOnly: props.readonly

    })
})

</script>

<template>
    <textarea
        id="editor"
        :value="modelValue"
        @input="($event) => $emit('update:modelValue', $event)"
    >
    </textarea>
</template>
