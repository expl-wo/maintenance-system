<template>
  <div class="app-container app-containerC">

    <div class="otherCon wp">
      <el-table stripe  highlight-current-row 
        :id="tableId"
        ref="tableCheckAllRef"
        v-loading="vloading"
        :height="heightTable"
        border
        :data="data"
        style="font-size: 0.7rem"
        @selection-change="handleSelectionChange"
        @row-click="handleClick"
        @row-dblclick="handleDblclick"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          v-for="(col, index) in rowHeader"
          :key="index"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :align="col.align"
          :fixed="col.fixed"
          :type="col.type || ''"
          :selectable="selectable"
        >
          <template  #default="params">
            <div v-if="col.render !=null">
<!--              {{params.row}}-->
              <ex-slot  :render="col.render" :row="params.row" :index="params.$index" :column="col" />
            </div>

            <span v-else>
              <span v-if="col.prop === 'index'">{{ params.$index+1 }}</span>
              <span v-else-if="col.prop === 'check'">
                <span v-if="showCheckFun(params.row)">
                  <el-checkbox
                    :value="params.row.id"
                    :label="params.row.id"
                    :disabled="params.row.selectable === 0"
                    style="margin-left: 8px;"
                    @change="checkboxClick($event, params.row)"
                  >&nbsp;</el-checkbox>
                </span>
              </span>
              <span v-else-if="col.prop === 'upload'">
<!--                <el-button  size="small" type="primary" class="el-icon-upload" />-->
                <input name="file" type="file"  :accept="acceptFormat" @change="changeUploadFile($event, params.row)">
              </span>
              <span v-else> {{ params.row[col.prop] }}</span>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination :total="total" :page="page" :limit="limit" :hide-page="hidePage" class="searchCon wp" @pagination="getList" />

  </div>
</template>

<script>
import { h } from 'vue'
import Pagination from '../Pagination/index'
// 自定义内容的组件
const exSlot = {
  functional: true,
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null
    },
    fixed: {
      type: String,
      default: ''
    }
  }
  ,
  render: (hs, data) => {
    const params = {
      row: hs.row,
      index: hs.index
    }
    if (data.column) params.column = data.column
    return hs.render(h,params)
  }
}

export default {
  name: 'TableCheckAll',
  components: {
    'ex-slot': exSlot,
    Pagination
  },
  props: {
    vloading: {
      type: Boolean,
      default: false
    },
    // 表格数据
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 表头数据
    rowHeader: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 分页总条数
    total: {
      required: true,
      type: Number
    },
    // 分页当前页
    page: {
      type: Number,
      default: 1
    },
    // 分页每页个数
    limit: {
      type: Number,
      default: 20
    },
    heightTable: {
      type: String,
      default: '100%'
    },
    // 控制分页显示隐藏
    hidePage: {
      type: Boolean,
      default: false
    },
    // 上传格式
    acceptFormat: {
      type: String,
      default: ''
    },
    showCheckFun: {
      type: Function,
      default: function(val) {
        return true
      }
    },
    checkAllFun: {
      type: Function,
      default: function(val) {
        console.log(' TableCheckAll 组件默认的.. checkAllFun ')
      }
    },
    checkboxChange: {
      type: Function,
      default: function(event, item) {
        console.log(' TableCheckAll 组件默认的.. checkboxChange ')
      }
    },
    tableId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      checkIds: []
    }
  },
  beforeUpdate() {
    this.$nextTick(() => {
      this.$refs.tableCheckAllRef.doLayout()
      this.checkIds = []
    })
  },
  methods: {
    getList(val) {
      this.$emit('pagination', { page: val.page, limit: val.limit })
    },
    handleClick(val) {
      this.$emit('handleClick', { item: val })
    },
    handleDblclick(val) {
      this.$emit('handleDblclick', { item: val })
    },
    handleSelectionChange(val) {
      if (val && val.length > 0) {
        val.forEach(rd => {
          this.checkIds.push(rd.id)
        })
      } else {
        this.checkIds = []
      }
      this.checkAllFun(val)
    },
    // 选择
    checkboxClick(event, item) {
      this.checkboxChange(event, item)
    },
    // 上传
    changeUploadFile(e, row) {
      this.$emit('changeUploadFile', { e: e, row: row })
    },
    //背景
    tableRowClassName({ row, rowIndex }) {
      if(this.checkIds.indexOf(row.id)>=0) return "selected-row"
      return ""
    },
    selectable(row,rowIndex) {
      //索引是从0开始，条件1是指只有第2行数据不被禁用
      if (row.selectable == 0){
        return false;//禁用
      } else{
        return true;//不禁用
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fileCls {
  height: 26px;
  width: 30px;
  position: absolute;
  filter: alpha(opacity = 0);
  -moz-opacity: 0;
  opacity: 0;
  z-index: 110;
  cursor: pointer;
  float: right;
  margin-top: -26px;
  position: relative;
  left: -12px;
}

:deep(.selected-row) {
    background: rgb(235, 244, 255);
}

</style>