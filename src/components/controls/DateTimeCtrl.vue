<script setup lang="ts">
import { computed } from "vue";
import { get } from 'lodash';

const props = defineProps({
  modelValue: { type: String, default: "" },
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

const mustLayInFuture = (time: Date) => {
  const date = new Date();
  const previousDate = date.setDate(date.getDate() - 1);
  return time.getTime() < previousDate;
}

//TODO ranges


</script>

<template>
  <div v-if="readonly" class="ar-lightgrey-background">{{ localeDate }}</div>

  <!-- TODO small -->
  <ElDatePicker v-else autosize :model-value="modelValue" :disabled-date="mustLayInFuture"
    :placeholder="get(property, 'attrs.placeholder', '')" :type="get(property, 'attrs.type', '')"
    value-format="YYYY-MM-DDTHH:mm:ss.sssZ" @update:modelValue="($event) => $emit('update:modelValue', $event)">
  </ElDatePicker>
</template>
