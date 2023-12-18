<script setup lang="ts">
defineProps({
	modelValue: { type: String, default: '' },
	property: { type: Object, default: () => ({}) },
	readonly: { type: Boolean, default: true },
})
defineEmits(['update:modelValue']);

</script>

<template>
	<div
		v-if="readonly || property.enum.length < 2"
		class="sf-readonly-wide"
	>
		{{ modelValue }}
	</div>

	<el-radio-group
		v-else-if="property.enum.length < 5"
		:model-value="modelValue"
		@update:modelValue="($event) => $emit('update:modelValue', $event)"
	>
		<el-radio
			v-for="item in property.enum"
			:key="item"
			:label="item"
			:model-value="item"
		></el-radio>
	</el-radio-group>

	<el-select
		v-else
		:model-value="modelValue"
		@update:modelValue="($event) => $emit('update:modelValue', $event)"
	>
		<el-option
			v-for="item in property.enum"
			:key="item"
			:label="item"
			:value="item"
		></el-option>
	</el-select>
</template>

<style scoped></style>
