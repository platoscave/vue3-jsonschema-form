<script setup lang="ts">
import { computed } from "vue";
import { get } from 'lodash';
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

// @ts-expect-error
const locale = window.navigator.userLanguage || window.navigator.language;
//const locale = 'en-US';
const localeDate = computed(() => {
    const format = props.property.format
    let options: any = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }
    if (format === 'date') options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    return (new Date(props.modelValue)).toLocaleDateString(locale, options);
});

const emitModelValue = (dateObj: Date) => {
    let utcStr = ''
    if (dateObj) {
        utcStr = dateObj.toISOString()
        const format = props.property.format
        // In the case of pure date, remove time / time zone
        if (format === 'date') utcStr = utcStr.substring(0, 10);
    }
    emit('update:modelValue', utcStr)
}

// TODO disabled date
// :disabled-date="mustLayInFuture"
// const mustLayInFuture = (time: Date) => {
//   const date = new Date();
//   const previousDate = date.setDate(date.getDate() - 1);
//   return time.getTime() < previousDate;
// }

// TODO ranges
//      : value - format="property.format === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm:ss.sssZ'"
//

</script>

<template>
    <div
        v-if="readonly"
        class="sf-readonly-wide"
    >
        <div v-if="modelValue !== undefined">{{ localeDate }}</div>
    </div>

    <ElDatePicker
        v-else
        autosize
        :model-value="modelValue"
        :placeholder="get(property, 'attrs.placeholder', '')"
        :format="get(property, 'attrs.format')"
        :type="property.format === 'date' ? 'date' : 'datetime'"
        @update:modelValue="emitModelValue"
    >
    </ElDatePicker>
</template>
