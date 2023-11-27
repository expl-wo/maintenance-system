<template>
  <div class="app-container app-containerC">

    <div class="otherCon wp">
      <el-table stripe  highlight-current-row  :id="eId" ref="tableDataRef" :row-class-name="tableRowClassName" :height="heightTable" :empty-text="emptyText" v-loading="vloading" border :data="data" style="font-size: 0.7rem" @row-click="handleClick" @row-dblclick="handleDblclick">
        <el-table-column
          v-for="(col, index) in rowHeader"
          :key="index"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :align="col.align"
          :fixed="col.fixed"
          :render-header="col.renderHead||checkHead"
        >
          <template v-slot:default="scope">
            <ex-slot v-if="col.render" :render="col.render" :row="scope.row" :index="scope.$index" :column="col" />
            <span v-else>
              <span v-if="col.prop == 'index'">{{ scope.$index+1 }}</span>
              <span v-else-if="col.prop == 'check'">
                <el-checkbox @change="checkboxClick($event, scope.row, checkData)" v-show="showCheckFun(scope.row)" selected></el-checkbox>
              </span>
              <span v-else-if="col.prop == 'upload'">
                <el-button type="primary" class="el-icon-upload"></el-button>
                <input name="file" type="file" class="fileCls" :accept="acceptFormat" @change="changeUploadFile($event, scope.row)"/>
              </span>
              <span v-else> {{ scope.row[col.prop] }}</span>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination v-if="isPagination" :total="total" :page="page" :limit="limit" @pagination="getList" :hidePage="hidePage" class="searchCon wp" />

  </div>
</template>

<script>
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
  },

  render: (h, data) => {
    const params = {
      row: data.props.row,
      index: data.props.index
    }

    if (data.props.column) params.column = data.props.column
    return data.props.render(h, params)
  }
}

export default {
  name: 'TableSimple',
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
    isPagination: {
      required: false,
      type: Boolean,
      default: true
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
      default: function(val){
        return true
      }
    },
    eId: {
      type: String,
      default: ''
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    }
  },
  data() {
    return {
      checkData: [],
      checkAll:[]
    }
  },
  beforeUpdate() {
    this.$nextTick(() => {
      this.$refs.tableDataRef.doLayout()
      this.checkData = []
    })
  },
  mounted(){
    this.onload()
    this.checkboxClick()
  },
  methods: {
    onload(){
      for (let i=0;i<this.limit;i++){
        this.checkAll[i]=false;
      }
    },
    checkHead(h, { column }){
      let self=this;
      if (column.label=="全选"){
        return h("span" ,[
          h("el-checkbox", {
            on: {
              change: function(val) {
                // for (let i=0;i<self.checkAll.length;i++){
                //   self.checkAll[i]=val;
                // }
                // console.log(self.checkAll)
                self.$emit('checkAll',val)
              }
              // change: self.$emit('checkAll',{})
            }
          })
        ]);
      }
      return h("span", [
        h("span", column.label)
      ]);
    },
    getList(val) {
      this.$emit('pagination', { page: val.page, limit: val.limit })
    },
    handleClick(val) {
      this.$emit('handleClick', { item: val })
    },
    handleDblclick(val) {
      this.$emit('handleDblclick', { item: val })
    },
    // 选择
    checkboxClick(val, item) {
      if(item) {
        const checkData = this.checkData
        val ? checkData.push(item) : checkData.splice(checkData.indexOf(item),1)
        // checkItem选中的数据  lengthData选中的个数
        this.$emit('checkboxClick', { checkItem: checkData, lengthData: checkData.length })
      }else{
        this.$emit('checkboxClick', { checkItem: [], lengthData: 0 })
      }
    },
    // 上传
    changeUploadFile(e, row) {
      this.$emit('changeUploadFile', { e: e, row: row })
    },
    //背景
    tableRowClassName({ row, rowIndex }) {
      if(this.checkData.indexOf(row)>=0) return "selected-row"
      return ""
    },
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

///deep/.selected-row {
//  background: rgb(235, 244, 255);
//}

</style>
