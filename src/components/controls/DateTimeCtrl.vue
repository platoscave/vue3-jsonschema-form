<script setup lang="ts">
import { computed } from "vue";
import { get, has } from 'lodash';

const props = defineProps({
    modelValue: { type: String },
    property: { type: Object, default: () => ({}) },
    readonly: { type: Boolean, default: true },
});
defineEmits(['update:modelValue']);

const locale = window.navigator.userLanguage || window.navigator.language;


const localeDate = computed(() => {
    const type = get(props.property, 'attrs.type')
    let options = {}
    if (type === 'date') options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    else options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }
    const date = (new Date(props.modelValue)).toLocaleDateString(locale, options);
    return date
});

// TODO How to remove seconds: format, don't store. We dont want to interfere with local date formats
// const format = computed(() => {
//   if (has(props.property, 'attrs.format')) return get(props.property, 'attrs.format')
//   const type = get(props.property, 'attrs.type')
//   if (type === 'date') return 'YYYY-MM-DD'
//   return 'YYYY-MM-DD HH:mm'
// });

// TODO disabled date
// :disabled-date="mustLayInFuture"
// const mustLayInFuture = (time: Date) => {
//   const date = new Date();
//   const previousDate = date.setDate(date.getDate() - 1);
//   return time.getTime() < previousDate;
// }

//TODO ranges


</script>

<template>
    <div
        v-if="readonly"
        class="ar-lightgrey-background"
    >
        <div v-if="modelValue !== undefined">{{ localeDate }}</div>
    </div>

    <!-- TODO small -->
    <ElDatePicker
        v-else
        autosize
        :model-value="modelValue"
        :placeholder="get(property, 'attrs.placeholder', '')"
        :type="get(property, 'attrs.type', '')"
        value-format="YYYY-MM-DDTHH:mm:ss.sssZ"
        @update:modelValue="($event) => $emit('update:modelValue', $event)"
    >
    </ElDatePicker>
</template>
