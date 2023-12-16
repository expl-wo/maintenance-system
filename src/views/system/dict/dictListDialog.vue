<template>
  <el-dialog draggable :close-on-click-modal="false" appendToBody title="选项配置"
             class="xui-dialog__limit-min" top="5vh"
             v-model="mainDialogVisible" modal width="1200px">
    <div class="panel-menu-wrapper">
      <!-- search -->
      <div class="panel-menu-search">
        <el-form :inline="true" :model="searchModel" class="demo-form-inline">
          <el-form-item label="" size="small">
            <el-input type="text" size="small" v-model="searchModel.keywords" class="form-control" placeholder="选项编码或名称"
                      @keyup.enter="handleSearch"  style="width: 200px;" prefix-icon="el-icon-search"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleSearch"  icon="el-icon-search" size="small">查询</el-button>
            <el-button type="primary"  icon="plus"  @click="handleAdd" size="small">新增
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="panel-menu-list">
        <div class="table-list xui-table__highlight">
          <el-table :data="dataList"
                    ref="tableRef"
                    highlight-current-row border stripe
                    style="font-size: 0.7rem"
          >
            <el-table-column prop="name" label="名称" align="center"></el-table-column>
            <el-table-column prop="code" label="编码" align="center"></el-table-column>

            <el-table-column prop="sort" label="顺序号" width="120" align="center"></el-table-column>
            <el-table-column prop="scope" label="模块" width="120" align="center">
              <template #default="scope">
                <xui-dictionary itemCode="moduleType" :code="scope.row.scope"></xui-dictionary>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="300">
              <template #default="scope">
                <el-button-group>
                  <el-button type="primary" size="small" icon="edit"
                             @click="handleSelect(scope.row)">选择
                  </el-button>
                  <el-button size="small" icon="edit"
                             @click="handleConfigItem(scope.row)">明细项配置
                  </el-button>
                  <el-button size="small" icon="edit"
                             @click="handleEdit(scope.row)">修改
                  </el-button>
                  <el-button size="small" type="danger" icon="delete"
                             @click="handleDelete(scope.row)">删除
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-dialog draggable  appendToBody :title="model.id? '编辑': '新增'" v-model="dialogVisible" modal>
        <el-form :model="model" ref="form" :rules="rules" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="code" label="选项编码" size="small">
                <el-input v-model="model.code" :disabled="!!model.id"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="name" label="选项名称" size="small">
                <el-input v-model="model.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="name" label="顺序号" size="small">
                <el-input-number v-model="model.sort" :min="0" class="fullWidth" style="width: 100%;"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div >
          <el-button size="small" @click="dialogVisible=false">取消</el-button>
          <el-button size="small" type="primary" @click="handleSubmit">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <div >
      <el-button size="small" @click="mainDialogVisible=false">关闭</el-button>
    </div>
    <el-dialog draggable v-model="itemDialogVisible" :close-on-click-modal="false" append-to-body  title="选项配置"
               modal width="1000px">
      <dict-item-dialog ref="dictItemDialogRef"></dict-item-dialog>
      <div >
        <el-button size="small" @click="itemDialogVisible=false">关闭</el-button>
      </div>
    </el-dialog>
  </el-dialog>

</template>
<script>
import dictHttp from '@/api/sys/dict'
import { deepClone } from '@/utils'
import constants from '@/utils/constants'
import dictItemDialog from '@/views/system/dict/dictItem.vue'

export default {
  components: {
    dictItemDialog
  },
  data(){
    return{
      curId: '',
      dataList: [],
      dialogVisible: false,
      itemDialogVisible:false,
      searchModel: {
        keywords: '',
        opType: ['1','0']
      },
      model: {
        itemCode: '',
        parentId: '',
        code: '',
        name: '',
        sort: '',
        scope: constants,
      },
      rules: {
        code: [{
          required: true, message: '选项编码不能为空', trigger: 'blur'
        }],
        name: [{
          required: true, message: '选项名称不能为空', trigger: 'blur'
        }]
      },
      mainDialogVisible: false
    }
  },
  mounted() {
    this.handleSearch();
  },
  methods:{
    init(){
      this.mainDialogVisible = true;
    },
    handleSelect(row){
      this.$emit('select', row);
      this.mainDialogVisible = false;
    },
    handleSearch() {
      dictHttp.getItem({
        keywords: this.searchModel.keywords,
        scope: constants
      }).then(response => {
        this.dataList = response.data
      })
    },
    handleConfigItem(row){
      this.itemDialogVisible = true
      this.$nextTick( ()=>{
        this.$refs.dictItemDialogRef.refresh(row);

      })

    },
    handleAdd() {
      this.model = {
        itemCode: '',
        parentId: '',
        code: '',
        name: '',
        sort: '',
        // scope: constants.moduleType.qualityCheck,
      }
      this.dialogVisible = true
    },
    handleEdit(rowData) {
      this.model = deepClone(rowData)
      this.dialogVisible = true
    },
    handleDelete(rowData) {
      this.$confirm(this.$constants.deleteTip).then(() => {
        dictHttp.delete({
          id: rowData.id
        }).then(response => {
          if (response.err_code === this.$constants.status.success) {
            this.$message({
              type: 'success',
              message: '选项删除成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: '选项删除失败'
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
    }
  }
}
</script>

<style scoped lang="scss">
</style>
