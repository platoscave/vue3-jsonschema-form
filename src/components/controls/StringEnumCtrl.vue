<script setup lang="ts">
import type { IProperty } from '../../models/property'

export interface IProps {
	modelValue?: string
	property?: IProperty
	readonly?: boolean
}
withDefaults(defineProps<IProps>(), {
	modelValue: '',
	property: () => ({}),
	readonly: true
})
const emit = defineEmits<{
	(e: 'update:modelValue', modelValue: string): void
}>()


</script>

<template>
	<div>
		<div
			v-if="readonly || (property.enum && property.enum.length < 2)"
			class="sf-readonly-wide"
		>
			{{ modelValue }}
		</div>

		<el-radio-group
			v-else-if="(property.enum && property.enum.length < 5)"
			:model-value="modelValue"
			@update:modelValue="($event: any) => $emit('update:modelValue', $event)"
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
	</div>
</template>

<style scoped></style>
