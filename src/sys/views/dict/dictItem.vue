<template>
  <div class="filter-container searchCon">
    <el-row>
      <el-form :inline="true">
        <!--   <el-form-item prop="title" label="明细名称：">
             <el-input @keyup.enter="handleQuery" v-model="searchModel.name" clearable></el-input>
           </el-form-item>
           <el-form-item prop="title" label="明细编码：">
             <el-input @keyup.enter="handleQuery" v-model="searchModel.code" clearable></el-input>
           </el-form-item>-->
        <el-form-item>
          <el-button icon="Plus" type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
  <el-table highlight-current-row  row-key="id" default-expand-all ref="multipleTable" :data="dataList" border stripe
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
    <el-table-column label="明细名称" align="left" prop="name" min-width="160"></el-table-column>
    <el-table-column label="明细编码" prop="code" width="180" align="center"></el-table-column>
    <el-table-column label="顺序号" prop="sort" width="80" align="center"></el-table-column>
    <el-table-column label="补充字段" prop="remark" min-width="200" align="center"></el-table-column>
    <el-table-column label="操作" width="190" align="center">
      <template #default="scope">
        <el-button-group>
          <el-button type="primary" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" @click="handleDelete(scope.row)">
            删除
          </el-button>
          <el-button type="primary" @click="handleAddChild(scope.row)">
            新增下级
          </el-button>
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog draggable :close-on-click-modal="false" :title="initModel.id?'修改': '新增'" width="500"
             v-if="dialogFormVisible" v-model="dialogFormVisible" class="dictItemDialog">
    <el-form ref="formRef" label-width="100px" :rules="rules" :model="initModel">
      <el-form-item prop="name" label="父节点">
        <el-input v-model="initModel.parentName" :maxlength="50" :minlength="1" disabled></el-input>
      </el-form-item>
      <el-form-item prop="name" label="明细名称">
        <el-input v-model="initModel.name" :maxlength="50" :minlength="1"></el-input>
      </el-form-item>
      <el-form-item prop="code" label="明细编码">
        <el-input v-model="initModel.code" :maxlength="50" :minlength="1"></el-input>
      </el-form-item>
      <el-form-item prop="remark" label="补充字段">
        <el-input v-model="initModel.remark" :maxlength="128" :minlength="1"></el-input>
      </el-form-item>
      <el-form-item prop="remark" label="补充字段2">
        <el-input v-model="initModel.remark2" :maxlength="128" :minlength="1"></el-input>
      </el-form-item>
      <el-form-item prop="sort" label="顺序号" style="width: 90%">
        <el-input-number v-model="initModel.sort" :min="0" :maxlength="4"></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save()">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {
  defineComponent,
  onMounted,
  reactive,
  ref
} from "vue";
import Constants from "@/_public/utils/constants";
import {deleteDictItem} from '@/_public/components/xui/dictionary/index'
import {
  ElMessage,
  ElMessageBox
} from "element-plus";
import {
  getDictList,
  insertOrUpdateDict,
  deleteDict,
  getListByItemCode
} from "@/sys/api/dict.ts"
import {Refresh} from "@element-plus/icons-vue";
import {deepClone} from "@/_public/utils";
import {copyExistProps} from "@/_public/utils/obj";

export default defineComponent({
  name: "list",
  data() {
    return {
      dialogFormVisible: false,
      dataList: [],
      initModel: {
        id: '',
        code: '',
        name: '',
        sort: '',
        parentId: '',
        parentName: '',
        itemCode: '',
        remark: '',
        remark2: ''
      },
      searchModel: {
        code: '',
        name: '',
      },
      rootDict: null,
      parentNode: null
    }
  },
  methods: {
    init(selectData) {
      this.initModel = {
        id: '',
        code: '',
        name: '',
        sort: '',
        parentId: this.parentNode.id,
        parentName: this.parentNode.name,
        itemCode: this.rootDict.code,
        remark: '',
        remark2: ''
      }

      if (selectData !== null && selectData !== undefined) {
        copyExistProps(this.initModel, selectData);
      } else {
        //说明是新增，在最大值上加1
        this.setSort(this.initModel);
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate();
      })
    },
    setSort(data) {
      let sameLevelDataList = null;
      if(this.rootDict === this.parentNode){
        sameLevelDataList = this.dataList;
      }else{
        sameLevelDataList = this.parentNode.children;
      }
      if (!sameLevelDataList || sameLevelDataList.length === 0) {
        data.sort = 1;
      } else {
        let max = 1;
        sameLevelDataList.forEach(item => {
          if (item.sort > max) {
            max = item.sort;
          }
        })
        data.sort = max + 2;
      }
    },
    save() {
      this.$refs.formRef.validate(valid => {
        if (!valid) {
          return;
        }
        this.initModel.itemCode = this.rootDict.code
        this.initModel.parentId = this.parentNode.id
        delete this.initModel.children;
        insertOrUpdateDict(this.initModel).then(response => {
          if (response.code === Constants.respCode.success) {
            this.$message.success('保存/修改成功');
            this.dialogFormVisible = false;
            this.refresh();
            deleteDictItem(this.rootDict.code);
          } else {
            this.$message.error(response.msg)
          }
        })
      })
    },
    handleAddChild(parentNode) {
      this.parentNode = parentNode;
      this.init();
    },
    handleQuery() {
      this.refresh();
    },
    handleEdit(rowData) {
      this.parentNode = rowData.parentNode;
      this.init(rowData);
    },
    handleAdd() {
      this.parentNode = this.rootDict;
      this.init();
    },
    initItem(param) {
      this.rootDict = param;
      this.refresh();
    },
    async refresh() {
      let params = {
        ...this.model,
        itemCode: this.rootDict.code,
        parentId: this.rootDict.id
      }
      var response = await getListByItemCode(params)
      if (response.code === Constants.respCode.success) {
        this.addParentNode(response.data, this.rootDict);
        this.dataList = response.data;
      } else {
        ElMessageBox({
          type: 'error',
          message: '查询失败'
        })
      }
    },
    handleDelete(rowData) {
      ElMessageBox.confirm(
          '确定删除？',
          '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            let params = {
              id: rowData.id
            }
            deleteDict(params).then(response => {
              if (response.code == Constants.respCode.success) {
                ElMessage({
                  message: '删除成功',
                  type: 'success',
                })
              }
              this.refresh()
            })
          })
    },
    addParentNode(dataList, parentNode) {
      dataList.forEach(item => {
        item.parentNode = parentNode;
        if (item.children && item.children.length > 0) {
          this.addParentNode(item.children, item)
        }
      })
    }
  },
  onMounted() {
    this.refresh();
  }
})
</script>

<style scoped>
</style>