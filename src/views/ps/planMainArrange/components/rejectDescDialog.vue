<template>
  <el-dialog draggable :close-on-click-modal="false" title="驳回原因" v-model="dialogVisible" width="600px"
             class="roleDialog">
    <el-form :model="model" ref="formRef" :rules="rules" label-width="140px">
      <el-form-item prop="rejectReason" label="驳回原因：">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" v-model="model.rejectReason"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {defineComponent, computed, onMounted, ref, reactive, defineEmits, toRef, watch, nextTick} from "vue";

const emits = defineEmits(['submit'])
const formRef = ref();
const rules = reactive({
  rejectReason: [{required: true, trigger: 'blur', message: '驳回原因不能为空'}],
})

const planId = ref([]);
const model = reactive({
  rejectReason: ''
})
const dialogVisible = ref(false);

const saveData = () => {
  formRef.value.validate(valid => {
    if (!valid) {
      return;
    }
    emits('submit', model.rejectReason, planId.value);
    dialogVisible.value = false;
  })
}

const init = (planIdArr) => {
  planId.value = planIdArr;
  model.rejectReason = '';
  dialogVisible.value = true;

}
defineExpose({
  init
})


</script>

<style scoped lang="scss">

</style>
