<template>
  <el-dialog draggable title="选择人员"
             v-model="dialogVisible"
             width="1200px"
             top="5vh"
             class="xui-dialog__limit"
             append-to-body
             :close-on-click-modal="false">
    <el-row :gutter="10" class="hp">
      <el-col :span="10" class="hp">
        <el-card shadow="hover" class="hp">
          <template #header>
            <div class="clearfix">
              <span>历史记录</span>
            </div>
          </template>
          <div class="wp hp app-containerC">
            <div class="wp hp app-containerC">
              <el-table highlight-current-row 
                  ref="multipleTableHis"
                  :data="historyDataList"
                  border stripe>
                <el-table-column label="历史记录" prop="name"  align="center">
                  <template #default="scope">
                    <xui-text @click="handleSelectHistory(scope.row)">{{ '历史选择记录' + (scope.$index + 1) }}</xui-text>
                  </template>
                </el-table-column>
                <el-table-column label="选择时间" prop="time" align="center">
                </el-table-column>
                <el-table-column label="操作" fixed="right"  align="center">
                  <template #default="{row}">
                    <el-button-group>
                      <el-button type="danger" icon="Delete" @click="handleDeleteHistory(row)">
                      </el-button>
                    </el-button-group>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="14" class="hp">
        <el-card shadow="hover" class="hp">
          <template #header>
            <div class="clearfix">
              <span>字典数据列表</span>
            </div>
          </template>
          <div class="wp hp app-containerC">
            <el-table highlight-current-row 
                ref="multipleTable"
                :data="dataList" border stripe>
              <el-table-column type="selection" label="序号" align="center"></el-table-column>
              <el-table-column label="名称" prop="name" align="center">
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
          <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {defineComponent, computed, onMounted, ref, reactive, defineEmits, toRef, watch, nextTick} from "vue";
import {useFormItem} from "element-plus";
import {addDictToCache, getDictFromCache, deleteDictFromCache} from "@/sys/utils/dictHistoryCache";
import {getDictListByKey} from "@/_public/components/xui/dictionary";
import constants from "@/_public/utils/constants";

const emit = defineEmits(["select"]);

const dialogVisible = ref(false);
const dataList = ref([]);
const firstInit = ref(false);
const historyDataList = ref([]);
const multipleTable = ref([]);

const _dictKey = ref('');

const {formItem} = useFormItem();

const handleDeleteHistory = (row) => {
  deleteDictFromCache(_dictKey.value, row.id);
  let index = historyDataList.value.indexOf(row);
  if (index >= 0) {
    historyDataList.value.splice(index, 1);
  }
}

const init = (dictKey) => {
  dialogVisible.value = true;
  if (_dictKey.value !== dictKey && constants.isNotEmpty(dictKey)) {//是第一次加载
    _dictKey.value = dictKey;
    getDataList();
    historyDataList.value = getDictFromCache(_dictKey.value);
    firstInit.value = true;
  }
}

const getDataList = () => {
  dataList.value = getDictListByKey(_dictKey.value);
}


const handleSelectHistory = row => {
  //@ts-ignore
  multipleTable.value.clearSelection();
  let value = row.value;
  dataList.value.forEach(item => {
    value.forEach(subItem => {
      if (subItem === item.code) {
        //@ts-ignore
        multipleTable.value.toggleRowSelection(item, true);
      }
    })
  })
}

const handleConfirm = () => {
  //@ts-ignore
  const selectedList = multipleTable.value.getSelectionRows();
  let selectedDict = [];
  selectedList.forEach(item => {
    selectedDict.push(item.code);
  })
  if (selectedDict.length > 0) {
    addDictToCache(_dictKey.value, selectedDict);
    historyDataList.value = getDictFromCache(_dictKey.value);
  }
  emit('select', selectedDict);
  dialogVisible.value = false;
  nextTick(() => {
    formItem?.validate('change');
  })
}

defineExpose({
  init,
})
</script>

<style scoped>

</style>