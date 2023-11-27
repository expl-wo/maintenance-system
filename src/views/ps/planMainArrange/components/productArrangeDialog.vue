<template>
  <el-dialog draggable :close-on-click-modal="false" title="计划编制"
             v-model="dialogVisible" class="roleDialog">
    <el-form ref="formRef" label-width="120px" :model="model">
      <el-row>
        <el-col :span="12">
          <el-form-item label="生产号:" prop="productNo">
            <el-input v-model="model.productNo" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工序:" prop="gx">
            <xui-dict-select item-code="yn" class="width100Percent" v-model="model.gx"></xui-dict-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveData">保 存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {defineComponent, computed, onMounted, ref, reactive, defineEmits, toRef, watch, nextTick} from "vue";
import {deepClone} from "@/utils";

const emits = defineEmits(["handleRefresh"])

const dialogVisible = ref(false);
const initModel = {
  productNo: '',
  gx: 'y'
}
const model = reactive(deepClone(initModel));

const init = row => {
  let data = {
    ...initModel,
  }
  data.productNo = row.productNo;
  Object.assign(model, data);
  dialogVisible.value = true;
}

const saveData = () => {
  emits("handleRefresh", model);
  dialogVisible.value = false;
}

defineExpose({
  init
})

</script>

<style scoped lang="scss">

</style>
