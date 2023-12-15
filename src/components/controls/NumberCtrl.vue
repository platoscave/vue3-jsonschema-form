<script setup lang="ts">
import { computed } from "vue";
const props = defineProps({
  modelValue: { type: Number },
  property: { type: Object, default: () => ({}) },
  readonly: { type: Boolean, default: true },
});
defineEmits(['update:modelValue']);

const precision = computed(() => {
  if (props.property.type === "number") {
    if (props.property.multipleOf) {
      // use the exponent of multipleOf to determin precision
      let exp = String(props.property.multipleOf.toExponential());
      let expNumber = Number(exp.substr(exp.lastIndexOf("e") + 1));
      return Math.abs(expNumber); // must be positive int
    }
  }
  // integer
  return 0;
});

</script>

<template>
  <div v-if="readonly" class="ar-number-div">
    <div v-if="modelValue !== undefined">{{ Number.parseFloat(modelValue.toString()).toFixed(precision) }}</div>
  </div>
  <el-input-number v-else :value="modelValue" :min="property.minimum" :max="property.maximum" :precision="precision"
    :controls=false @input="($event) => $emit('update:modelValue', $event)">
  </el-input-number>
</template>

<style scoped>
/* Readonly div */
.ar-number-div {
  background-color: #ffffff08;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 4px;
  border-style: none;
  font-size: 16px;
  line-height: 24px;
  min-height: 24px;
  width: 200px;
  text-align: right;
}

.el-input-number {
  width: 220px;
}

.el-input-number /deep/ .el-input__inner {
  text-align: right;
}
</style>
