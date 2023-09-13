<template>
  <el-dialog draggable top="5vh" :close-on-click-modal="false" title="图标选择" v-model="dialogVisible"
             width="900px"
             class="xui-dialog__limit" append-to-body>
    <div class="xui-iconSelect">
      <div class="xui-iconSelect__item" v-for="(item,index) in iconList" :key="index" @click="handleSelect(item)">
        <div class="xui-iconSelect__icon">
          <el-icon :size="30">
            <component
                :is="item"/>
          </el-icon>
        </div>
        <div class="xui-iconSelect__text">
          {{item}}
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {defineComponent, computed, onMounted, ref, reactive, defineEmits, defineExpose, nextTick} from "vue";
import * as Icons from "@element-plus/icons-vue";
import {useFormItem} from "element-plus";

const emit = defineEmits(["select"]);
const dialogVisible = ref(false);
const iconList = ref([]);
Object.keys(Icons).forEach((it) => {
  iconList.value.push(it);
});

const init = () => {
  dialogVisible.value = true;
}

const {form, formItem} = useFormItem();

const handleSelect = (item) => {
  emit('select', item)
  nextTick(() => {
    formItem?.validate('blur');
  })
  dialogVisible.value = false;
}


defineExpose({
  init,
})
</script>

<style scoped>

</style>