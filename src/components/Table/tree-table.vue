<template>
  <div class="app-container app-containerC">

    <div class="otherCon wp" >
      <el-table ref="menusTable" stripe="true" :row-style="showRow" :height="heightTable" v-loading="vloading" highlight-current-row border :data="menusTable" style="font-size: 0.7rem" v-bind="$attrs">
        <el-table-column
          v-for="(col, index) in rowHeader"
          :key="index"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :align="col.align"
          >
          <template  #default="scope" >
            <ex-slot v-if="col.render" :render="col.render" :row="scope.row" :index="scope.$index" :column="col" />
            <span v-else>
              <span v-if="col.prop == 'check'">
                <el-checkbox @change="checkboxClick($event, scope.row, checkData)" selected></el-checkbox>
              </span>
              <span v-else-if="col.prop == 'upload'">
                <el-button type="primary" class="el-icon-upload"></el-button>
                <input name="file" type="file" class="fileCls" :accept="acceptFormat" @change="changeUploadFile($event, scope.row)"/>
              </span>
              <span :class="['level'+scope.row.level]" v-else-if="col.prop === 'name'">
                <i v-if="scope.row.sub" @click="openToggle(scope.row, menusTable)"
                  :class="[scope.row.open?'el-icon-arrow-down':'el-icon-arrow-right']"></i>
              </span>
              {{scope.row[col.prop]}}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination :total="total" :page="page" :limit="limit" @pagination="getList" :hidePage="hidePage" class="searchCon wp" />

  </div>
</template>

<script>
import Vue from 'vue'
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
  name: 'Table',
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
    menusTable: {
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
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'sub',
        label: 'title'
      }
    }
  },
  mounted() {
  },
  // 初始化函数，赋值，menusTree =>menusTable
  // created() {
  //   this.menusTable = this.menusTree;
  // },
  beforeUpdate() {
    this.$nextTick(() => {
      this.$refs.menusTable.doLayout()
      this.checkData = []
    })
  },
  methods: {
    showRow: function (row) {
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true;
      row.row._show = show;
      return show
        ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;"
        : "display:none;";
    },
    // 树节点开关操作
    openToggle: function (item, menusTable) {
      // 这里只是展开和关闭样式的变换方法
      Vue.set(item, 'open', !item.open);
      // 展开的时候，显示子节点，关闭的时候隐藏子节点
      // 遍历所有的子节点，加入到menuTable中
      for (let j = 0; j < this.menusTable.length; j++) {
        // 找到父节点的id，然后依次把子节点放到数组里面父节点后面
        if (this.menusTable[j].id !== item.id) {
          continue;
        }
        this.menuTable(item, j)
        break;
      }
    },
    menutableFirst(item, j) {
      item.forEach((element, index) => {
        element.open = false
        if(element && element.sub) {
          this.menusTable.splice(j + 1, element.sub.length); // 删除子节点
          this.menutableFirst(element.sub, j)
        }
      })
    },
    menuTable(item, j){
      if (item.open) { // open => close
        let menusTable = this.menusTable;
        item.sub.forEach(function (child, index) {
          menusTable.splice(j + index + 1, 0, child); // 添加子节点
        })
      } else {
        this.menusTable.splice(j + 1, item.sub.length); // 删除子节点
        if(item.sub) {
          this.menutableFirst(item.sub, j)
        }
      }
    },
    getList(val) {
      this.$emit('pagination', { page: val.page, limit: val.limit })
    },
    handleClick(val) {
      this.$emit('handleClick', { item: val })
    },
    // 选择
    checkboxClick(val, item) {
      const checkData = this.checkData
      val ? checkData.push(item) : checkData.splice(checkData.indexOf(item),1)
      // checkItem选中的数据  lengthData选中的个数
      this.$emit('checkboxClick', { checkItem: checkData, lengthData: checkData.length })
    },
    // 上传
    changeUploadFile(e, row) {
      this.$emit('changeUploadFile', { e: e, row: row })
    }
  }
}
</script>

<style scoped>
.level1, .level2, .level3, .level4, .level5, .level6, .level7, .level8, .level9, .level10 {
  display: inline-block;
  width: 20px;
}
.level1 { margin-left: 5px;}
.level2 { margin-left: 20px;}
.level3 { margin-left: 35px;}
.level4 { margin-left: 50px;}
.level5 { margin-left: 65px;}
.level6 { margin-left: 80px;}
.level7 { margin-left: 95px;}
.level8 { margin-left: 110px;}
.level9 { margin-left: 125px;}
.level10 { margin-left: 140px;}
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
</style>
