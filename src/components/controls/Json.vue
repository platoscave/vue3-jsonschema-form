<script setup lang="ts">
import { ref, computed } from "vue";
//import { lowlight } from "lowlight/lib/core.js";
//import { toHtml } from "hast-util-to-html";
// Using ES6 import syntax
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

// Then register the languages you need
hljs.registerLanguage('javascript', javascript);

const props = defineProps({
  hashLevel: { type: Number, default: 0 },
  modelValue: { type: Object, default: {} },
  property: { type: Object, default: {} },
  readonly: { type: Boolean, default: true },
});

const highlightedCode = computed(() => {
  if (props.modelValue) {
    const res = hljs.highlightAuto(
      JSON.stringify(props.modelValue, null, 2)
    );
    return toHtml(res);
  }
  return "";
});
</script>

<template>
  <div v-if="readonly" class="ar-lightgrey-background">
    <code>
        <pre v-html="highlightedCode" />
      </code>
  </div>
  <div v-else>
    <el-input type="textarea" autosize :value="JSON.stringify(modelValue, null, 2)"
      @input="$emit('update:modelValue', $event)"></el-input>
  </div>
</template>
