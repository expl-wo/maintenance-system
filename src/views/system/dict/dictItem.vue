<template>
  <!-- 列表 -->
  <div class="panel-body" style="flex: 1;">
    <!-- 搜索区域 -->
    <div class="c-search-wrapper">
      <el-form :inline="true" :model="searchModel" class="demo-form-inline">
        <el-form-item label="明细名称">
          <el-input v-model="searchModel.name" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item label="明细编码">
          <el-input v-model="searchModel.code" @keyup.enter.native="handleSearch"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearch" icon="Search" >查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" icon="Plus"  @click="handleAdd"
                     :disabled="disabledAddBtn"
          >新增
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格列表 -->
    <el-table stripe  v-loading="loading" :data="dataTree"
              row-key="id"
              highlight-current-row border
              default-expand-all
              style="font-size: 0.7rem"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="明细名称" align="center"></el-table-column>
      <el-table-column prop="code" label="明细编码" width="180" align="center"></el-table-column>
      <el-table-column prop="sort" label="排序号" width="90" align="center"></el-table-column>
      <el-table-column prop="remark" label="补充字段1" width="180" align="center"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template v-slot="scope">
          <el-button-group>
            <el-button  type="primary" icon="Edit"
                        @click="modifyHandle(scope.row)">
            </el-button>
            <el-button type="danger" icon="Delete"
                       @click="deleteHandle(scope.row)">
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog draggable  appendToBody :title="model.id? '编辑': '新增'"
               v-if="showDialog"
               v-model="dialogVisible" modal
    >
      <el-form :model="model" ref="formRef" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="code" label="字典项编码">
              <el-input v-model="model.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="name" label="字典项名称">
              <el-input v-model="model.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="remark" label="补充字段1">
              <el-input v-model="model.remark"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="remark2" label="补充字段2">
              <el-input v-model="model.remark2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="name" label="顺序号">
              <el-input-number v-model="model.sort" :min="0" class="fullWidth" style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </div>
      </template>
    </el-dialog>
  </div>
</template>

<script type="text/jsx">
import dictHttp from '@/api/sys/dict'
import { deepClone } from '@/utils'
import { deleteDictItem } from '@/components/xui/dictionary'
import Constants from "../../../utils/constants";

export default {
  data() {
    return {
      loading: false,
      rootParent: {},
      selectedTreeData: [],
      expandRowKeys: [],
      selectedExpandRowKeys: [],

      dataTree: [],
      disabledAddBtn: true,
      dialogVisible: false,
      searchModel: {
        code: '',
        name: ''
      },
      model: {
        id: '',
        itemCode: '',
        parentId: '',
        parentName: '',
        code: '',
        name: '',
        sort: '',
        scope: '',
        remark: '',//补充字段1
        remark2: ''//补充字段2
      },
      rules: {
        code: [{
          required: true, message: '明细编码不能为空', trigger: 'blur'
        }],
        name: [{
          required: true, message: '明细名称不能为空', trigger: 'blur'
        }]
      },
      random: null,
      selectParams: {
        multiple: false,
        clearable: false,
        placeholder: '请选择'
      },
      treeParams: {
        clickParent: true,
        filterable: false,
        'check-strictly': true,
        'default-expand-all': true,
        'expand-on-click-node': false,
        data: [],
        props: {
          'children': 'children',
          'label': 'name',
          'value': 'id'
        }
      },
      showDialog: false
    }
  },
  methods: {
    handleReset() {
      this.searchModel = {
        code: '',
        name: ''
      }
      this.handleSearch()
    },
    refresh(params) {
      this.showDialog = false
      this.rootParent = params
      this.searchModel = {
        code: '',
        name: ''
      }
      this.handleSearch()
    },
    treeSelect(data) {
      this.model.parentName = data.name
      this.model.parentId = data.id
    },
    handleSearch() {
      this.loading = true
      let random = Math.random()
      this.random = random
      this.disabledAddBtn = true
      dictHttp.getDetail({
        code: this.searchModel.code,
        name: this.searchModel.name,
        itemCode: this.rootParent.itemCode
      }).then(response => {
        if (this.random !== random) {
          return
        }
        this.loading = false
        let result = response.data
        this.childrenSetParentName(result, this.rootParent.name)
        this.constructSelectedTree(result)
        this.dataTree = result
        if (this.dataTree && this.dataTree.length > 0) {
          this.dataTree[0] && (this.expandRowKeys = [this.dataTree[0].id])
        }
      }).finally(() => {
        this.disabledAddBtn = false
      })
    },
    constructSelectedTree(result) {
      let data = []
      let parent = deepClone(this.rootParent)
      parent.children = result
      data.push(parent)
      this.selectedTreeData = data
      this.treeParams.data = data
      this.selectedExpandRowKeys = [parent.id]
      this.model.parentId = parent.id
      this.model.parentName = parent.name
    },
    childrenSetParentName(result, parentName) {
      result.forEach(item => {
        item.parentName = parentName
        if (item.children && item.children.length >= 0) {
          this.childrenSetParentName(item.children, item.name)
        }
      })
    },
    modifyHandle(rowData) {
      this.showDialog = true
      let model = deepClone(rowData)
      model.parentId = rowData.parentId ? rowData.parentId : rowData.pid
      model.parentName = rowData.parentName
      this.model = model
      this.dialogVisible = true
    },
    deleteHandle(rowData) {
      this.$confirm(Constants.deleteTip).then(() => {
        dictHttp.delete({
          id: rowData.id
        }).then(response => {
          if (response.err_code === Constants.statusCode.success) {
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
          //对字典数据清空缓存
          deleteDictItem(this.rootParent.itemCode)
        })
      })
    },
    handleAdd() {
      this.showDialog = true
      this.model = {
        id: '',
        itemCode: this.rootParent.itemCode,
        parentId: this.rootParent.id,
        parentName: this.rootParent.name,
        code: '',
        name: '',
        sort: '',
        scope: '',
        remark: '',//补充字段1
        remark2: ''//补充字段2
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate()
      })
    },
    handleSubmit() {
      const self = this
      self.$refs.formRef.validate(val => {
        if (!val) {
          return
        }
        let params = {
          itemCode: this.rootParent.itemCode,
          parentId: this.model.parentId,
          code: this.model.code
        }
        if (this.model.id) {
          params.id = this.model.id
        }
        dictHttp.codeUnion(params).then(response => {
          if (response.data && response.data.result) {
            dictHttp.addOrUpdate({
              ...this.model
            }).then(result => {
              self.dialogVisible = false
              self.handleSearch()
            })
            //对字典数据清空缓存
            deleteDictItem(params.itemCode)
          } else {
            this.$message.error('编码重复，请重新输入')
          }
        })
      })
    }
  }
}
</script>
