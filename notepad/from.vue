<template>
  <el-form
    :inline="true"
    :model="localModelValue"
    label-position="right"
    :label-width="formConfig.labelWidth"
    size="small"
  >
    <slot name="formItem" />
    <el-form-item
      v-for="(item, ind) in formConfig.list"
      v-show="item.isShow === false ? item.isShow : true"
      :key="ind + ' '"
      :label="item.label"
      :prop="item.prop"
    >
      <el-input
        v-if="item.type=='input'"
        v-model.trim="localModelValue[item.prop]"
        :disabled="item.disabled"
        :placeholder="item.placeholder"
        :clearable="item.clearable === false ? false : true"
        :style="item.style"
        size="small"
        @change="item.change"
      />

      <el-input-number
        v-if="item.type=='inputNumber'"
        v-model="localModelValue[item.prop]"
        :controls='item.controls || false'
        :precision='item.precision'
        :min='item.min'
        :max='item.max'
        :disabled="item.disabled"
        :placeholder="item.placeholder"
        :clearable="item.clearable === false ? false : true"
        :style="item.style"
        size="small"
        @change="item.change"
      />

      <el-select
        v-else-if="item.type=='select'"
        v-model="localModelValue[item.prop]"
        :disabled="item.disabled"
        :clearable="item.clearable === false ? false : true"
        :placeholder="item.placeholder"
        :style="item.style"
        size="small"
        @change="item.change"
      >
        <el-option
          v-for="(optItem, index) in item.list"
          :key="index"
          :label="optItem.label"
          :value="optItem.value"
        />
      </el-select>
      <el-radio-group
        v-else-if="item.type=='radio'"
        v-model="localModelValue[item.prop]"
        :disabled="item.disabled"
        :style="item.style"
        size="small"
        @change="item.change"
      >
        <el-radio
          v-for="(radio, lis) in item.list"
          :key="lis"
          :label="radio.value"
        >{{ radio.name }}</el-radio>
      </el-radio-group>
      <el-cascader
        v-else-if="item.type=='cascader'"
        v-model="localModelValue[item.prop]"
        :options="item.options"
        :style="item.style"
        size="small"
        @change="item.change"
      />
      <el-date-picker
        v-else-if="item.type=='year' || item.type=='month' || item.type=='date' || item.type=='datetime' || item.type=='week' || item.type=='datetimerange' || item.type=='daterange'"
        v-model="localModelValue[item.prop]"
        :value-format="item.dateFormat"
        :type="item.type"
        :disabled="item.disabled"
        :clearable="item.clearable === false ? false : true"
        :placeholder="item.label"
        :style="item.style"
        :editable="false"
        size="small"
        @change="item.change"
      />
    </el-form-item>
    <el-form-item v-for="(item, index) in formConfig.btns" v-show="item.isShow === false ? item.isShow : true" :key="index">
      <el-button
        :size="item.size || 'small'"
        :type="item.type || 'primary'"
        :icon="item.icon || ''"
        :disabled="item.disabled"
        @click="item.handleClick(localModelValue)"
      >{{ item.name || '查询' }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  formConfig: {
    type: Object,
    required: true
  },
  modelValue: {
    type: Object,
    required: true
  }
})
const emits = defineEmits(['update:modelValue'])
const localModelValue = computed({
  get: () => props.modelValue,
  set: val => {
    emits('update:modelValue', val)
  }
})
</script>
<style lang="scss" scoped>
:deep(){
  .el-form-item{
    align-items: center !important;
  }
  // .el-date-editor.el-input, .el-date-editor.el-input__wrapper{
  //   height: 26px;
  // }
  // .el-range-editor--small.el-input__wrapper{
  //   height: 32px;
  // }
}

</style>
