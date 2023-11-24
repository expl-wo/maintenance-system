<template>
  <el-dialog
    title="模板详情"
    width="40%"
    :model-value="visible"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="handleClose"
  >
    <el-form label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item  label="模板名称" prop="templateName" >
            <div>{{ templateName }}</div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="table-wrapper">
      <el-table
        :data="tableData"
        
        border
      >
        <el-table-column
          v-for="item in columns"
          :type="item.type"
          :key="item.key"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :column-key="item.columnKey"
        >
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
       <span class="dialog-footer">
      <el-button  type="primary" @click="handleClose">确 定</el-button>
    </span>
    </template> 
  </el-dialog>
</template>
<script>

const columns = [
  { label: '序号', width: '80', type: 'index' },
  { prop: 'deviceModelName', label: '设备类型' },
  { prop: 'deviceNumber', label: '设备编码' },
  { prop: 'deviceName', label: '设备名称' }
];
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      columns: Object.freeze(columns),
      templateName: '',
      tableData: [],
    }
  },
  watch: {
    visible(newVal) {
      if(newVal && this.info) {
        let { templateName, list } = this.info;
        this.templateName = templateName;
        this.tableData = list || [];
      }
    }
  },
  methods: {
    // 关闭
    handleClose() {
      this.$emit('closeModal', 'preview', false);
    },
  }
}
</script>
<style lang="scss" scoped>
.table-wrapper {
  height: 500px;
}
::v-deep(.el-table) {
  overflow: auto;
  width: 100%;
  height: 100%;
}
::v-deep(.el-table__header-wrapper) {
  position: sticky;
  top: 0;
  z-index: 10;
}
::v-deep(.el-table__body-wrapper) {
  height: calc(100% - 41px);
  width: 100%;
  overflow-y: auto;
}
</style>