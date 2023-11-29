<!-- 参数管理 -->
<template>
  <div class="app-container app-containerC">
    <div class="filter-container searchCon">
      <el-form :inline="true" :model="searchParams" class="form-inline">
        <el-form-item label="" size="mini">
          <el-input placeholder="编号、名称搜索" v-model="searchParams.keywords" @keyup.enter.native="searchHandle"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="searchHandle" icon="el-icon-search"  size="mini">查询</el-button>
          <el-button type="primary" icon="el-icon-plus"  @click="addHandle" size="mini">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="app-container app-containerC">
      <div class="otherCon wp">
        <el-table stripe  :data="dataList"
                  size="mini"
                  highlight-current-row border
                  style="font-size: 0.7rem"
                  :height="'100%'"
        >
          <el-table-column prop="code" label="设备编码" align="center"></el-table-column>
          <el-table-column prop="name" label="设备名称" align="center"></el-table-column>
          <el-table-column prop="remark" label="说明" align="left" header-align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template  #default="scope">
              <el-button-group>
                <el-button  type="primary" size="mini" icon="el-icon-edit"
                            @click="handleEdit(scope.row)">
                </el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete"
                           @click="deleteHandle(scope.row)">
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页  -->
      <el-pagination :page-size="pageSize" :total="total" @size-change="handleSizeChange"
                     :current-page="pageNum"
                     @current-change="handlePgChange"
      ></el-pagination>
    </div>
    <el-dialog v-draggable  appendToBody :title="model.id ? '修改': '新增'" :visible.sync="dialogVisible" modal>
      <el-form :model="model" class="element-list" ref="form"
               :rules="rules"
               style="overflow-y: auto;" label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item prop="code" label="设备编号" size="mini">
              <el-input v-model="model.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="name" label="设备名称" size="mini">
              <el-input v-model="model.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="remark" label="备注" size="mini">
              <el-input v-model="model.remark" type="textarea" :rows="5"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="dialogVisible=false">取消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import wireWrapInfoHttp from '@/api/em/wireWrapInfo'
import { deepClone } from '@/utils'

export default {
  name: 'wireWrapDeviceBaseInfo',
  components: {},
  data() {
    return {
      total: 0,
      pageNum: 1,
      pageSize: 10,
      dataList: [],
      dialogVisible: false,
      searchParams: {
        keywords: ''
      },
      model: {
        id: '',
        code: '',
        name: '',
        remark: ''
      },
      rules: {
        code: [{
          required: true, trigger: 'blur', message: '设备编码不能为空'
        }],
        name: [{
          required: true, trigger: 'blur', message: '设备名称不能为空'
        }],
      }
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    handleSizeChange(limit) {
      this.pageSize = limit
      this.getDataList()
    },
    // 查询返回数据
    getDataList() {
      let params = {}
      for (let key in this.searchParams) {
        params[key] = this.searchParams[key]
      }
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      wireWrapInfoHttp.list(params).then(response => {
        if (response.err_code === this.$constants.status.success) {
          this.dataList = response.data
          this.total = response.total_count
        }
      })
    },
    // 分页组件操作回调
    handlePgChange(page, limit) {
      this.pageNum = page
      this.pageSize = limit
      this.getDataList()
    },
    // 搜索返回列表
    searchHandle() {
      this.getDataList()
    },
    addHandle() {
      this.model = {
        id: '',
        code: '',
        name: '',
        remark: ''
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    handleEdit(rowData){
      this.model = deepClone(rowData)
      this.dialogVisible  = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    // 删除参数
    deleteHandle(rowData) {
      this.$confirm(this.$constants.deleteTip).then(() => {
        wireWrapInfoHttp.delete({
          id: rowData.id
        }).then(response => {
          if (response.err_code === this.$constants.status.success) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: response.msg
            })
          }
          this.getDataList()
        })
      })
    },
    // 新增/编辑提交
    handleSubmit() {
      const self = this
      self.$refs.form.validate(val => {
        if (!val) {
          return
        }
        let isCodeAvailableParams = {
          code: this.model.code,
          id: this.model.id
        }
        this.isCodeAvailable(isCodeAvailableParams).then(response => {
          if (response.data && response.data.result) {
            let model = this.model;
            wireWrapInfoHttp.addOrUpdate(model).then(addOrUpdateResponse => {
              if (addOrUpdateResponse.err_code === this.$constants.status.success) {
                self.$message({
                  type: 'success',
                  message: '设备保存成功'
                })
                self.dialogVisible = false
                self.getDataList()
              } else {
                this.$message({
                  type: 'error',
                  message: '设备保存失败'
                })
              }
            })
          } else {
            this.$message.error('设备编码重复，请重新输入')
          }
        })
      })
    },
    // 检查编码是否可用
    isCodeAvailable(params) {
      return wireWrapInfoHttp.codeUnion(params)
    }
  }
}
</script>

<style scoped>
.text-ellipsis {
  max-width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>