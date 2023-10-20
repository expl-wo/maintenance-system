<template>
  <div class="panel-menu-wrapper">
    <!-- search -->
    <div class="panel-menu-search">
      <el-form :inline="true" :model="searchModel" class="demo-form-inline">
        <el-form-item label="" size="mini">
          <el-input type="text" size="mini" v-model="searchModel.keywords" class="form-control" placeholder="字典代码或名称"
                    @keyup.enter.native="handleSearch"  style="width: 200px;" prefix-icon="el-icon-search"
          ></el-input>
        </el-form-item>
       <!-- <el-form-item label="" size="mini">
          <xui-dict-select item-code="opType" multiple include-all size="mini" v-model="searchModel.opType"
                           class="form-control" placeholder="字典代码或名称"></xui-dict-select>
        </el-form-item>-->
        <el-form-item>
          <el-button @click="handleSearch"  icon="Search" size="mini">查询</el-button>
          <el-button type="primary"  icon="Plus"  @click="handleAdd" size="mini">新增
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- panel-menu-title -->
   <!-- <div class="panel-menu-title">
      <div class="action" style="margin-top: 6px;">
        <el-button type="primary" size="mini" @click="handleAdd">新增</el-button>
      </div>
    </div>-->
    <div class="panel-menu-list">
        <div class="table-list xui-table__highlight">
          <el-table stripe  :data="dataList"
                    ref="tableRef"
                    highlight-current-row border
                    @row-click="handleClick"
                    style="font-size: 0.7rem"
          >
            <el-table-column prop="name" label="名称" align="center"></el-table-column>
            <el-table-column prop="code" label="编码" align="center"></el-table-column>
            <el-table-column prop="sort" label="序号" width="50" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template v-slot:default="scope">
                <el-button-group>
                  <el-button  type="primary" size="mini" icon="Edit"
                              @click="handleEdit(scope.row)">
                  </el-button>
                  <el-button type="danger" size="mini" icon="Delete"
                             @click="handleDelete(scope.row)">
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page="searchModel.pg_pagenum"
            :page-sizes="[100, 200, 500]"
            :page-size="searchModel.pg_pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        <!--<ul class="panel-menu">
          <li v-for="(item, key) in dataList" :class="{'cur': item.id===curId}"
              @mouseleave="item.showDropBtn = false" @mouseenter="item.showDropBtn = true"
              @click.stop="handleClick(item)">
            <a href="javascript:void(0)">{{item.name}}</a>
            <a href="javascript:void(0)">{{item.code}}</a>
            <div v-if="item.canExtend === 'Y'" class="dropdown dropdown-icon action-btn"
                 :class="{'dis_block': item.showDropBtn || (item.id===curId)}"
                 @click.stop="item.showDropdown= true" @mouseleave="item.showDropdown = false">
              <button class="btn btn-default" type="button" data-toggle="dropdown">
                <span class="icon iconfont iconlist" style="margin-right: 6px;"></span>
              </button>
              <ul class="dropdown-menu" :class="{'dis_block': item.showDropdown}">
                <li><a href="javascript:void(0);" @click.stop="handleEdit(item)">编辑</a></li>
                <li><a href="javascript:void(0);" @click.stop="handleDelete(item)">删除</a></li>
              </ul>
            </div>
          </li>
        </ul>-->
      </div>

    <el-dialog v-dialogDrag  appendToBody :title="model.id? '编辑': '新增'" v-model="dialogVisible" modal>
      <el-form :model="model" ref="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="code" label="字典项编码" size="mini">
              <el-input v-model="model.code" :disabled="!!model.id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="name" label="字典项名称" size="mini">
              <el-input v-model="model.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
        <!--  <el-col :span="12">
            <el-form-item prop="scope" label="适用范围" size="mini">
              <xui-dict-select v-model="model.scope" itemCode="useScope" class="fullWidth"></xui-dict-select>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item prop="name" label="顺序号" size="mini">
              <el-input-number v-model="model.sort" :min="0" class="fullWidth" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
        <el-button size="mini" @click="dialogVisible=false">取消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmit">保存</el-button>
      </div>
      </template>
    </el-dialog>
  </div>
</template>

<script type="text/jsx">
import dictHttp from '@/api/sys/dict'
import { deepClone } from '@/utils'
import Constants from "../../../utils/constants";

export default {
  data() {
    return {
      curId: '',
      dataList: [],
      dialogVisible: false,
      total: 0,
      searchModel: {
        keywords: '',
        opType: ['1','0'],
        pg_pagenum:1, // 每页显示多少条数据，默认为10条 pg_pagenum
        pg_pagesize: 50, // 查询第几页数据，默认第一页 pg_pagesize
      },
      model: {
        itemCode: '',
        parentId: '',
        code: '',
        name: '',
        sort: '',
        scope: '',
      },
      rules: {
        code: [{
          required: true, message: '字典项编码不能为空', trigger: 'blur'
        }],
        name: [{
          required: true, message: '字典项名称不能为空', trigger: 'blur'
        }]
      }
    }
  },
  mounted() {
    this.handleSearch()
  },

  methods: {
    handleSearch() {
      dictHttp.getItem({
        keywords: this.searchModel.keywords
      }).then(response => {
        response.data.forEach((item, index) => {
          item.showDropdown = false
          item.showDropBtn = false
          if (index === 0) {
            this.$refs.tableRef.setCurrentRow(item);
            this.handleClick(item)
          }
        })
        this.dataList = response.data
      })
    },
    handleClick(item) {
      this.curId = item.id
      this.$emit('updateChild', item)
    },
    handleAdd() {
      this.model = {
        itemCode: '',
        parentId: '',
        code: '',
        name: '',
        sort: '',
        scope: '',
      }
      this.dialogVisible = true
    },
    handleEdit(rowData) {
      this.model = deepClone(rowData)
      this.dialogVisible = true
    },
    handleDelete(rowData) {
      this.$confirm(Constants.deleteTip).then(() => {
        dictHttp.delete({
            id: rowData.id
        }).then(response => {
          if (response.err_code === Constants.respCode.success) {
            this.$message({
              type: 'success',
              message: '字典项删除成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: '字典项删除失败'
            })
          }
          this.handleSearch()
        })
      })
    },
    handleSubmit() {
      const self = this
      self.$refs.form.validate(val => {
        if (!val) {
          return
        }
        let params = {
          code: this.model.code
        }
        if (this.model.id) {
          params.id = this.model.id
        }
        dictHttp.codeUnion(params).then(response => {
          if (response.data && response.data.result) {
            this.model.itemCode = this.model.code
            dictHttp.addOrUpdate(this.model).then(result => {
              self.dialogVisible = false
              self.handleSearch()
            })
          } else {
            this.$message.error('编码重复，请重新输入')
          }
        })
      })
    },
    // 分页数据发生变化
    handleSizeChange(val) {
      this.listQuery.pg_pagesize = val
      this.onQuery() // 查询
    },
    handleCurrentChange(val) {
      this.listQuery.pg_pagenum = val
      this.onQuery() // 查询
    },
  }
}
</script>

<style scoped>
.panel .panel-menu > li .action-btn.dis_block {
  display: block;
  margin-right: 5px;
  cursor: pointer;
}

.dropdown-menu.dis_block {
  display: block;
}

.dropdown-menu > li > a {
  padding: 6px 6px;
}

.panel .panel-menu .dropdown-menu {
  width: 44px;
}

.dropdown-icon .dropdown-menu:after {
  margin-left: -16px;
}

.panel .panel-menu .dropdown-menu {
  left: -16px;
}
</style>
