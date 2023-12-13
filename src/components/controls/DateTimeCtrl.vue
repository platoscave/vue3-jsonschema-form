<script setup lang="ts">
import { computed } from "vue";
const props = defineProps({
  modelValue: { type: String, default: "" },
  property: { type: Object, default: () => ({}) },
  readonly: { type: Boolean, default: true },
});
defineEmits(['update:modelValue']);

const locale = window.navigator.userLanguage || window.navigator.language;


const localeDate = computed(() => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const date = (new Date(props.modelValue)).toLocaleDateString(locale, options);
  return date
});

const mustLayInFuture = (time: Date) => {
  return time.getTime() < Date.now()
}

//TODO ranges

</script>

<template>
  <div v-if="readonly" class="ar-lightgrey-background">
    {{ localeDate }}
  </div>
  <!-- TODO small -->
  <ElDatePicker v-else autosize model-value="modelValue" :disabled-date="mustLayInFuture" @update:modelValue="($event) => {
    console.log('AAA', $event)
    $emit('update:modelValue', $event)
  }
    "></ElDatePicker>
</template>
